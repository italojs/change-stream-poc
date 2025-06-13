import { Meteor } from 'meteor/meteor';
import { LinksCollection } from '/imports/api/links';


Meteor.startup(async () => {
  console.log('[Startup] Meteor server is starting...');
  // If the Links collection is empty, add some data.
  const count = await LinksCollection.find().countAsync();
  console.log(`[Startup] LinksCollection count: ${count}`);

  Meteor.publish("links", function () {
    console.log('[Publish] links publication requested');
    return LinksCollection.find();
  });

  // Nova publicação stream para change stream
  // Use Meteor.server.publishStream diretamente, pois Meteor.publish.stream não existe
  Meteor.publish.stream('links.changeStream', function (sub) {
    const changeStream = LinksCollection.watch([
      { $match: { operationType: 'insert' } }
    ]);
    changeStream.on('change', (change) => {
      sub.stream(change);
    });
    sub.onStop(() => changeStream.close());
  });
});
