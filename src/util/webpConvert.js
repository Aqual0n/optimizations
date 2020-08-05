const imagemin = require('imagemin')
const imageminMozjpeg = require('imagemin-mozjpeg')
const imageminPngquant = require('imagemin-pngquant')
const fs = require('fs')
const chokidar = require('chokidar')
const { ncp } = require('ncp')

const src = './src/assets/images/'
const dest = './public/images/'
const sharp = require('sharp')
// creating watcher
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
// function that will recursively check images directory
const walkSync = function (dir) {
    const files = fs.readdirSync(dir)
    files.forEach(file => {
        if (fs.statSync(`${dir}/${file}`).isDirectory()) {
            // if file is a directory - open this directory
            walkSync(`${dir}/${file}`)
        } else {
            // else optimize this file and generate webp
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
            sharp(`${dir}/${file}`)/* resize and generate webp */
                .resize({ width })
                .webp({ quality: 80 })
                .toFile(`${dir}/${removeBrackets(file).substring(0, removeBrackets(file).lastIndexOf('.'))}.webp`)
                .then(() => sharp(`${dir}/${file}`)/* resize and output to buffer */
                    .resize({ width })
                    .toBuffer())
                .then(buffer => {
                    /* write buffer into a file */
                    const exists = fs.existsSync(`${dir}/${file}`)
                    if (exists && !brackets) {
                        fs.writeFileSync(`${dir}/${file}`, buffer)
                    } else if (exists && brackets) {
                        fs.renameSync(`${dir}/${file}`, `${dir}/${removeBrackets(file)}`)
                        fs.writeFileSync(`${dir}/${removeBrackets(file)}`, buffer)
                    }
                })
                .then(() => {
                    console.log(`starting optimize ${dir}/${removeBrackets(file)}`)
                })
                /* optimize rewrited image */
                .then(() => imagemin([`${dir}/${removeBrackets(file)}`], {
                    destination: `${dir}/`,
                    plugins: [
                        imageminMozjpeg(),
                        imageminPngquant({
                            quality: [0.6, 0.8]
                        })
                    ]
                }))
                .then(res => {
                    // console.log(`image ${dir}/${file} optimized`)
                })
                .catch(err => {
                    console.log(err)
                })
            return false
        }
    })
}
// entry point
const buildImages = function () {
    // removing existing directory
    fs.rmdir(dest, { recursive: true }, err => {
        if (err) {
            throw err
        }
        // recreating it
        fs.mkdir(dest, err => {
            if (err) {
                console.log(err)
            } else {
                console.log('images folder created')
                // copying all images from src
                ncp(src, dest, err => {
                    if (err) {
                        return console.error(err)
                    }
                    // optimizing and creating webp
                    walkSync('./public/images')
                    // adding watcher to serve images in ./src/assets/images
                    watcher.on('all', (event, path) => {
                        const relativePath = path.split('\\').join('/')
                        const publicPath = `./public/${relativePath.replace('src/assets/', '')}`
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
                                    .toFile(removeBrackets(publicPath)))
                                .then(() => imagemin([removeBrackets(publicPath)], {
                                    destination: `${removeBrackets(publicPath).substring(0, publicPath.lastIndexOf('/'))}/`,
                                    plugins: [
                                        imageminMozjpeg(),
                                        imageminPngquant({
                                            quality: [0.6, 0.8]
                                        })
                                    ]
                                }))
                                .then(res => {
                                    // console.log(`image ${relativePath} is optimized and copied to ${publicPath}`)
                                })
                                .catch(error => {
                                    console.log(error)
                                })
                        }
                    })
                })
            }
        })
    })
}

// buildImages();

module.exports = buildImages