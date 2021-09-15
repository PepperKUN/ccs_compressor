module.exports = {
    pluginOptions: {
      electronBuilder: {
        preload: {
          preload: 'src/preload.js',
        },
        // Or, for multiple preload files:
      }
    }
  }