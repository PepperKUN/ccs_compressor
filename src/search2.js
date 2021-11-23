const fs = require('fs');
var DOMParser = require('xmldom').DOMParser;
const parser = new DOMParser();
let doc
const Taglist =[
    "FileData",
    "DisabledFileData",
    "PressedFileData",
    "NormalFileData",
    "TextureFile",
    "TextureData",
    "ImageFileData",
    "NormalBackFileData",
    "PressedBackFileData",
    "DisableBackFileData",
    "NodeNormalFileData",
    "NodeDisableFileData",
    "BackGroundData",
    "ProgressBarData",
    "BallNormalData",
    "BallPressedData",
    "BallDisabledData",
    "LabelAtlasFileImage_CNB",
    "LabelBMFontFile_CNB",
    "StencilImageData",
  ]

let resultFile = []

const getElements = (dirName, keyword) => {
    const readDir = fs.readdirSync(dirName);
    for(const fileName of readDir){
        if(fileName.includes('.csd')){
            const filePath = `${dirName}/${fileName}`;
            // const data = fs.readFileSync(filePath, 'utf-8');
            doc = parser.parseFromString(fs.readFileSync(filePath, 'utf-8'), 'text/xml');
            let fileDataList = [];
            Taglist.forEach(Element => {
                fileDataList.concat(Array.from(doc.getElementsByTagName(Element)))
            })
            
            // const fileDataList = Array.from(doc.getElementsByTagName('FileData')).filter(ele => {
            //     return  ele.getAttribute('Path').includes(keyword) || ele.getAttribute('Plist').includes(keyword)
            // });
            // console.log(doc);
            if(fileDataList.length > 0)resultFile.push({csdName: fileName, ref: fileDataList.length})
            // console.log(fileDataList);
        }
    }

    return resultFile
}


export {getElements}