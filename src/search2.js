const fs = require('fs');
var DOMParser = require('xmldom').DOMParser;
const parser = new DOMParser();
let doc
const tagList = ['FileData', 'TextureFile']

let resultFile = []

const getElements = (dirName, keyword) => {
    const readDir = fs.readdirSync(dirName);
    for(const fileName of readDir){
        if(fileName.includes('.csd')){
            const filePath = `${dirName}/${fileName}`;
            // const data = fs.readFileSync(filePath, 'utf-8');
            doc = parser.parseFromString(fs.readFileSync(filePath, 'utf-8'), 'text/xml');
            const fileDataList = Array.from(doc.getElementsByTagName('FileData')).filter(ele => {
                return  ele.getAttribute('Path').includes(keyword) || ele.getAttribute('Plist').includes(keyword)
            });
            // console.log(doc);
            if(fileDataList.length > 0)resultFile.push({csdName: fileName, ref: fileDataList.length})
            // console.log(fileDataList);
        }
    }

    return resultFile
}


export {getElements}