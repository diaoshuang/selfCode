var num = 9
var mymodule = {
	num:81,
	getNum:function(){console.log( this.num)}
}
mymodule.getNum()
var getNum = mymodule.getNum
getNum()
var bindGetNum = getNum.bind(mymodule)
bindGetNum()