let imagemin = require("imagemin"),    // The imagemin module.
    webp = require("imagemin-webp"),   // imagemin's WebP plugin.
    outputFolder = "./public/images/img",            // Output folder
    images = "./public/images/*.{jpg,png}";

imagemin([images], {
    destination: outputFolder,
    plugins: [
        webp({
            quality: 75,
        })
    ]
}).then(() => {
    console.log('Images optimized');
});