const list2 = {
    'a1.ccs':{
        't1.csd': [
            'f1.png',
            'f2.png',
            'f3.png',
        ],
        't2.csd': [
            'f1.png',
            'f2.png',
        ],
        't3.csd': [
            'g1.png',
            'g2.png',
        ],

    },
    'a2.ccs':{
        'q1.csd': [
            'f1.png',
            'f2.png',
            'f3.png',
        ],
        'q2.csd': [
            'f1.png',
            'f2.png',
        ],
        'q3.csd': [
            'g1.png',
            'g2.png',
        ],

    }
}

const rowConvert = (inputObj) => {
    const ccsList = Object.keys(inputObj)
    let rowList = [];
    for(const i in ccsList){
        const csdList = Object.keys(inputObj[ccsList[i]]);
        for(const j in csdList){
            const picList = inputObj[ccsList[i]][csdList[j]];
            for(const k in picList){
                let row = {ccs: '', csd: '', pic: picList[k]}
                row.ccs = (j+k)==0?ccsList[i]:'';
                row.csd = k==0?csdList[j]:'';
                rowList.push(row);
            }
        }
    }
    console.log(rowList);
}

rowConvert(list2);