// build nodewebkit
module.exports = {
    options: {
        platforms: ['osx', 'win', 'linux'],
        cacheDir: 'dist/cache',
        buildDir: 'dist/desktop',
        macCredits: 'src/common/credits.html',
    },
    src: ['build/desktop/**/*']
}