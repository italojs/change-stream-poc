import { Mongo } from 'meteor/mongo';

export const ChangeStreamEvents = new Mongo.Collection('changeStreamEvents');
