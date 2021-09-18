'use strict';
 
// var _ = require('lodash');
// const fs = require('fs');



// const res = (val) => {
//     return _.map(ownerArr, "name")
// }

const getObject = (theObject, key, str) => {
    let result = null;
    if(theObject instanceof Array) {
        for(var i = 0; i < theObject.length; i++) {
            result = getObject(theObject[i], key, str);
            if (result) {
                break;
            } 
        }
    }else{
        for(const prop in theObject) {
            node.push(prop)
            if(prop == key) {
                if(theObject[prop].includes(str)){
                    console.log(node);
                    return theObject;
                }
            }
            if(theObject[prop] instanceof Object || theObject[prop] instanceof Array)
                result = getObject(theObject[prop], key, str);
                if (result) {
                    break;
                }
        }
    }
    return result;
}




export {getObject}