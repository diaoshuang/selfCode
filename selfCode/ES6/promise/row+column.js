// 顺序执行方法
function row(...arr){
  if(!arr || !(arr instanceof Array) || arr.length<1){
    return;
  }
  let fun;
  for(var i of arr){
    if(fun instanceof Promise){
      fun = fun.then(i)
    }else{
      fun = i()
    }
  }
}

let pipe = (...funcs) => val => funcs.reduce((a,b) =>{
    if(a instanceof Promise){
      b = a.then(b);
    }else{
      b = a()
    }
  },val)

// 并发执行方法
function column(arr){
  if(!arr || !(arr instanceof Array) || arr.length<1){
    return;
  }
  let fun;
  for(var i of arr){
    setTimeout(i,0)
  }  
}