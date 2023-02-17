const { app, BrowserWindow, ipcMain, nativeImage, NativeImage } = require('electron')
const path = require('path')
const fs = require('fs')
const https = require('https')
pdfparse = require('pdf-parse')
const ObjectsToCsv = require('objects-to-csv')

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        },
    })

    win.webContents.openDevTools()
    win.loadFile('index.html')
}

const iconName = path.join(__dirname, 'iconForDragAndDrop.png');
const icon = fs.createWriteStream(iconName);

// // Create a new file to copy - you can also copy existing files.
// fs.writeFileSync(path.join(__dirname, 'drag-and-drop-1.md'), '# First file to test drag and drop')
// fs.writeFileSync(path.join(__dirname, 'drag-and-drop-2.md'), '# Second file to test drag and drop')

// https.get('https://img.icons8.com/ios/452/drag-and-drop.png', (response) => {
//     response.pipe(icon);
// });

app.whenReady().then(createWindow)

ipcMain.on('ondragstart', (event, filePath) => {
    event.sender.startDrag({
        file: path.join(__dirname, this.files[0].path),
        icon: iconName,
    })
})

ipcMain.on('saveData', (event, path) => {
    generateCsv(path)
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})


async function getText(path) {
    let text
    const pdffile = fs.readFileSync(path)
    await pdfparse(pdffile).then(function (data) {
        text = data.text
    })

    const deleteSpaces = text.replace(' ', '')
    return deleteSpaces
}

// get information
async function getText(path) {
    let text
    const pdffile = fs.readFileSync(path)
    await pdfparse(pdffile).then(function (data) {
        text = data.text
    })

    const deleteSpaces = text.replace(' ', '')
    return deleteSpaces
}
async function show(path) {
    let lista = []
    const char = await getText(path)
    for (i = 0; i < char.length; i++) {
        if (char[i] == '(' && char[i + 6] == ')') {
            let code = `${char[i + 1]}${char[i + 2]}${char[i + 3]}${char[i + 4]}${char[i + 5]}`
            if (code != '54 11') {
                let mensaje = ''
                for (j = 101; j < 115; j++) {
                    mensaje += char[i + j]
                }
                if (mensaje == "DEB.POR AJUSTE") {
                    lista.push(code + 'D')
                } else {
                    lista.push(code)
                }

            }
        }
    }
    let result = lista.filter((item, index) => {
        return lista.indexOf(item) === index;
    })

    console.log(result)
    const object = []
    for (code of result) {
        if (code.endsWith('D')) {
            object.push({ codigo: code.slice(0, -1), DPA: 'si' })
            continue;
        }
        object.push({ codigo: code, DPA: 'no' })
    }

    return object
}

async function generateCsv(path) {
    const csv = await show(path)
    console.log(csv)
    const name = new Date().toLocaleDateString("es-AR").replaceAll('/', '-')
    try {
        // fs.writeFileSync('./hola.csv', JSON.stringify(csv))
        new ObjectsToCsv(csv).toDisk(`${name}.csv`, { allColumns: false });

    } catch (error) {
        console.log(error)
    }

}