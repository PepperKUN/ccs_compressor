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


  const CcsClean = function(inputPath, outPath){
    return readCcFile(inputPath).then(data =>{
      tempCcs = JSON.parse(convert.xml2json(data, {compact: true, spaces: 4}));
      let csdObj = tempCcs.Solution.SolutionFolder.Group.RootFolder.Project;
      tempCcs.Solution.SolutionFolder.Group.RootFolder = {};
      // tempCcs = tempCcs;
      return csdObj;
    }).then(data =>{
      let cocostudio = {
        "Folder": [],
        "Project": [],
      };
      let promises = [];
      let allPath = [];
      let cleanPath =[];
      const relativePath = inputPath.substring(0, inputPath.lastIndexOf('\\'));
      data.forEach(element =>{
        element = `${relativePath}/cocosstudio/${element._attributes.Name}`;
        promises.push(
          readCcFile(element).then(data =>{
            doc = parser.parseFromString(data, 'text/xml');
            Taglist.forEach(tagName => {
              Array.from(doc.getElementsByTagName(tagName)).forEach(element => {
                allPath.push(element.getAttribute('Path'));
              })
            })
          })
        )
      })
      return Promise.all(promises).then(() => {
        cocostudio['Project'] = data;
        allPath.forEach(element => {
          if(!cleanPath.includes(element))cleanPath.push(element)
        })
        cleanPath.sort();
        // console.log(cleanPath)

        //path to json
        cleanPath.forEach(element => {
          const strBlock = element.split('/');
          let tempObj = cocostudio;


          for(let i=0; i<strBlock.length; i++){
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
                cond = tempObj["Folder"].find(data => data._attributes.Name === strBlock[i]);
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
            }
          }

        });
        // console.log(JSON.stringify(cocostudio));

        const defaultIndex = cocostudio.Folder.indexOf(cocostudio.Folder.find(item => item._attributes.Name === "Default"));
        if(defaultIndex > -1){
          cocostudio.Folder.splice(defaultIndex, 1);
        }
        return cocostudio;
      })
    }).then(data => {
      // tempCcs.Solution.SolutionFolder.Group.RootFolder = {
      //   ...rootFolder_attributes,
      //   ...data
      // }
      // // console.log(tempCcs);
      
  
      // const options = {compact: true, ignoreComment: true, spaces: 2};
  
      // const content = convert.json2xml(tempCcs, options);

      // return writeFile(outPath, content, 'sucess!!!');
      return data;
    })
  }

  // CcsClean('activity_origin.ccs', 'activity.ccs');


  export {CcsClean} 