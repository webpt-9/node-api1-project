// implement your API here

// here I'm importing express from the node modules
const express = require('express');

// creating the server using express.
const server = express();

// here we import the methods from the database so we can use them in our endpoints
const db = require('./data/db.js');

// telling the server which port to listen on.
const port = 4000;
server.listen(port, () => {
	console.log(`listening on port ${port}`);
});

// global middleware
server.use(express.json());

// CRUD
// Create - POST
// Read - GET
// Update - PUT
// Delete - DELETE

server.get('/', (req, res) => {
	res.send('server is working!!');
});

server.post('/api/users', (req, res) => {
	const userInfo = req.body;

	if (userInfo.name && userInfo.bio) {
		db
			.insert(userInfo)
			.then((id) => {
				res.status(201).json({ success: true, ...userInfo, id });
			})
			.catch((err) => {
				res.status(500).json({ error: 'there was an error while saving the user to the database' });
			});
	} else {
		res.status(404).json({ error: 'please add a name and bio' });
	}
});

server.get('/api/users', (req, res) => {
	db
		.find()
		.then((users) => {
			res.status(200).json(users);
		})
		.catch((err) => {
			res.status(500).json({ error: 'the user could not be retrieved' });
		});
});

server.get('/api/users/:id', (req, res) => {
	const { id } = req.params;

	db
		.findById(id)
		.then((user) => {
			if (user) {
				res.status(200).json({ success: true, user });
			} else {
				res.status(404).json({ error: 'the user with the specified id does not exists' });
			}
		})
		.catch((err) => {
			res.status(500).json({ error: ' the user information could not be retrieved' });
		});
});

server.delete('/api/users/:id', (req, res) => {
	const { id } = req.params;

	db
		.remove(id)
		.then((deleted) => {
			if (deleted) {
				res.status(204).end();
			} else {
				res.status(404).json({ message: 'The user with the specified id does not exist' });
			}
		})
		.catch((err) => {
			res.status(500).json({ error: 'the user could not be removed' });
		});
});

server.put('/api/users/:id', (req, res) => {
	const { id } = req.params;
	const user = req.body;

	if (id) {
		if (user.name && user.bio) {
			db
				.update(id, user)
				.then((updated) => {
					res.status(200).json({ success: true, updated });
				})
				.catch((err) => {
					res.status(500).json({ error: 'The user information could not be modified' });
				});
		} else {
			res.status(400).json({ error: 'please provide a name and bio for the user' });
		}
	} else {
		res.status(404).json({ error: 'user with the specified id does not exist' });
	}
});
