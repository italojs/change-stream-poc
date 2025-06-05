// --- START: Random changes loop in links collection ---
import { LinksCollection } from '/imports/api/links';

let randomizerInterval = null;
let randomizerMs = 2000; // default interval: 2 seconds

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomString(len = 6) {
  return Math.random().toString(36).substring(2, 2 + len);
}

async function randomLinksOp() {
  const ops = ['insert', 'update', 'delete'];
  const op = ops[getRandomInt(0, ops.length - 1)];
  switch (op) {
    case 'insert':
      await LinksCollection.insertAsync({
        title: 'Random ' + randomString(4),
        url: 'https://example.com/' + randomString(6),
        createdAt: new Date(),
        msg: 'insert',
        foo: randomString(4),
        bar: getRandomInt(1, 100)
      });
      break;
    case 'update': {
      const doc = await LinksCollection.findOneAsync({}, { sort: { createdAt: -1 } });
      if (!doc) return;
      await LinksCollection.updateAsync(doc._id, { $set: {
        title: 'Updated ' + randomString(4),
        url: 'https://example.com/' + randomString(6),
        updatedAt: new Date(),
        msg: 'update',
        foo: randomString(4),
        bar: getRandomInt(1, 100)
      }});
      break;
    }
    case 'delete': {
      const doc = await LinksCollection.findOneAsync({}, { sort: { createdAt: -1 } });
      if (!doc) return;
      await LinksCollection.removeAsync(doc._id);
      break;
    }
    default:
      break;
  }
}

Meteor.methods({
  'links.startRandomizer'(ms) {
    if (randomizerInterval) clearInterval(randomizerInterval);
    randomizerMs = typeof ms === 'number' && ms > 200 ? ms : 2000;
    randomizerInterval = setInterval(randomLinksOp, randomizerMs);
    return { started: true, interval: randomizerMs };
  },
  'links.stopRandomizer'() {
    if (randomizerInterval) clearInterval(randomizerInterval);
    randomizerInterval = null;
    return { stopped: true };
  },
});
// --- END: Random changes loop ---
import { Meteor } from 'meteor/meteor';


Meteor.startup(async () => {
  // We publish the entire Links collection to all clients.
  // In order to be fetched in real-time to the clients
  Meteor.publish("links", function () {
    return LinksCollection.find();
  });


  // Meteor methods for CRUD operations on links
  Meteor.methods({
    async 'links.insertOperation'() {
      const id = await LinksCollection.insertAsync({
        title: 'Change Stream Test',
        url: 'https://meteor.com',
        createdAt: new Date(),
      });
      return id;
    },
    async 'links.updateOperation'() {
      const doc = await LinksCollection.findOneAsync({}, { sort: { createdAt: -1 } });
      if (!doc) return null;
      await LinksCollection.updateAsync(doc._id, { $set: { title: 'Updated ' + new Date().toISOString() } });
      return doc._id;
    },
    async 'links.removeTest'() {
      const doc = await LinksCollection.findOneAsync({}, { sort: { createdAt: -1 } });
      if (!doc) return null;
      await LinksCollection.removeAsync(doc._id);
      return doc._id;
    },
    async 'links.upsertOperation'() {
      const doc = await LinksCollection.findOneAsync({ title: 'Upsert Change Stream' });
      let id;
      if (doc) {
        await LinksCollection.updateAsync(doc._id, { $set: { url: 'https://meteor.com/upsert', updatedAt: new Date() } });
        id = doc._id;
      } else {
        id = await LinksCollection.insertAsync({ title: 'Upsert Change Stream', url: 'https://meteor.com/upsert', createdAt: new Date() });
      }
      return id;
    }
  });

  // Change Streams Example
  // Only works if you are using a replica set or MongoDB Atlas
  const { MongoClient } = await import('mongodb');
  const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017,localhost:27018,localhost:27019/?replicaSet=rs0';
  const client = new MongoClient(mongoUrl);
  try {
    await client.connect();
    const db = client.db();
    const collection = db.collection('links');
    const changeStream = collection.watch();
    changeStream.on('change', (change) => {
      // Send to all connected clients via DDP
      Meteor.server?.connections?.forEach(conn => {
        conn.send(change);
      });
    });
  } catch (err) {
    console.error('Error starting change stream:', err);
  }
});
