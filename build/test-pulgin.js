class ImageOptimizerPlugin {
    apply(compiler) {
        // emit is asynchronous hook, tapping into it using tapAsync, you can use tapPromise/tap(synchronous) as well
        compiler.hooks.invalid.tap('FileListPlugin', (compilation, callback) => {
            // Create a header string for the generated file:
            var filelist = 'In this build:\n\n';
            console.log(compilation)

            // Loop through all compiled assets,
            // adding a new line item for each filename.
            for (var filename in compilation.assets) {
                filelist += '- ' + filename + '\n';
                console.log(filelist)
            }

            callback();
        });
    }
}
module.exports = ImageOptimizerPlugin;
