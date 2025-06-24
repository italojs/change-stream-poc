import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
export const LinksCollection = new Mongo.Collection('links');

if (Meteor.isServer) {
  Meteor.methods({
    'links.insert'({ title, url }) {
      return LinksCollection.insertAsync({ title, url, createdAt: new Date() });
    },
  });
}
