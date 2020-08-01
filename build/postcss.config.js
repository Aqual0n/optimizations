module.exports = {
    plugins: [
        require('autoprefixer')({
            'browsers': ['> 1%', 'last 4 versions', 'cover 99.5%']
        }),
        // require('mqpacker'),
        require('postcss-filter-gradient'),
        require('cssnano')({
            preset: [
                'default',
                {
                    discardComments: {
                        removeAll: true,
                    }
                }
            ]
        })
    ]
};