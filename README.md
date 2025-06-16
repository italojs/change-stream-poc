# Meteor Change Streams POC

This is a Proof of Concept (POC) demonstrating the implementation of Change Streams in Meteor, based on [Pull Request #13787](https://github.com/meteor/meteor/pull/13787).

## 🌟 Features Demonstrated

This project demonstrates the usage of Meteor's new streaming APIs:

- **`Meteor.publish.stream`** - Publishing change streams on the server
- **`Meteor.subscribeStream`** - Subscribing to streams on the client

> **⚠️ API Note**: The `subscribeStream` API will be transformed to `subscribe.stream` in the next commits.

## 🎯 Inspiration

This Developer Experience (DX) was inspired by the excellent [Jam pub/sub package](https://github.com/jamauro/pub-sub/tree/main#change-streams-based-publish--subscribe), which already implements similar patterns for change streams.

## 🚀 How It Works

### 1. Stream Publication on Server

In the `server/main.js` file, we use `Meteor.publish.stream` to create a publication that monitors changes in the collection:

```javascript
Meteor.publish.stream('streamLinks', function (sub) {
  const changeStream = LinksCollection.watch([
    { $match: { operationType: 'insert' } }
  ]);
  
  changeStream.on('change', (change) => {
    sub.stream(change);
  });
  
  sub.onStop(() => changeStream.close());
});
```

**Features:**
- Uses MongoDB Change Streams natively
- Allows specific filters (in the example, only `insert` operations)
- Automatically manages connection lifecycle
- Calls `sub.stream(data)` to send data to clients

### 2. Stream Subscription on Client

In the `imports/ui/Info.jsx` file, we use `Meteor.subscribeStream` to receive real-time events:

```javascript
useEffect(() => {
  // Subscribe to the change stream
  const sub = Meteor.subscribeStream('streamLinks');
  
  sub.onData((data) => {
    setStreamEvents(evts => [data, ...evts]);
  });
  
  return () => sub.stop();
}, []);
```

**Features:**
- Simple and reactive API
- `onData` callback to process received events
- Automatic cleanup with `sub.stop()`
- Perfect integration with React hooks

## 🏗️ Project Structure

```
├── client/                 # Meteor client
├── server/                 # Meteor server
├── imports/
│   ├── api/
│   │   └── links.js       # Collection and methods
│   └── ui/
│       ├── App.jsx        # Main component
│       ├── Hello.jsx      # Button to insert data
│       └── Info.jsx       # Change events display
├── mongo-replica/         # MongoDB replica set data
└── package.json
```

## 🔧 Setup and Execution

### Prerequisites

- Meteor.js
- MongoDB (configured as replica set for change streams)

### Running the Project

1. **Start the MongoDB replica set:**
   ```bash
   ./start-meteor-mongo-replica.sh
   ```

2. **Run the Meteor application:**
   ```bash
   meteor run
   ```

3. **Test the functionality:**
   - Click the "Click Me" button to insert new links
   - Watch the change events appear in real-time in the "Change Stream Events" section

4. **To stop MongoDB:**
   ```bash
   ./stop-meteor-mongo-replica.sh
   ```

## 🎯 Use Cases

Change Streams are ideal for:

- **Real-time notifications** - Notify users about relevant changes
- **Audit and logging** - Track all operations on specific collections
- **Synchronization** - Keep external systems synchronized
- **Analytics** - Process data events in real-time
- **Cache invalidation** - Invalidate caches when data changes

## 📚 Additional Resources

- [Feature discussion on Meteor Forums](https://forums.meteor.com/t/mongodb-change-streams-support-in-meteor-feedback-wanted)
- [MongoDB Change Streams Documentation](https://docs.mongodb.com/manual/changeStreams/)
- [Meteor Pub/Sub Guide](https://docs.meteor.com/api/pubsub.html)
- [Jam Pub/Sub Package](https://github.com/jamauro/pub-sub/tree/main#change-streams-based-publish--subscribe)
