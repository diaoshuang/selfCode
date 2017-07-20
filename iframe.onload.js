/测试成功 可以再onload事件触发之前获取元素


newFrame=document.createElement("iframe");
newFrame.name="newFrame";
newFrame.id="newFrame";
newFrame.width=300;
newFrame.height=300;
document.body.appendChild(newFrame); 
newFrame.src="http://www.pixiv.net/member_illust.php?mode=medium&illust_id=54653881";


// This function ONLY works for iFrames of the same origin as their parent
function iFrameReady(iFrame, fn) {
var timer;
var fired = false;


function ready() {
if (!fired) {
fired = true;
clearTimeout(timer);
fn.call(this);
}
}


function readyState() {
if (this.readyState === "complete") {
ready.call(this);
}
}


// cross platform event handler for compatibility with older IE versions
function addEvent(elem, event, fn) {
if (elem.addEventListener) {
return elem.addEventListener(event, fn);
} else {
return elem.attachEvent("on" + event, function () {
return fn.call(elem, window.event);
});
}
}


// use iFrame load as a backup - though the other events should occur first
addEvent(iFrame, "load", function () {
ready.call(iFrame.contentDocument || iFrame.contentWindow.document);
});


function checkLoaded() {
var doc = iFrame.contentDocument || iFrame.contentWindow.document;
// We can tell if there is a dummy document installed because the dummy document
// will have an URL that starts with "about:". The real document will not have that URL
if (doc.URL.indexOf("about:") !== 0) {
if (doc.readyState === "complete") {
ready.call(doc);
} else {
// set event listener for DOMContentLoaded on the new document
addEvent(doc, "DOMContentLoaded", ready);
addEvent(doc, "readystatechange", readyState);
}
} else {
// still same old original document, so keep looking for content or new document
timer = setTimeout(checkLoaded, 1);
}
}
checkLoaded();
}


document.getElementById("newFrame").onload=function () {
console.log("现在触发onload事件，比iFrameReady发生的晚");
};


iFrameReady(document.getElementById("newFrame"), function() {
var fonud = this.getElementsByClassName("after")[0].getElementsByTagName("a")[0];
console.log(fonud);
});

