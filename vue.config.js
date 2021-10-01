module.exports = {
    pluginOptions: {
      electronBuilder: {
        preload: {
          preload: 'src/preload.js',
        },
        builderOptions: {
          "win": {
            "target": ["nsis", "msi"],
            "icon": "build/icons/icon.png",
            // "sign": "./electron/winsign.js",
            "publisherName": "PepperKUN"
          },
        }
      }
    }
  }