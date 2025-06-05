# MongoDB Change Streams - Proof of Concept

A **Meteor.js** application demonstrating real-time MongoDB Change Streams functionality with a React-based user interface. This project showcases how to monitor database changes in real-time and display them in a visually appealing, color-coded table.

## 🚀 Features

- **Real-time Change Stream Monitoring**: Watch MongoDB collection changes as they happen
- **Random Data Generator**: Automated tool to generate database operations for testing
- **MongoDB Replica Set Support**: Works with local replica sets or MongoDB Atlas

## 📋 Prerequisites

- **Node.js** 
- **Meteor.js** 

## 🛠️ Installation

1. **Clone the repository**:
   ```bash
   git clone ......
   cd change-streams-poc
   ```

2. **Install dependencies**:
   ```bash
   meteor npm install
   ```

3. **Set up MongoDB Replica Set** (if using local MongoDB):
   ```bash
   # Make scripts executable
   chmod +x start-meteor-mongo-replica.sh
   chmod +x stop-meteor-mongo-replica.sh
   
   # Start the replica set
   ./start-meteor-mongo-replica.sh
   ```

## 🚀 Running the Application

### Local Development

1. **Start the Meteor application**:
   ```bash
    meteor run
   ```

2. **Access the application**:
   - Open your browser to `http://localhost:3000`


## 🔧 Configuration

### MongoDB Connection

The application automatically connects to:
- **Local replica set**: `mongodb://localhost:27017,localhost:27018,localhost:27019/?replicaSet=rs0` (default)
- **Custom URL**: Set via `MONGO_URL` environment variable

### Replica Set Ports

The local replica set uses these ports:
- **Primary**: 27017
- **Secondary 1**: 27018  
- **Secondary 2**: 27019

## 📖 Usage

### 1. Random Changes Control

- **Interval Configuration**: Set the time interval (in milliseconds) between automatic operations
- **Start/Stop Controls**: Begin or halt the random data generation
- **Real-time Status**: Visual indicators show the current state (Running/Stopped/Loading)

### 2. Manual Operations

The application also provides buttons for manual database operations:
- Insert new documents
- Update existing documents  
- Remove documents
- Upsert operations

## 🏗️ Architecture

### Frontend (React)
- **App.jsx**: Main application component
- **ChangeStreamTable.jsx**: Real-time change stream display with color coding
- **ChangeStreamRandomizerControl.jsx**: Controls for automated testing
- **Info.jsx**: Application information display
- **Hello.jsx**: Manual operation controls

### Backend (Meteor)
- **server/main.js**: 
  - MongoDB Change Stream setup
  - Meteor methods for CRUD operations
  - Random data generation logic
  - DDP message broadcasting

### Database
- **LinksCollection**: Main collection for demonstrating change streams
- **Change Stream Events**: Real-time monitoring of all collection operations

## 🎯 Change Stream Events

The application monitors these MongoDB change stream event types:

- **insert**: New document creation
- **update**: Document modifications
- **delete**: Document removal
- **replace**: Document replacement
- **drop**: Collection dropping
- **invalidate**: Stream invalidation

## 📁 Project Structure

```
change-streams-poc/
├── client/
│   ├── main.jsx          # Client entry point
│   ├── main.html         # HTML template
│   └── main.css          # Global styles
├── imports/
│   ├── api/
│   │   ├── links.js      # Links collection definition
│   │   └── changeStreams.js # Change streams collection
│   └── ui/
│       ├── App.jsx       # Main app component
│       ├── ChangeStreamTable.jsx # Change stream display
│       ├── ChangeStreamRandomizerControl.jsx # Test controls
│       ├── Hello.jsx     # Manual operations
│       └── Info.jsx      # App information
├── server/
│   └── main.js           # Server logic and change streams
├── mongo-replica/        # Local MongoDB data (generated)
├── start-meteor-mongo-replica.sh # Replica set startup script
├── stop-meteor-mongo-replica.sh  # Replica set shutdown script
├── package.json          # Dependencies and scripts
└── README.md            # This file
```

## 🐛 Troubleshooting

### Change Streams Not Working

1. **Verify Replica Set**: Change streams require a replica set or MongoDB Atlas
2. **Check Connection**: Ensure MongoDB is running and accessible
3. **Verify Permissions**: Make sure the database user has appropriate permissions

### Replica Set Issues

1. **Port Conflicts**: Ensure ports 27017-27019 are available
2. **MongoDB Binary**: Verify the Meteor MongoDB binary path in the startup script
3. **Initialization**: Wait for replica set initialization to complete

### Application Issues

1. **Clear Cache**: Try `meteor reset` to clear local cache
2. **Dependencies**: Run `meteor npm install` to ensure all packages are installed
3. **Browser Console**: Check for JavaScript errors in developer tools

## 📄 License

This project is for educational purposes and demonstration of MongoDB Change Streams with Meteor.js.

