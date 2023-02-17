const { contextBridge, ipcRenderer } = require('electron')

document.addEventListener('DOMContentLoaded', function () {

    const elementData = document.getElementById('file')
    const button = document.getElementById('convert')
    button.addEventListener('click', () => {
        const data = elementData.files[0]
        const path = data.path
        console.log(path)
        ipcRenderer.send('saveData', path)
    })
})


// contextBridge.exposeInMainWorld('electron', {
//     saveData: (path) => {
//         ipcRenderer.send('onclick', path)
//     }

// })
