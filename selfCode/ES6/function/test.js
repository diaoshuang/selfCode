/**
 * 函数调用代码测试，计算阶乘的方法
 * 1 . 直接计算（最直观）
 * 2 . 递归调用（代码最简洁）
 * 3 . 尾递归（代码效率高又不失简洁）
 */

// 1
function a(n){
    let result = 1;
    for(let i=1;i<=n;i++){
        result *= i;
    }
    return result
}// 
// 2
function b(n){
    if(n===1) return 1;
    return b(n-1)*n;
}// 
// 3
function c(n,result=1){
    if(n===1) return result;
    return c(n-1,result*n);
}// 尾递归优化的核心思想，是将使用到的外层变量，转换为方法参数传递，以摆脱对前方法的依赖
// 
// 
// 
// 管道机制（pipeline）的例子，即前一个函数的输出是后一个函数的输入
let pipeline = (...funcs) => val => funcs.reduce((a,b) => b(a),val) 

const plus1 = a => a + 1;
const mult2 = a => a * 2;
const addThenMult = pipeline(plus1, mult2);

addThenMult(5)


