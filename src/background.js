'use strict'

import { app, protocol, BrowserWindow, ipcMain} from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer'
const isDevelopment = process.env.NODE_ENV !== 'production'

const path = require('path')

import {CcsClean}  from './read'
import {writeExcel}  from './excelProcess'
import {getElements} from './search2'

let win

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])


async function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 370,
    maxWidth: 500,
    minWidth: 300,
    height: 590,
    frame: false,
    transparent: false,
    icon: './build/icons/icon.png',
    webPreferences: {
      
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
      preload: path.join(__dirname, 'preload.js'),
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS3_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
  registerLocalResourceProtocol()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

function registerLocalResourceProtocol() {
  protocol.registerFileProtocol('local-resource', (request, callback) => {
    const url = request.url.replace(/^local-resource:\/\//, '')
    // Decode URL to prevent errors when loading filenames with UTF-8 chars or chars like "#"
    const decodedUrl = decodeURI(url) // Needed in case URL contains spaces
    try {
      return callback(decodedUrl)
    }
    catch (error) {
      console.error('ERROR: registerLocalResourceProtocol: Could not get file path:', error)
    }
  })
}

ipcMain.on("toMain", (event, args) => {
  // app.quit();
  console.log('!!!!');
});
ipcMain.on("closeWin", (event, args) => {
  console.log('quit');
  app.quit();
  // win.close();
});
ipcMain.on("minimize", (event, args) => {
  console.log('minimize');
  win.minimize();
});

ipcMain.on("readFiles", (event, args) => {
  CcsClean(args, args).then(note => {
    let info;
    if(note instanceof Error){
      info = {
        path:args,
        result: null,
        error: note,
      }
    }else{
      info = {
        path:args,
        result: note,
        error: null,
      }
    }
    event.reply("fromMain", info);
    // console.log(note)
  });
});

ipcMain.on("excel", (event, args) => {
  writeExcel(JSON.parse(args))
})

const testObj = {
  a: {
      a1: ['1', '2', '3']
  },
  b: {
      c: {
          y: '10',
          x: {
              x1: '3',
              x2: 'test'
          }
      },
      d: {
          d1: [
              {
                  t: '2',
                  y: '22452346'
              },{
                  t: '4',
                  y: '66'
              },{
                  t: '8',
                  y: '09234'
              }
          ]
      }
  }
}

var ownerArr = [
  {
      "owner": "Colin",
      "pets": [{
          "name": "dog1"
      }, {
          "name": "dog2",
          'c': {
              'u': {
                  'p': {
                      "t": '40958309457234459860386',
                      'i': {
                          't': '24325/12234 234',
                      },
                  }
              }
         }
      }]
  }, {
  "owner": "John",
  "pets": [{
      "name": "dog3",
      "t": '5677'
  }, {
      "name": "dog4"
  }]
}];

// console.log(getObject(testObj, 'y', '234'));
ipcMain.on("search", (event, args) => {
  console.log(getElements('E:/sampleCCS/cocosstudio', args));
})
