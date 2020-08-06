const fs = require('fs')
const crypto = require('crypto')
const webfont = require('webfont').default

const fontPath = './public/fonts/icons/'

const opentype = require('opentype.js')

const generateChecksum = function (str, algorithm, encoding) {
    return crypto
        .createHash(algorithm || 'md5')
        .update(str, 'utf8')
        .digest(encoding || 'hex')
}

const makeIconfont = function () {
    let existingSelection = null
    if (fs.existsSync(`${fontPath}selection.json`)) {
        existingSelection = JSON.parse(fs.readFileSync(`${fontPath}selection.json`, 'utf8'))
    }

    const selection = {
        icons: []
    }

    let counter = 0

    webfont({
        files: './src/assets/icons/**/*.svg',
        template: './src/util/template.html.njk',
        templateFontPath: fontPath,
        fontName: 'iconfont',
        formats: [
            'woff',
            'woff2'
        ],
        prependUnicode: true,
        glyphTransformFn: obj => {
            const icon = {}
            icon.unicode = obj.unicode
            const checksum = fs.readFileSync(obj.path)

            icon.checksum = generateChecksum(checksum)

            if (existingSelection && existingSelection.icons.length > counter && icon.checksum === existingSelection.icons[counter].checksum) {
                console.log('equal')
            } else if (existingSelection) {
                const sameIcon = existingSelection.icons.find(el => el.checksum === icon.checksum)
                if (typeof sameIcon !== 'undefined') {
                    const filename = obj.path.replace(/^.*[\\\/]/, '').split('-')
                    const path = `${obj.path.substring(0, obj.path.lastIndexOf('/'))}/`
                    fs.renameSync(`${path}${filename[0]}-${filename[1]}`, `${path}u${sameIcon.unicode[0].charCodeAt(0).toString(16).toUpperCase()}-${filename[1]}`)
                }
            }

            selection.icons.push(icon)
            counter += 1

            return obj
        },
        fontHeight: 600,
        normalize: true
    })
        .then(result => {
            fs.writeFileSync(`${fontPath}demo.html`, result.template)
            fs.writeFileSync(`${fontPath}selection.json`, JSON.stringify(selection))
            fs.writeFileSync(`${fontPath}iconfont.woff`, result.woff)
            fs.writeFileSync(`${fontPath}iconfont.woff2`, result.woff2)

            return result
        })
        .catch(error => {
            console.log(error)
            throw error
        })
}

makeIconfont()
