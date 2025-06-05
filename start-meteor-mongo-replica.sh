#!/bin/zsh

# Path to Meteor's mongod binary
MONGOD_BIN="$HOME/.meteor/packages/meteor-tool/.3.3.0-rc.0.98m07w5jwdt++os.osx.arm64+web.browser+web.browser.legacy+web.cordova/mt-os.osx.arm64/dev_bundle/mongodb/bin/mongod"

# Base directory for data
DATA_DIR="./mongo-replica"

# Ports for nodes

# Ports for nodes (zsh arrays start at 1)
PORTS=(27017 27018 27019)

# Replica set name
REPLSET_NAME="rs0"

# Create data directories
for i in 1 2 3; do
  mkdir -p "$DATA_DIR/node$((i-1))"
done

# Start mongod for each node
for i in 1 2 3; do
  port=${PORTS[$i]}
  $MONGOD_BIN --replSet $REPLSET_NAME --port $port --dbpath "$DATA_DIR/node$((i-1))" --bind_ip localhost --fork --logpath "$DATA_DIR/node$((i-1))/mongod.log"
done

# Wait a few seconds for mongods to start up
sleep 5

# Configure replica set using mongosh (must be installed globally)
cat <<EOF | npx --yes mongosh --port 27017
rs.initiate({
  _id: "$REPLSET_NAME",
  members: [
    { _id: 0, host: "localhost:27017" },
    { _id: 1, host: "localhost:27018" },
    { _id: 2, host: "localhost:27019" }
  ]
})
EOF

echo "Replica set started. Use 'mongosh --port 27017' to connect."
