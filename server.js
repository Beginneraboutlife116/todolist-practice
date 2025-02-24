const { createServer } = require('http');
const { v4: uuidv4 } = require('uuid');

const {
	headers,
	errorHandler,
} = require('./error-handler');
const {
	parseRequestBody
} = require('./utils');

const port = process.env.PORT || 3000;
const todos = [];

const server = createServer((req, res) => {
	const { url, method } = req;

	try {
		if (url.startsWith('/todos')) {
			if (method === 'OPTIONS') {
				res.writeHead(204, headers);
				res.end();

				return;
			}

			if (method === 'GET') {
				res.writeHead(200, headers);
				res.write(JSON.stringify(todos));
				res.end();
				
				return;
			}

			if (method === 'POST') {
				parseRequestBody(req).then(body => {
					const { title } = JSON.parse(body);

					if (!title || !title.trim()) {
						throw new Error('Title is not valid.')
					}

					const newTodo = {
						id: uuidv4(),
						title: title.trim(),
					}

					todos.push(newTodo);

					res.writeHead(201, headers);
					res.write(JSON.stringify(newTodo))
					res.end();
				}).catch(err => {
					errorHandler(res, {
						code: 400,
						message: err.message,
					})
				})

				return;
			}

			if (method === 'DELETE') {
				const id = url.split('/')[2];

				if (!id) {
					todos.length = 0;
	
					res.writeHead(204, headers);
					res.end();
				} else {
					const index = todos.findIndex(todo => todo.id === id);

					if (index !== -1) {
						todos.splice(index, 1);

						res.writeHead(204, headers);
						res.end();
					} else {
						errorHandler(res, {
							code: 404,
							message: 'Todo id can not find.'
						})
					}
				}

				return;
			}

			if (method === 'PATCH') {
				const id = url.split('/')[2];

				if (!id) {
					errorHandler(res, {
						code: 400,
						message: 'Please with todo id'
					})
				} else {
					const index = todos.findIndex(todo => todo.id === id);

					if (index !== -1) {
						parseRequestBody(req).then(body => {
							const { title } = JSON.parse(body);

							if (!title || !title.trim()) {
								throw new Error('Title is not valid.')
							}

							todos[index].title = title;

							res.writeHead(200, headers);
							res.write(JSON.stringify(todos[index]));
							res.end();
						}).catch(err => {
							errorHandler(res, {
								code: 400,
								message: err.message,
							})
						})
					} else {
						errorHandler(res, {
							code: 404,
							message: 'Todo id can not find.',
						})
					}
				}

				return;
			}
		} else {
			errorHandler(res, {
				code: 404,
				message: 'Not Found',
			})
		}
	} catch (err) {
		errorHandler(res);
	}
})

server.listen(port, () => {
	console.log(`Server is on http://localhost:${port}`);
})
