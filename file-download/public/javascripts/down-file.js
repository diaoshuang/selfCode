(function(win,undefined){
    function $(elm){
        if(elm.indexOf('<')<0){
            var doms = document.querySelectorAll(elm);
            if(doms && doms.length>1){
                return doms
            }else{
                return doms[0]?doms[0]:null;
            }

        }else{
            var d = document.createElement('div');
            d.innerHTML = elm;
        }
    }
    function extend(baseObj,opts){
        if(!baseObj || !opts || typeof baseObj !== 'object' || typeof opts !== 'object'){
            return baseObj;
        }
        for(var i in opts){
            if(opts.hasOwnProperty(i) && !baseObj.hasOwnProperty(i)){
                baseObj[i] = opts[i]
            }
        }
        return baseObj
    }
    function random(n){
        return ~~(Math.random()*Math.pow(10,~~n));
    }
    function _jsonp(opts){
        var script = document.createElement('script')
        script.type = 'text/javascript'

        var dataStr = ''
        for(var i in opts.data){
            dataStr += '&'+ i + '=' + opts.data[i]
        }
        opts.jsonpCallback = opts.jsonpCallback+random(3)
        dataStr += '&' + opts.jsonp + '=' + opts.jsonpCallback
        var url = opts.url.indexof('?')?(opts.url+dataStr.substr(1)):(opts.url+'?'+dataStr.substr(1))
        script.src = url
        $('body').appendChild(script)
        window[opts.jsonpCallback] = opts.success
    }
    // 自定义text转化json格式
    var parseJSON = function(text) {
        if(typeof text !== 'string') {
            return;
        }
        if( JSON && JSON.parse ) {
            return JSON.parse(text);
        }
        return (new Function('return '+text))();
    }

    function ajax(opts){
        var _options = {
            url: null,  // 请求连接
            type: 'GET',  // 请求类型
            data: null,  // post时请求体
            dataType: 'text',  // 返回请求的类型，有text/json两种
            jsonp: 'callback',  // jsonp请求的标志，一般不改动
            jsonpCallback: 'jsonpCallback',  //jsonp请求的函数名
            async: true,   // 是否异步
            cache: true,   // 是否缓存
            timeout:null,  // 设置请求超时
            contentType: 'application/x-www-form-urlencoded',
            success: null,  // 请求成功回调函数
            fail: null   // 请求失败回调
        }
        // 健全参数对象
        opts = extend(opts, _options);
        if(!opts || !opts.url){
            throw('参数错误');
            return;
        }
        opts.type = opts.type.toUpperCase();
        if(/^jsonp$/i.test(opts.dataType)){
            _jsonp(opts);
            return;
        }
        //XMLHttpRequest传参无影响
        var xhr = new (window.XMLHttpRequest || ActiveXObject)('Microsoft.XMLHTTP');
        // get搜索字符串
        var search = '';

        // 将data序列化
        var param = ''
        for(var i in opts.data){
            param += '&'+ i + '=' + opts.data[i]
        }
        param = param?param.substr(1):'';
     
        if(/^POST$/i.test(opts.type)){
            xhr.open(opts.type, opts.url, opts.async);
            param = opts.data
        }else{
            search = (opts.url.indexOf('?') > -1 ? '&' : '?') + param;
            if(!opts.cache) {
                search += '&radom='+Math.random();
            }
            
            param = null;
            xhr.open(opts.type, opts.url + search, opts.async);
        }

        // 进度监听
        xhr.addEventListener('progress', function(evt){
            if(evt.lengthComputable){
                var percentComplete = evt.loaded/evt.total;
                console.log(percentComplete);
                $("#progressing").innerHTML = ~~(percentComplete*100) + '%';
            }
        },false);
        
        // 文件下载
        if(opts.binary){
            xhr.responseType = 'blob'
        }

        // callback
        xhr.onreadystatechange = function() {
            if( xhr.readyState == 4 ) {
                if( xhr.status >= 200 && xhr.status < 300 || xhr.status == 304 ) {
                    if(opts.binary){
                        var filename = opts.fileName;
                        if (typeof window.chrome !== 'undefined') {
                            // Chrome version
                            var link = document.createElement('a');
                            link.href = window.URL.createObjectURL(xhr.response);
                            link.download = filename;
                            link.click();
                        } else if (typeof window.navigator.msSaveBlob !== 'undefined') {
                            // IE version
                            var blob = new Blob([xhr.response], { type: 'application/force-download' });
                            window.navigator.msSaveBlob(blob, filename);
                        } else {
                            // Firefox version
                            var file = new File([xhr.response], filename, { type: 'application/force-download' });
                            window.open(URL.createObjectURL(file));
                        }
                    }else{
                        var text = xhr.responseText;
                        // json格式转换
                        if(opts.dataType == 'json') {
                            text = parseJSON(text)
                        }
                        if( typeof opts.success === 'function') {
                            opts.success(text,xhr.status)
                        }  
                    }
                }else{
                    if(typeof opts.fail === 'function') {
                        opts.fail('获取失败', 500)
                    }
                }
            }
        }

        xhr.setRequestHeader('content-type',opts.contentType);

        // get请求时param时null
        xhr.send(param);

        // 如果设置了超时，就定义
        if(typeof opts.timeout === 'number') {
            // ie9+
            if( xhr.timeout ) {
                xhr.timeout = opts.timeout;
            }else {
                setTimeout(function() {
                    xhr.abort();
                },opts.timeout)
            }
        }
    }
    function down(item){
        var fileName = item.innerHTML
        $("#progressing").innerHTML = '0%'
        ajax({
            url:'/node/file/'+fileName,
            type:'POST',
            dataType:'json',
            binary:true,
            fileName:fileName,
            success:function(){
                alert('download~~~~~');
            }
        })
    }
    $(".file").forEach(function(item){
        item.addEventListener("click",function(){
            down(this);
        },false);
    });
}(window))