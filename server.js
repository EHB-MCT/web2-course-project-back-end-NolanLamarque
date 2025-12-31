// Information gathered from video tutorials available on Canvas
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT;
const URI = process.env.MONGO_URI;

app.use(express.json())
app.use(cors())

// Embed code from MongoDB cluster
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Syntax from MongoDB documentation and help from chatGPT [Source 1 in README section chatGPT + external links]
let database;

async function mongoConnection() {
  await client.connect();
  database = client.db(process.env.MONGO_NAME);
  console.log("connected to MongoDB");
}



app.get('/', async (req, res) => {
    res.send("OK")
})


app.get('/birds', async (req, res) => {
   const birdsData = await database.collection('birds').find().toArray();
   res.json(birdsData);
})

// Syntax from MongoDB documentation and help from chatGPT [Source 1 in README section chatGPT + external links]
app.post('/saves', async (req, res) => {
  const newSave = req.body;
  await database.collection('saves').insertOne(newSave);
  res.json("New save created");
})


mongoConnection()

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

