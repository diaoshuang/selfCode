var express = require('express');
var router = express.Router();
const fs = require('fs')
const path = require('path')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/files', function(req, res, next) {
  // 显示服务器文件 
  let filePath =  path.join(__dirname,'../files/')
  console.log('filePath:' + filePath)
  fs.readdir(filePath, function(err,results){
    console.log("readed!")
    if(err) throw err;
    console.log('file read: OK')
    console.dir(results)
    if(results.length>0){
      let files = []
      results.forEach(function(fileName){
        let stats = fs.statSync(path.join(filePath,fileName))
        if(stats.isFile()){
          files.push({fileName:fileName,size:stats.size})
        }
      })
      console.log('files : ')
      console.dir(files)
      console.log('render~~~~~~~~')
      res.render('files',{files:files})
    }else{
      res.end('当前目录没有文件')
    }
  })
});
router.get('/file/:fileName', function(req, res, next) {
  // 实现文件下载 
  let fileName = req.params.fileName
  let filePath = path.join(__dirname,'../files/' + fileName)
  let stats = fs.statSync(filePath)
  if(stats.isFile()){
    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': 'attachment; filename=' + fileName,
      'Content-Length': stats.size
    })
    fs.createReadStream(filePath).pipe(res)
  }else{
    res.end(404)
  }
});
router.post('/file/:fileName', function(req, res, next) {
  // 实现文件下载 
  let fileName = req.params.fileName
  let filePath = path.join(__dirname,'../files/' + fileName)
  let stats = fs.statSync(filePath)
  if(stats.isFile()){
    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': 'attachment; filename=' + fileName,
      'Content-Length': stats.size
    })
    fs.createReadStream(filePath).pipe(res)
  }else{
    res.end(404)
  }
});
router.get('/binary/file/:fileName', function(req, res, next) {
  // 实现文件下载 
  let fileName = req.params.fileName
  let filePath = path.join(__dirname,'../files/' + fileName)
  let stats = fs.statSync(filePath)
  if(stats.isFile()){
    res.set({
      'Content-Transfer': 'Binary',
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': 'attachment; filename=' + fileName,
      'Content-Length': stats.size
    })
    fs.createReadStream(filePath).pipe(res)
  }else{
    res.end(404)
  }
});
module.exports = router;
