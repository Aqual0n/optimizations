const imagemin = require('imagemin')    // The imagemin module.
const webp = require('imagemin-webp')
// imagemin's WebP plugin.
const src = './src/assets/images/'
const dest = './public/images/'
const imageminMozjpeg = require('imagemin-mozjpeg')
const imageminPngquant = require('imagemin-pngquant')

const sharp = require('sharp')

const fs = require('fs')
const chokidar = require('chokidar')
const { ncp } = require('ncp')

const watcher = chokidar.watch(src, {
    cwd: '.'
})

const removeBrackets = function (string) {
    const brackets = string.match(/\[(.*?)\]/)
    if (brackets) {
        return string.replace(brackets[0], '')
    }
    return string
}

const walkSync = function (dir) {
    const files = fs.readdirSync(dir)
    files.forEach(file => {
        if (fs.statSync(`${dir}/${file}`).isDirectory()) {
            walkSync(`${dir}/${file}`)
        } else {
            const filename = (`${dir}/${file}`).replace(/^.*[\\\/]/, '')
            const matches = filename.match(/\[(.*?)\]/)
            let width = null
            if (matches) {
                width = parseInt(matches[1], 10)
            }

            let brackets = (`${dir}/${file}`).match(/\[(.*?)\]/)
            if (brackets) {
                brackets = brackets[0]
            } else {
                brackets = ''
            }

            sharp(`${dir}/${file}`)
                .resize({ width })
                .webp({ quality: 80 })
                .toFile(`${dir}/${removeBrackets(file).substring(0, removeBrackets(file).lastIndexOf('.'))}.webp`)
                .then(() => sharp(`${dir}/${file}`)
                    .resize({ width })
                    .toBuffer())
                .then(buffer => {
                    if (fs.existsSync(`${dir}/${file}`) && !brackets) {
                        fs.writeFile(`${dir}/${file}`, buffer, err => {
                            if (err) {
                                throw err
                            }
                        })
                    } else if (fs.existsSync(`${dir}/${file}`) && brackets) {
                        fs.unlink(`${dir}/${file}`, () => {
                            sharp(buffer)
                                .toFile(`${dir}/${file.replace(brackets, '')}`)
                        })
                    }
                })
                .then(() => imagemin([`${dir}/${file}`], {
                    destination: `${dir}/`,
                    plugins: [
                        imageminMozjpeg(),
                        imageminPngquant({
                            quality: [0.6, 0.8]
                        })
                    ]
                }))
                .then(res => {
                    console.log(`image ${dir}/${file} optimized`)
                })
            return false
        }
    })
}

const buildImages = function () {
    fs.rmdir(dest, { recursive: true }, err => {
        if (err) {
            throw err
        }

        fs.mkdir(dest, err => {
            if (err) {
                console.log(err)
            } else {
                console.log('images folder created')

                ncp(src, dest, err => {
                    if (err) {
                        return console.error(err)
                    }
                    walkSync('./public/images')
                    watcher.on('all', (event, path) => {
                        const relativePath = path.split('\\').join('/')
                        const publicPath = `./public/${relativePath.replace('src/assets/', '')}`
                        // console.log('updated ', event, relativePath);
                        console.log('public path ', publicPath)
                        switch (event) {
                        case 'add':
                            // fs.copyFile(relativePath, publicPath, (err)=> {
                            //     if(err) {
                            //         console.log(err);
                            //     }
                            // })
                            break
                        case 'addDir':
                            fs.mkdir(publicPath, err => {
                                if (err) {
                                    console.log(err)
                                }
                            })
                            break
                        case 'unlink':
                            if (fs.existsSync(removeBrackets(publicPath))) {
                                fs.unlinkSync(`${removeBrackets(publicPath)}`)
                                fs.unlinkSync(`${removeBrackets(publicPath).substring(0, removeBrackets(publicPath).lastIndexOf('.'))}.webp`)
                            }
                            break
                        case 'unlinkDir':
                            fs.rmdirSync(`./${publicPath}`, { recursive: true })
                            break
                        default:
                            break
                        }

                        if (fs.existsSync(relativePath)) {
                            const filename = relativePath.replace(/^.*[\\\/]/, '')
                            const matches = filename.match(/\[(.*?)\]/)
                            let width = null
                            if (matches) {
                                width = parseInt(matches[1], 10)
                            }

                            let brackets = publicPath.match(/\[(.*?)\]/)
                            if (brackets) {
                                brackets = brackets[0]
                            } else {
                                brackets = ''
                            }

                            sharp(relativePath)
                                .resize({ width })
                                .webp({ quality: 80 })
                                .toFile(`${removeBrackets(publicPath).substring(0, removeBrackets(publicPath).lastIndexOf('.'))}.webp`)
                                .then(() => sharp(relativePath)
                                    .resize({ width })
                                    .toFile(publicPath.replace(brackets, '')))
                                .then(() => imagemin([publicPath], {
                                    destination: `${publicPath.replace(brackets, '').substring(0, publicPath.lastIndexOf('/'))}/`,
                                    plugins: [
                                        imageminMozjpeg(),
                                        imageminPngquant({
                                            quality: [0.6, 0.8]
                                        })
                                    ]
                                }))
                                .then(res => {
                                    console.log(`image ${relativePath} is optimized and copied to ${publicPath}`)
                                })
                                .catch(err => {
                                    console.log(err)
                                })
                        }
                    })
                })
            }
        })
    })
}

buildImages()
