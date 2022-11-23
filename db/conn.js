const { MongoClient } = require('mongodb');
const uri = process.env.ATLAS_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = client.db('searchHelper');
const users = db.collection('users');

module.exports = { client, db, users };
