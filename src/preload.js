import { contextBridge, ipcRenderer } from 'electron'
// require('./read');

contextBridge.exposeInMainWorld('ipcRenderer', {
    send: (channel, data) => {
      // whitelist channels
      let validChannels = ['toMain', 'closeWin', 'minimize', 'readFiles', 'excel', 'search']
      if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, data)
      }
    },
    receive: (channel, callback) => {
      let validChannels = ['fromMain', 'Writefile']
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.on(channel, (event, args) => {
          callback(event, args)
        })
      }
    }
  })
