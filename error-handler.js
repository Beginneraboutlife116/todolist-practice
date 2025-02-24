const headers = {
	'Content-Type': 'application/json',
	'Allow-Control-Allow-Method': 'GET, OPTIONS, POST, DELETE, PATCH',
	'Allow-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
};

function errorHandler(res, err = {
	code: 500,
	message: 'Internet Error',
}) {
	res.writeHead(err.code, headers);
	res.write(JSON.stringify({
		message: err.message
	}))
	res.end();
}

module.exports = {
	headers,
	errorHandler,
}
