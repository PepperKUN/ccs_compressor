import { contextBridge, ipcRenderer } from 'electron'
const ccsProcess = require('./read');

contextBridge.exposeInMainWorld('ipcRenderer', {
    send: (channel, data) => {
      // whitelist channels
      let validChannels = ['toMain', 'closeWin', 'minimize', 'readFiles']
      if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, data)
      }
    },
    receive: (channel) => {
      let validChannels = ['fromMain']
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.on(channel, (event, args) => {

        })
      }
    }
  })

  console.log(ccsProcess.CcsClean);