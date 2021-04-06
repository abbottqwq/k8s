const keys = require("./keys");

const express = require("express");
// const bodyParser = require("body-parse");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());


const { Pool } = require("pg");
const pgClient = new Pool({
	user: keys.pgUser,
	host: keys.pgHost,
	database: keys.pgDatabase,
	password: keys.pgPassword,
	port: keys.pgPort,
});

pgClient.on('connect', () => {
	pgClient
	  .query('CREATE TABLE IF NOT EXISTS values (number INT)')
	  .catch((err) => console.log(err));
	  console.log("connecting");
  });

const redis = require("redis");

const redisClient = redis.createClient({
	host: keys.redisHost,
	port: keys.redisPort,
	retry_strategy: () => 1000,
});

const redisPublisher = redisClient.duplicate();

app.get("/", (req, res) => {
	res.send("Hi");
});

app.get("/values/all", async (req, res) => {
	const values = await pgClient.query("select * from values");
	console.log(values.rows);
	res.send(values.rows);
});

app.get("/values/current", (req, res) => {
	redisClient.hgetall("value", (err, values) => {
		console.log("values is ", values);
		res.send(values);
	});
});
app.post('/values', async (req, res) => {
	const index = req.body.index;
  
	if (parseInt(index) > 40) {
	  return res.status(422).send('Index too high');
	}
	console.log('index is ', index)
	redisClient.hset('values', index, 'Nothing yet!');
	redisPublisher.publish('insert', index);
	pgClient.query('INSERT INTO values(number) VALUES($1)', [index]);
  
	res.send({ working: true });
  });

app.get('/values', async (req, res)=>{
	res.send("hello world")
})

app.listen(5000, (err) => console.log("listening"));
