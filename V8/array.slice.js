// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice

function ArraySlice(start, end) { 
  CHECK_OBJECT_COERCIBLE(this, "Array.prototype.slice"); 
  var len = TO_UINT32(this.length); 
  var start_i = TO_INTEGER(start); 
  var end_i = len; 

  if (!IS_UNDEFINED(end)) end_i = TO_INTEGER(end);//如果没传入end，end=length，即slice第二个参数可选。 

  if (start_i < 0) { 
    start_i += len;//参数1的A分支 处理负值，+= length。如：为-1，则start从倒数第一个开始，负值绝对值小于length 
    if (start_i < 0) start_i = 0;//参数1的A.a分支 若仍未负值，则等于0。 即处理负值绝对值大于length [1,2,3].slice(-4)。 
  } else { 
    if (start_i > len) start_i = len;//参数1的B分支 参数大于length，则等于length，处理 [1,2,3].slice(5),返回[] 
  } 

  if (end_i < 0) { 
    end_i += len;//参数2的A分支 处理负值，+= length。如：为-1，则start从倒数第一个开始，负值绝对值小于length 
    if (end_i < 0) end_i = 0;//参数2的A.a分支 若仍未负值，则等于0。 即处理负值绝对值大于length [1,2,3].slice(1,-4)。 
  } else { 
    if (end_i > len) end_i = len;//参数2的B分支 参数大于length，则等于length，处理 [1,2,3].slice(1,5) == [1,2,3].slice(1) == 
  } 
    //最终返回结果的值。可以看到这里会返回一个新的真正的数组（ps：slice的好基友splice是修改原数组的。） 
  var result = []; 
  // 处理分支1   如果经历了上面代码的层层检查设置，结束值小于开始值，那么直接返回空数组，处理 [1,2,3].slice(2,1) 
  if (end_i < start_i) return result; 
  // 处理分支2 如果是数组 && !%IsObserved(this) && 结束大于1000 && %EstimateNumberOfElements(this) < 结束值 ，那么使用方法SmartSlice来处理 
  if (IS_ARRAY(this) && 
      !%IsObserved(this) && 
      (end_i > 1000) && 
      (%EstimateNumberOfElements(this) < end_i)) { 
    SmartSlice(this, start_i, end_i - start_i, len, result); 
  } else { 
    // 处理分支2 调用SimpleSlice 处理。 
    SimpleSlice(this, start_i, end_i - start_i, len, result); 
  } 
  //设置length，似乎多余？还是v8中的数组[] 需指定length。  此处待探寻。。。 
  result.length = end_i - start_i; 

  return result; 
} 
/* 
* ...... 
*/ 
// Set up non-enumerable functions of the Array.prototype object and 
  // set their names. 
  // Manipulate the length of some of the functions to meet 
  // expectations set by ECMA-262 or Mozilla. 
  InstallFunctions($Array.prototype, DONT_ENUM, $Array( 
    //...... 
    "slice", getFunction("slice", ArraySlice, 2) 
    //...... 
  ));

  // This function implements the optimized splice implementation that can use
// special array operations to handle sparse arrays in a sensible fashion.
/**
 * 源码：https://github.com/v8/v8/blob/master/src/array.js#L196-L221
 * @param {Array} array 具体需要艹做的数组
 * @param {Number} start_i 参数1，从何处开始
 * @param {Number} del_count 需要取到的长度。 参数2 - 参数1，
 * @param {Number} len 数组长度
 * @param {Array} deleted_elements 对于slice来说，是选择的那部分数组，对于splice来说，是删除的那些数组。
 * @returns {undefined}  此处直接艹做 传入的reuslt，即可反馈到ArraySlice作用域的result，与真实的浏览器环境不一样！。
 */
function SmartSlice(array, start_i, del_count, len, deleted_elements) {
  // Move deleted elements to a new array (the return value from splice).
  // 猜测？ 获取start_i + del_count的key。[1,2,3,4].slice(1,2) 返回 [1,2,3,4][1+2]索引3  ，而当tart_i + del_count大于length时候返回整个数组，如[1,2,3,4].slice(2,3) 即[1,2,3,4][5] 返回整个数组
  var indices = %GetArrayKeys(array, start_i + del_count);
  if (IS_NUMBER(indices)) {
    var limit = indices;
    for (var i = start_i; i < limit; ++i) {
      var current = array[i];
      if (!IS_UNDEFINED(current) || i in array) {
        deleted_elements[i - start_i] = current;
      }
    }
  } else {
    var length = indices.length;
    for (var k = 0; k < length; ++k) {
      var key = indices[k];
      if (!IS_UNDEFINED(key)) {
        if (key >= start_i) {
          var current = array[key];
          if (!IS_UNDEFINED(current) || key in array) {
            deleted_elements[key - start_i] = current;
          }
        }
      }
    }
  }
}


// This is part of the old simple-minded splice.  We are using it either
// because the receiver is not an array (so we have no choice) or because we
// know we are not deleting or moving a lot of elements.
/**
 * 源码：https://github.com/v8/v8/blob/master/src/array.js#L271-L282
 * @param {Array} array 具体需要艹做的数组
 * @param {Number} start_i 参数1，从何处开始
 * @param {Number} del_count 需要取到的长度。 参数2 - 参数1，
 * @param {Number} len 数组长度
 * @param {Array} deleted_elements 对于slice来说，是选择的那部分数组，对于splice来说，是删除的那些数组。
 * @returns {undefined}  此处直接艹做 传入的reuslt，即可反馈到ArraySlice作用域的result，与真实的浏览器环境不一样！。
 */
function SimpleSlice(array, start_i, del_count, len, deleted_elements) {
  for (var i = 0; i < del_count; i++) {
    var index = start_i + i;
    // The spec could also be interpreted such that %HasLocalProperty
    // would be the appropriate test.  We follow KJS in consulting the
    // prototype.
    var current = array[index];
    if (!IS_UNDEFINED(current) || index in array) {
      deleted_elements[i] = current;
    }
  }
}