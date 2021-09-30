const fs = require('fs');
const convert = require('xml-js');
var DOMParser = require('xmldom').DOMParser;
const parser = new DOMParser();
let doc;
let tempCcs = {};
const rootFolder_attributes = {
  "_attributes": {
    "Name": '.',
  }
}

const typeTable = {
  "Image": [
      "png",
      "jpg",
      "gif"
  ],
  "PlistParticleFile": [
      "plist",
  ],
  "PlistInfo": [
    "csi"
  ],
  "TTF": [
      "ttf",
      "TTF",
      "otf"
  ],
  "Project": [
    "csd"
  ]
}

let wrapSample = {
  "Solution": {
    "PropertyGroup": {
      "_attributes": {
        "Name": "NewCcsFile",
        "Version": "2.3.3.0",
        "Type": "CocosStudio"
      }
    },
    "SolutionFolder": {
      "Group": {
        "_attributes": {
          "ctype": "ResourceGroup",
        },
        "RootFolder": {}
      }
    }
  }
}

const Taglist =[
  "FontResource",
  "FileData",
  "DisabledFileData",
  "PressedFileData",
  "NormalFileData",
  "TextureFile",
]

  const getType = function(value) {
    return Object.keys(typeTable).find(key => typeTable[key].indexOf(value)>=0);
  }


  const readCcFile = function(path) {
    return new Promise((resolve, reject) => {
      fs.readFile(path, 'utf-8', (err, data) => {
        if(err) {
          reject(err);
        }
        resolve(data);
      })  
    })
  }

  const writeFile = function(path, data, note){
    return new Promise((resolve, reject) =>{
      fs.writeFile(path, data, err => {
        if (err) {
          reject(err)
        }
        resolve(note);
      })
    })
  }

  const setToValue = function(obj, value, path) {
    for (const i in path){
      obj = obj[path[i]]
      console.log(obj);
      if(i===(path.length-1))obj = value;
    };
  }


  const CcsClean = function(inputPath, outPath){
    return readCcFile(inputPath).then(data =>{
      tempCcs = JSON.parse(convert.xml2json(data, {compact: true, spaces: 4}));
      let csdObj = tempCcs.Solution.SolutionFolder.Group.RootFolder.Project;
      let effectObj = tempCcs.Solution.SolutionFolder.Group.RootFolder.Folder;
      tempCcs.Solution.SolutionFolder.Group.RootFolder = {};
      // tempCcs = tempCcs;
      // console.log(csdObj);
      return {csd: csdObj, folder: effectObj};
    }).then(data =>{
      if(!data.csd)throw new Error('No csd file was included!')
      // console.log(data.folder);
      let cocostudio = {
        "Folder": [],
        "Project": [],
      };
      let promises = [];
      let allPath = [];
      let framePath = [];
      let frameFinPath = [];
      let cleanPath =[];
      const relativePath = inputPath.substring(0, inputPath.lastIndexOf('\\'));

      if(!Array.isArray(data.csd))data.csd = [data.csd];
      data.csd.forEach(element =>{
        const el_path = `${relativePath}/cocosstudio/${element._attributes.Name}`;
        promises.push(
          readCcFile(el_path).then(data =>{
            doc = parser.parseFromString(data, 'text/xml');
            Taglist.forEach(tagName => {
              Array.from(doc.getElementsByTagName(tagName)).forEach(element => {
                const frameCheck = element.getAttribute('Type') === 'PlistSubImage';
                if(frameCheck){
                  const plistPath = element.getAttribute('Plist');
                  if(!framePath.includes(plistPath))framePath.push(plistPath)
                  if(plistPath.length>0)allPath.push(element.getAttribute('Plist'));
                }else{
                  allPath.push(element.getAttribute('Path'));
                }
              })
            })

          }).catch(error =>{
            const idx = data.csd.findIndex(el => el._attributes.Name ===  element._attributes.Name);
            data.csd.splice(idx, 1);
          })
        )
      })
      return Promise.all(promises).then(() => {
        cocostudio['Project'] = data.csd;
        allPath.forEach(element => {
          if(!cleanPath.includes(element))cleanPath.push(element)
        })
        cleanPath.sort();
        // cleanPath.forEach(el => console.log(el))
        framePath.forEach(element => {
          const idx = element.lastIndexOf('/');
          const tempPath = element.slice(0, idx);
          if(!frameFinPath.includes(tempPath)&&tempPath.length>0)frameFinPath.push(tempPath);
        })

        //path to json
        cleanPath.forEach(element => {
          const idx = cleanPath.findIndex(el => el === element);
          // if(idx>107&&idx<110){
          // if(idx>104&&idx<170){
          if(true){
            const strBlock = element.split('/');
            let tempObj = cocostudio;
            // console.log(strBlock);
  
            for(const i in strBlock){
              const propName = {
                "_attributes": {
                    "Name": strBlock[i],
                }
              }
  
              if(i==(strBlock.length-1)){
  
                //file type parse
                let extend = strBlock[i].split('.');
                const format = getType(extend[extend.length - 1]);
  
                const tag = Object.keys(tempObj).find(ele => ele === format);
  
                
                if(tag){
                  if(tempObj[tag].findIndex(ele => ele._attributes.Name === strBlock[i])<0){
                    tempObj[tag].push(propName);
                  }
                }else{
                  tempObj[format] = [];
                  tempObj[format].push(propName);
                }
              }else{
  
                let cond = {};
  
                // debug
                try{
                  cond = tempObj.Folder.find(data => data._attributes.Name === strBlock[i]);
                }catch{error => {
                  console.log(error);
                  console.log(strBlock);
                  }
                }
                // debug
  
                if(cond){
                  tempObj = cond;
                }else{
                  if(i !== strBlock.length-2){
                    propName["Folder"] = [];
                  }
                  let n = tempObj["Folder"].push(propName);
                  tempObj = tempObj["Folder"][n-1];
                }
                // console.log(JSON.stringify(tempObj));
              }
            }
          }

        });
        // console.log(JSON.stringify(cocostudio));

        frameFinPath.forEach(element => {
          const strBlock = element.split('/');
          let tempFolder = data.folder;
          let tempCocos = cocostudio.Folder;
          // let cocosCopy = cocostudio;
          let cocosIdx = [];
          for( const i in strBlock){
            const folderCache = (tempFolder instanceof Array)?tempFolder.find(item => item._attributes.Name === strBlock[i]):tempFolder;
            tempFolder = (i < (strBlock.length - 1))?folderCache.Folder:folderCache;
            let cocosCache;
            if(tempCocos instanceof Array){
              const idx = tempCocos.findIndex(item => item._attributes.Name === strBlock[i]);
              cocosCache = tempCocos[idx];
              cocosIdx.push('Folder')
              cocosIdx.push(idx)
            }else{
              cocosCache = tempCocos;
              cocosIdx.push('Folder')
            }
            if(cocosCache.hasOwnProperty('Folder')){
              tempCocos = (i < (strBlock.length-1))?cocosCache['Folder']:cocosCache;
            }
          }
          console.log(tempFolder, tempCocos);
          if(tempCocos instanceof Array){
            const finIdx = tempCocos.findIndex(item => item._attributes.Name === strBlock[strBlock.length - 1])
            tempCocos.splice(finIdx, 1);
            tempCocos.push(tempFolder)
          }else{
            setToValue(cocostudio, tempFolder, cocosIdx)
          }
          console.log(cocosIdx);
        })

        const defaultIndex = cocostudio.Folder.indexOf(cocostudio.Folder.find(item => item._attributes.Name === "Default"));
        if(defaultIndex > -1){
          cocostudio.Folder.splice(defaultIndex, 1);
        }
        return cocostudio;
      }).catch(error => console.log(error));
    }).then(data => {
      tempCcs.Solution.SolutionFolder.Group.RootFolder = {
        ...rootFolder_attributes,
        ...data
      }
      // console.log(tempCcs);
      
  
      const options = {compact: true, ignoreComment: true, spaces: 2};
  
      const content = convert.json2xml(tempCcs, options);

      writeFile(outPath, content, 'sucess!!!');
      return data;
    }).catch(err => err)
  }

  const pic_Search = function() {
    
  }



  

  export {CcsClean} 