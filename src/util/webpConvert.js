const imagemin = require("imagemin"),    // The imagemin module.
    webp = require("imagemin-webp"),   // imagemin's WebP plugin.
    src = "./src/assets/images/",
    dest = "./public/images/";
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');

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
            imagemin([dir + '/' + file + '/*.{jpg,png}'], {
                destination: dir + '/' + file + '/',
                plugins: [
                    imageminMozjpeg(),
                    imageminPngquant({
                        quality: [0.6, 0.8]
                    })
                ]
            }).then((res) => {
                console.log('Images optimized');
            });
            imagemin([dir + '/' + file + '/*.{jpg,png}'], {
                destination: dir + '/' + file + '/',
                plugins: [
                    webp({
                        quality: 75,
                    }),
                ]
            }).then((res) => {
                console.log('Webp created');
            });
            walkSync(dir + '/' + file);
        }
        else {
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

                        imagemin([relativePath], {
                            destination: publicPath.substring(0, publicPath.lastIndexOf("/")) + '/',
                            plugins: [
                                imageminMozjpeg(),
                                imageminPngquant({
                                    quality: [0.6, 0.8]
                                })
                            ]
                        })
                        imagemin([relativePath], {
                            destination: publicPath.substring(0, publicPath.lastIndexOf("/")) + '/',
                            plugins: [
                                webp({
                                    quality: 75,
                                }),
                            ]
                        })
                    })
                });
            }
        })
    });
}

buildImages();