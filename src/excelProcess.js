
'use strict';
 
const Excel = require('exceljs');
const fs = require('fs');



const createExcel = function(data){
    const start_time = new Date();
    const workbook = new Excel.stream.xlsx.WorkbookWriter({
      filename: './test.xlsx'
    });
    //表格sheet页签的名字
    const worksheet = workbook.addWorksheet('Sheet1');
 
    //header excel=>首行标题栏 key=>数据的key值
    worksheet.columns = [
      { header: 'CCS名称', key: 'ccs' },
      { header: 'CSD名称', key: 'csd' },
      { header: '图片名称', key: 'pic' },
    ];
 
 
    // console.log(data);
    const length = data.length;
 
    // 当前进度
    let current_num = 0;
    const time_monit = 400;
    let temp_time = Date.now();
    let mark_1 = 0;
    let mark_2 = 0;
 
    console.log('开始添加数据');
    // 开始添加数据
    // worksheet.getCell('A2').border = {
    //   top: {style:'double', color: {argb:'FF00FF00'}},
    //   left: {style:'double', color: {argb:'FF00FF00'}},
    //   bottom: {style:'double', color: {argb:'FF00FF00'}},
    //   right: {style:'double', color: {argb:'FF00FF00'}}
    // };
    worksheet.getRow(2).commit();
    for(let i=0; i<data.length;  i++) {
      worksheet.addRow(data[i]);
      if(data[i].ccs.length>0&&i>0){
        worksheet.mergeCells(mark_1+2, 1, i+1, 1);
        worksheet.getRow(mark_1+1).commit();
        mark_1 = i;
      }
      if(data[i].csd.length>0&&i>0){
        worksheet.mergeCells(mark_2+2, 2, i+1, 2);
        worksheet.getCell(mark_2+2, 1).alignment = { vertical: 'top', horizontal: 'left' };
        mark_2 = i;
      }
      if(i == data.length-1){
        worksheet.mergeCells(mark_1+2, 1, i+2, 1);
        worksheet.mergeCells(mark_2+2, 2, i+2, 2);
      }
      current_num = i;
      if(Date.now() - temp_time > time_monit) {
        temp_time = Date.now();
        console.log((current_num / length * 100).toFixed(2) + '%');
      }
    }

    console.log('添加数据完毕：', (Date.now() - start_time));
    workbook.commit();
 
    const end_time = new Date();
    const duration = end_time - start_time;
 
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