
'use strict';
//process.argv[0] node安装路径 process.argv[1] 本js的路径
//console.log(process.argv[0],process.argv[1],process.argv[2], process.argv[3], process.argv[4], process.argv[5], process.argv[6], process.argv[7])
 
var Excel = require('exceljs');
const fs = require('fs');
 
var createExcel = function(data){
    var start_time = new Date();
    var workbook = new Excel.stream.xlsx.WorkbookWriter({
      filename: './test.xlsx'
    });
    //表格sheet页签的名字
    var worksheet = workbook.addWorksheet('Sheet1');
 
    //header excel=>首行标题栏 key=>数据的key值
    worksheet.columns = [
      { header: 'id', key: 'idd' },
      { header: 'name', key: 'namee' },
    ];
 
 
    // var data = [
    //     {idd:1,namee:"张三"},
    //     {idd:2,namee:"李四"},
    // ];
    console.log(data);
    var length = data.length;
 
    // 当前进度
    var current_num = 0;
    var time_monit = 400;
    var temp_time = Date.now();
 
    console.log('开始添加数据');
    // 开始添加数据
    for(let i in data) {
      worksheet.addRow(data[i]).commit();
      current_num = i;
      if(Date.now() - temp_time > time_monit) {
        temp_time = Date.now();
        console.log((current_num / length * 100).toFixed(2) + '%');
      }
    }
    console.log('添加数据完毕：', (Date.now() - start_time));
    workbook.commit();
 
    var end_time = new Date();
    var duration = end_time - start_time;
 
    console.log('用时：' + duration);
    console.log("程序执行完毕");
}
 
//判断文件/目录是否存在

const writeExcel = function(exceldata) {
    fs.access('./test.xlsx',(err)=>{
        console.log(err ?  '目录/文件不存在': '文件存在,可以进行读写');
        if(err){
            createExcel(exceldata);
        }else{
            //9. fs.unlink删除文件 
            fs.unlink('./test.xlsx',function(error){
                if(error){
                    console.log(error);
                }
                console.log('删除文件成功');
                createExcel(exceldata);
            })
        }
    });
}

console.log("excelProcess loaded")

export {writeExcel}