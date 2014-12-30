// build nodewebkit
module.exports = {
    options: {
        platforms: ['osx', 'win', 'linux'],
        cacheDir: 'dist/cache',
        buildDir: 'dist/desktop',
    },
    src: ['build/desktop/**/*']
}