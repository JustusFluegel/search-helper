const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config({ path: './.env' });
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
const { client, db, users } = require('./db/conn');
const { ObjectID } = require('bson');

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

app.post('/api/createUser', async (req, res) => {
  const { name } = req.body;
  const newUser = await users.insertOne({ name });
  console.log(JSON.stringify(newUser));
  res.json(JSON.stringify(newUser));
});

app.get('/api/users', async (req, res) => {
  const cursor = users.find({});
  res.send(await cursor.toArray());
});

app.get('/api/read', async (req, res) => {
  const { _id } = req.body;
  const myUser = await users.findOne({ _id: ObjectID(_id) });
  res.send(myUser);
});

app.delete('/api/deleteUser', async (req, res) => {
  const { _id } = req.body;
  const result = await users.deleteOne({ _id: ObjectID(_id) });
  res.send(result);
});

app.put('/api/update/addLink', async (req, res) => {
  const { _id, link } = req.body;
  const result = await users.updateOne(
    { _id: ObjectID(_id) },
    { $addToSet: { saved: link } }
  );
  res.send(result);
});

app.put('/api/update/remLink', async (req, res) => {
  const { _id, link } = req.body;
  const result = await users.updateOne(
    { _id: ObjectID(_id) },
    { $pull: { saved: link } }
  );
  res.send(result);
});

app.delete('/api/deleteAll', async (req, res) => {
  await users.deleteMany({});
  res.send('Deleted all.');
});
