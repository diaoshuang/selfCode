function observe(data){
	if(!data || typeof data !== 'object'){
		return;
	}
	Object.keys(data).forEach(function(key){
		defineReactive(data,key,data[key]);
	});
}

function defineReactive(data,key,val){
	observe(val);
	Object.defineProperty(data,key,{
		enumerable: true,
		configurable: false,
		get: function(){
			console.log('get run : ' + key);
			return val;
		},
		set: function(newVal){
			console.log('set run : ' + key);
			val = newVal;
		}
	});
}