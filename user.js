const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000;


let users = require('./resources/Users.js');
let feeds = require('./resources/Feeds.js');

// simulate database

app.use(cors());


// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// returns all user
app.post('/', (req, res) => {
    res.json(users);
});

app.post('/register', (req, res) => {
	const new_user = req.body;

	// check name, user, email
	if(!new_user.username || !new_user.name || !new_user.email || !new_user.phone){
		return res.status(400).json('Required field(s) missing.');
	}
    users.Users.push(new_user);
    res.json(new_user);
});

app.post('/posts/:feed_id?', (req, res) => {
	feed_id = req.params.feed_id;

	if(feed_id){
		// find feed
		let feed = feeds.Feeds.filter((feed) => { return (feed.id == feed_id)});

		if(!feed) return res.status(400).json('Invalid feed');

		return res.json(feed[0]);
	}


    return res.json(feeds);
});

app.post('/post/:feed_id', (req, res) => {
	const new_post = req.body;

	feed_id = req.params.feed_id;

	// check name, user, email
	if(!new_post.username || !new_post.post || !feed_id){
		return res.status(400).json('Required field(s) missing.');
	}

	// find feed
	let feed = feeds.Feeds.filter((feed) => { return (feed.id == feed_id)});

	if(!feed) return res.status(400).json('Invalid feed');

	feed[0].posts.push(new_post);

    res.json(feed[0]);
});

app.post('/profile/:username', (req, res) => {
	username = req.params.username;

	if(!username) return res.status(400).json('Username can not be empty');

	let user = users.Users.filter((user) => { return (user.username === username)});

	return (user.length > 0) ? res.json(user[0]) : res.status(400).json('Invalid User');


});

app.listen(port, () => console.log(`App listening on port ${port}!`))
