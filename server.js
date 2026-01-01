// Information gathered from video tutorials available on Canvas [Source 2 in external links section in README]
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
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
  // Information gathered from video tutorials available on Canvas [Source 2 in external links section in README]
    res.sendFile(path.join(__dirname, 'index.html'));
})

// Syntax from MongoDB documentation and help from chatGPT for "toArray()" part, [Source 1 in README section chatGPT + external links]
app.get('/birds', async (req, res) => {
   const birdsData = await database.collection('birds').find().toArray();
   res.json(birdsData);
})

app.get('/birds/:name', async (req, res) => {
  const specificBird = req.params.name;
  const birdsData = await database.collection('birds').find({name: specificBird}).toArray();
  res.json(birdsData);
})

app.get('/saves/:username', async (req, res) => {
  const specificName = req.params.username;
  const savesData = await database.collection('saves').find({username: specificName}).toArray();
  res.json(savesData);
})

// Syntax from MongoDB documentation and help from chatGPT [Source 1 in README section chatGPT + external links]
app.post('/saves', async (req, res) => {
  const newSave = req.body;
  await database.collection('saves').insertOne(newSave);
  res.json("New save created");
})

// Syntax from MongoDB documentation and help from chatGPT for the structure and information, [Source 1 in README section chatGPT + external links]
app.put('/saves/:username', async (req, res) => {
  const name = req.params.username;
  const saveUpdate = req.body;
  await database.collection('saves').updateOne({username: name}, { $set: saveUpdate});
  res.json("Save updated");

})

// Syntax from MongoDB documentation
app.delete('/saves/:username', async (req, res) => {
  const name = req.params.username;
  const deleteSave = req.body;
  await database.collection('saves').deleteOne({username: name}, {$set: deleteSave})
  res.json("Delete succesful");

})

mongoConnection()

// // Information gathered from video tutorials available on Canvas [Source 2 in external links section in README]
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log('Endpoints:');
  console.log(' GET/birds           -Get all birds');
  console.log(' GET/birds:name      -Get birds by name');
  console.log(' GET/saves/:username -Get profile by username');
  console.log(' POST/saves          -Create new profile with username and level number');
  console.log(' PUT/saves           -Update savedata');
  console.log(' DELETE/saves        -Delete a profile and its savedata');
})

