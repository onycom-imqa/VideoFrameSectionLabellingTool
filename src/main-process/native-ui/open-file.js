import { ipcMain, dialog } from "electron";

ipcMain.on('open-directory-dialog', (event) => {
  dialog.showOpenDialog({
    properties: ['openDirectory']
  }, (files) => {

    console.log(files)
    if (files) {
      event.sender.send('selected-directory', files)
    }
  })
})
