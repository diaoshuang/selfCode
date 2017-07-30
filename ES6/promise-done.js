/**
done()
Promise对象的回调链，不管以then方法或catch方法结尾，要是最后一个方法抛出错误，
都有可能无法捕捉到（因为Promise内部的错误不会冒泡到全局）。因此，我们可以提供一个done方法，
总是处于回调链的尾端，保证抛出任何可能出现的错误。

asyncFunc()
  .then(f1)
  .catch(r1)
  .then(f2)
  .done();
它的实现代码相当简单。

*/

Promise.prototype.done = (onFulfilled,onRejected) =>{
  this.then(onFulfilled,onRejected)
    .catch(function(reason){
      // 抛出全局错误提示
      setTimeout(()=>{throw reason},0)
    })
}


// finally 方法
Promise.prototype.finally = function (callback) {
  let P = this.constructor;
  return this.then(
    value  => P.resolve(callback()).then(() => value),
    reason => P.resolve(callback()).then(() => { throw reason })
  );
};


// 图片加载 promise

var loadImg  = (url) => {
  var promise = new Promise((resolve,reject)=>{
    var img = new Image();
    img.onload = resolve;
    img.onerror = reject;
    img.src = url;
  })
  // 返回promise类型，方便执行后续方法
  return promise;
}

/*
Generator函数与Promise的结合
使用Generator函数管理流程，遇到异步操作的时候，通常返回一个Promise对象。

*/
function getFoo () {
  return new Promise(function (resolve, reject){
    resolve('foo');
  });
}

var g = function* () {
  try {
    var foo = yield getFoo();
    console.log(foo);
  } catch (e) {
    console.log(e);
  }
};

function run (generator) {
  var it = generator();

  function go(result) {
    if (result.done) return result.value;

    return result.value.then(function (value) {
      return go(it.next(value));
    }, function (error) {
      return go(it.throw(error));
    });
  }

  go(it.next());
}

run(g);


// 同步|异步函数做promise转换
const f = () => console.log('now');
(async () => f())()
  .then()
  .catch()
  .finally();
console.log('next');

const f = () => console.log('now');
(
  () => new Promise(
    resolve => resolve(f())
  )
)();
console.log('next');
