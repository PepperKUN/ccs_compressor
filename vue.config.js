module.exports = {
    pluginOptions: {
      electronBuilder: {
        preload: {
          preload: 'src/preload.js',
        },
        builderOptions: {
          "win": {
            "target": ["nsis"],
            "icon": "build/icons/icon.png",
            // "sign": "./electron/winsign.js",
            "publisherName": "PepperKUN", 
          },
          "nsis": {
            "oneClick": false, // 一键安装
            "perMachine": true, // 是否开启安装时权限限制（此电脑或当前用户）
            "allowElevation": true, // 允许请求提升。 如果为false，则用户必须使用提升的权限重新启动安装程序。
            "allowToChangeInstallationDirectory": true, // 允许修改安装目录
            // "installerIcon": "./build/icons/aaa.ico", // 安装图标
            // "uninstallerIcon": "./build/icons/bbb.ico", //卸载图标
            // "installerHeaderIcon": "./build/icons/aaa.ico", // 安装时头部图标
            "createDesktopShortcut": true, // 创建桌面图标
            "createStartMenuShortcut": true, // 创建开始菜单图标
            // "shortcutName": "xxxx" // 图标名称
          }
        }
      }
    }
  }