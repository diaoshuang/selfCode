let http = require("http");
let url = require("url");

let start = (route) => {
	let onRequest = (request, response) => {
		let pathname = url.parse(request.url).pathname;
		console.log('Request for ' + pathname + 'received');
		route(pathname);

		response.writeHead(200,{
			'Content-Type':"text/plain;charset=utf-8"
		});
		response.write('添加小卫星')
		response.end();
	}
	http.createServer(onRequest).listen(8888);
	console.log('Server has started');
}

exports.start = start