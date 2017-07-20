function observe(data){
    if(!data || typeof data !== 'object'){
        return;
    }
    Object.keys(data).forEach(function(key){
        defineReactive(data,key,data[key]);
    })
}
function defineReactive(data,key,val){
    observe(val) // 监听子属性
    Object.defineProperty(data,key,{
        enumerable:true, // 可枚举
        configurable: false, // 表示能否重新定义属性
        writable:true, // 表示能否修改属性的值
        get: function(){
            return val
        },
        set: function(newVal){
            console.log('监听触发 ： set新值了 ',val,' ---> ',newVal);
            val = newVal;
        }
    });
}