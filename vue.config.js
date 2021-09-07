module.exports = {
    pluginOptions: {
      electronBuilder: {
        preload: {
          preload: 'src/preload.js',
          ccsProcess: 'src/read.js'
        },
        // Or, for multiple preload files:
      }
    }
  }