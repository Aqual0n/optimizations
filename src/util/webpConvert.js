const imagemin = require("imagemin"),    // The imagemin module.
    webp = require("imagemin-webp"),   // imagemin's WebP plugin.
    src = "./src/assets/images/",
    dest = "./public/images/";
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');

const sharp = require('sharp');


const fs = require('fs');
const chokidar = require('chokidar');
const ncp = require('ncp').ncp;

let watcher = chokidar.watch(src, {
    cwd: '.',
});

let walkSync = function(dir) {
    let files = fs.readdirSync(dir);
    files.forEach(function(file) {
        if (fs.statSync(dir + '/' + file).isDirectory()) {
            walkSync(dir + '/' + file);
        }
        else {
            let filename = (dir + '/' + file).replace(/^.*[\\\/]/, '');
            let matches = filename.match(/\[(.*?)\]/);
            let width = null;
            if (matches) {
                width = parseInt(matches[1], 10);
            }

            sharp(dir + '/' + file)
                .resize({width: width})
                .webp({quality: 80})
                .toFile(dir + '/' + file.substring(0, file.lastIndexOf(".")) + '.webp')
                .then(()=> sharp(dir + '/' + file)
                    .resize({width: width})
                    .toBuffer()
                )
                .then((buffer)=> {
                    fs.writeFile(dir + '/' + file, buffer, function (err) {
                        if (err) {
                            throw err;
                        }
                    })
                })
                .then(()=> imagemin([dir + '/' + file], {
                    destination: dir + '/',
                    plugins: [
                        imageminMozjpeg(),
                        imageminPngquant({
                            quality: [0.6, 0.8]
                        })
                    ]
                }))
                .then((res) => {
                    console.log(`image ${dir}/${file} optimized`);
                });
            return false
        }
    });
};

let buildImages = function() {
    fs.rmdir(dest, { recursive: true }, (err) => {
        if (err) {
            throw err;
        }

        fs.mkdir(dest, (err)=> {
            if(err) {
                console.log(err)
            } else {
                console.log('images folder created')

                ncp(src, dest, function (err) {
                    if (err) {
                        return console.error(err);
                    }
                    walkSync('./public/images');
                    watcher.on('all', (event, path) => {
                        let relativePath = path.split('\\').join('/')
                        let publicPath = './public/' + relativePath.replace('src/assets/', '')
                        // console.log('updated ', event, relativePath);
                        console.log('public path ', publicPath)
                        switch (event) {
                            case "add":
                                // fs.copyFile(relativePath, publicPath, (err)=> {
                                //     if(err) {
                                //         console.log(err);
                                //     }
                                // })
                                break;
                            case "addDir":
                                fs.mkdir(publicPath, (err)=> {
                                    if(err) {
                                        console.log(err);
                                    }
                                })
                                break;
                            case "unlink":
                                if(fs.existsSync(publicPath)) {
                                    fs.unlinkSync(`${publicPath}`)
                                    fs.unlinkSync(`${publicPath.substring(0, publicPath.lastIndexOf(".")) + '.webp'}`)
                                }
                                break;
                            case "unlinkDir":
                                fs.rmdirSync(`./${publicPath}`, { recursive: true });
                                break;
                            default:
                                break;
                        }

                        if(fs.existsSync(relativePath)) {
                            let filename = relativePath.replace(/^.*[\\\/]/, '');
                            let matches = filename.match(/\[(.*?)\]/);
                            let width = null;
                            if (matches) {
                                width = parseInt(matches[1], 10);
                            }

                            sharp(relativePath)
                                .resize({width: width})
                                .webp({quality: 80})
                                .toFile(publicPath.substring(0, publicPath.lastIndexOf(".")) + '.webp')
                                .then(()=> sharp(relativePath)
                                    .resize({width: width})
                                    .toFile(publicPath)
                                )
                                .then(()=> imagemin([publicPath], {
                                    destination: publicPath.substring(0, publicPath.lastIndexOf("/")) + '/',
                                    plugins: [
                                        imageminMozjpeg(),
                                        imageminPngquant({
                                            quality: [0.6, 0.8]
                                        })
                                    ]
                                }))
                                .then((res) => {
                                    console.log(`image ${relativePath} is optimized and copied to ${publicPath}`);
                                })
                                .catch((err) => {
                                    console.log(err)
                                });
                        }
                    })
                });
            }
        })
    });
}

buildImages();