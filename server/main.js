import { Meteor } from 'meteor/meteor';
import { LinksCollection } from '/imports/api/links';


Meteor.startup(async () => {
  console.log('[Startup] Meteor server is starting...');
  // If the Links collection is empty, add some data.
  const count = await LinksCollection.find().countAsync();
  console.log(`[Startup] LinksCollection count: ${count}`);

  Meteor.publish("links", function () {
    return LinksCollection.find();
  });

  Meteor.publish.stream('streamLinks', function (sub) {
    const changeStream = LinksCollection.watch([
      { $match: { operationType: 'insert' } }
    ]);
    changeStream.on('change', (change) => {
      sub.stream(change);
    });
    sub.onStop(() => changeStream.close());
  });
});
