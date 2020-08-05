const fs = require('fs')
const webfont = require('webfont').default

const fontPath = './public/fonts/icons/'

webfont({
    files: './src/assets/icons/**/*.svg',
    template: './src/util/template.html.njk',
    templateFontPath: fontPath,
    fontName: 'iconfont',
    formats: [
        'woff',
        'woff2'
    ],
    fontHeight: 600,
    normalize: true,
    sort: false
})
    .then(result => {
        fs.writeFileSync(`${fontPath}demo.html`, result.template)
        fs.writeFileSync(`${fontPath}iconfont.woff`, result.woff)
        fs.writeFileSync(`${fontPath}iconfont.woff2`, result.woff2)

        return result
    })
    .catch(error => {
        console.log(error)
        throw error
    })
