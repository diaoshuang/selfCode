function Fibonacci(n){
    console.time('start compute');
    if(typeof n !== 'number' || isNaN(n) || n<1){
        return null;
    }
    n = ~~n;
    let result = 0;
    if(n<2){
        result = 1;
    }else{
        let [a,b,c] = [1,1,2];
        for(let i=3;i<=n;i++){
            c = a + b;
            [a,b] = [b,c];
        }
        result = c
    }
    console.timeEnd('start compute');
    return result;
}

function Fibonacci2(n){
    //console.time('start compute2');
    if(typeof n !== 'number' || isNaN(n) || n<1){
        return null;
    }
    n = ~~n;
    if(n<2){
        return 1;
    }else{
        return (Fibonacci2(n-2)+Fibonacci2(n-1))
    }
    //console.timeEnd('start compute2');
}