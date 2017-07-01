// prmise包裹函数
function promisify(fun){
   if(!(fun instanceof Function) || fun instanceof Promise){
     return fun;
   }
   return function(){
     let argus = [];
     for(let i of arguments){
       argus.push(i)
     }
     return new Promise((res, rej)=>{
       argus.push(res)
       argus.push(rej)
       fun.apply(this,argus)
     })
   }
}
