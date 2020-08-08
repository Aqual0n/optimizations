const fs = require('fs')
const path = require('path')
const LRU = require('lru-cache')
const express = require('express')
const session = require('express-session')
const compression = require('compression')
const microcache = require('route-cache')
const cors = require('cors')

const resolve = file => path.resolve(__dirname, file)
const { createBundleRenderer } = require('vue-server-renderer')

const isProd = process.env.NODE_ENV === 'production'
const useMicroCache = process.env.MICRO_CACHE !== 'false'
const serverInfo =
    // eslint-disable-next-line global-require
    `express/${require('express/package.json').version} ` +
    `vue-server-renderer/${require('vue-server-renderer/package.json').version}`

const app = express()
app.use(cors({ origin: 'http://seltrans.ru' }))

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))

const nodemailer = require('nodemailer')

const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))
app.use(bodyParser.json({ limit: '10mb', extended: true }))

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'siteinformingservice@gmail.com',
        pass: 'Palach93'
    }
})

const device = require('express-device')

app.use(device.capture())

function createRenderer (bundle, options) {
    return createBundleRenderer(bundle, Object.assign(options, {
        cache: LRU({
            max: 1000,
            maxAge: 1000 * 60 * 15
        }),
        basedir: resolve('./dist'),
        runInNewContext: false
    }))
}

let renderer
let readyPromise
const templatePath = resolve('./src/index.template.html')
if (isProd) {
    // In production: create server renderer using template and built server bundle.
    // The server bundle is generated by vue-ssr-webpack-plugin.
    const template = fs.readFileSync(templatePath, 'utf-8')
    const bundle = require('./dist/vue-ssr-server-bundle.json')
    // The client manifests are optional, but it allows the renderer
    // to automatically infer preload/prefetch links and directly add <script>
    // tags for any async chunks used during render, avoiding waterfall requests.
    const clientManifest = require('./dist/vue-ssr-client-manifest.json')
    renderer = createRenderer(bundle, {
        template,
        clientManifest
    })
} else {
    // In development: setup the dev server with watch and hot-reload,
    // and create a new renderer on bundle / index template update.
    readyPromise = require('./build/setup-dev-server')(
        app,
        templatePath,
        (bundle, options) => {
            renderer = createRenderer(bundle, options)
        }
    )
}

const serve = (path, cache) => express.static(resolve(path), {
    maxAge: cache && isProd ? 1000 * 60 * 60 * 24 * 30 : 0
})

app.use(compression({ threshold: 0 }))
app.use('/dist', serve('./dist', true))
app.use('/public', serve('./public', true))
app.use('/manifest.json', serve('./manifest.json', true))
app.use('/service-worker.js', serve('./dist/service-worker.js'))
app.use('/css', serve('./public/css', true))
app.use('/fonts', serve('./public/fonts', true))
app.use('/content', serve('./content', true))
app.use('/robots.txt', serve('./public/robots.txt', true))
app.use('/mailru-domainbOGaPuznsXompOOB.html', serve('./public/mailru-domainbOGaPuznsXompOOB.html', true))
app.use('/sitemap.xml', serve('./public/sitemap.xml', true))
app.use('/img', serve('./public/img', true))
app.use('/share', serve('./public/share', true))
app.use('/favicon', serve('./public/favicon', true))
app.use('/video', serve('./public/video', true))
app.use(microcache.cacheSeconds(1, req => useMicroCache && req.originalUrl))

function render (req, res) {
    if (req.path.substr(-1) === '/' && req.path.length > 1) {
        const query = req.url.slice(req.path.length)
        res.redirect(301, req.path.slice(0, -1) + query)
        return
    }

    const browser = 'other'
    const context = {
        title: '',
        device: req.device.type.toLowerCase(),
        url: req.url,
        meta: '',
        browser,
        language: req.url.indexOf('/en') !== -1 ? 'en' : 'ru'
    }

    const s = Date.now()
    res.setHeader('Content-Type', 'text/html')
    res.setHeader('Server', serverInfo)
    const handleError = err => {
        if (err.url) {
            res.redirect(err.url)
        } else if (err.code === 404) {
            // res.status(404).send('404 | Page Not Found')
            res.status(404).sendFile(path.join(`${__dirname}/content/404${context.language}.html`))
        } else {
            // const mailOptions = {
            //     from: 'Ошибка 500 Biopack <siteinformingservice@gmail.com>',
            //     to: 'caspanch@gmail.com',
            //     subject: 'Ошибка 500 Biopack',
            //     html: err.stack + ' URL:' + req.url
            // };
            //
            // transporter.sendMail(mailOptions, function (err, info) {
            //
            // });
            res.status(500).send('500 | Internal Server Error')
            console.error(`error during render : ${req.url}`)
            console.error(err.stack)
        }
    }

    renderer.renderToString(context, (err, html) => {
        if (err) {
            return handleError(err)
        }

        if (context.state.route.name === '404' || context.state.route.name === '404En') {
            res.status(404).send(html)
            return
        }

        res.send(html)
        if (!isProd) {
            console.log(`whole request: ${Date.now() - s}ms`)
        }
    })
}

app.get('*', isProd ? render : (req, res) => {
    readyPromise.then(() => render(req, res))
})

const port = process.env.PORT || 4545
app.listen(port, () => {
    console.log(`server started at localhost:${port}`)
})
