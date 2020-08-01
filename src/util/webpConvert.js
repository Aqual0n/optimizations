let imagemin = require("imagemin"),    // The imagemin module.
    webp = require("imagemin-webp"),   // imagemin's WebP plugin.
    outputFolder = "./public/images/",            // Output folder
    images = "./public/images/*.{jpg,png}",
    src = "./src/assets/images/",
    dest = "./public/images/";

let fs = require('fs');
let ncp = require('ncp').ncp;

let walkSync = function(dir) {
    let files = fs.readdirSync(dir);
    files.forEach(function(file) {
        if (fs.statSync(dir + '/' + file).isDirectory()) {
            imagemin([dir + '/' + file + '/*.{jpg,png}'], {
                destination: dir + '/' + file + '/',
                plugins: [
                    webp({
                        quality: 75,
                    })
                ]
            }).then(() => {
                console.log('Images optimized');
            });
            walkSync(dir + '/' + file);
        }
        else {
            return false
        }
    });
};

fs.mkdir(dest, (err)=> {
    if(err) {
        console.log(err)
    } else {
        console.log('images folder created')
    }
})

ncp(src, dest, function (err) {
    if (err) {
        return console.error(err);
    }
    walkSync('./public/images');
});

// imagemin([images], {
//     destination: outputFolder,
//     plugins: [
//         webp({
//             quality: 75,
//         })
//     ]
// }).then(() => {
//     console.log('Images optimized');
// });