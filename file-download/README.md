# 文件下载进度显示

  利用xmlHttpRequest 2.0的新特性，在progress事件上监听进度，同时保证数据传输的格式是Binary数据流，避免浏览器直接识别下载文件
  在工程里用node搭建了下载文件的后台，比较简易，其中设置请求文件头
  'Content-Type': 'application/octet-stream',
      'Content-Disposition': 'attachment; filename=' + fileName,
      'Content-Length': stats.size
      是核心
      
 前端响应的对应设置 : xhr.responseType = 'blob'
 
 
