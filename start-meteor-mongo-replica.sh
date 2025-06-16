#!/bin/zsh

REPLSET_NAME="${1:-rs0}"  # uses "rs0" by default if no argument is passed

MONGOD_BIN="$HOME/.meteor/packages/meteor-tool/.3.3.0-rc.0.98m07w5jwdt++os.osx.arm64+web.browser+web.browser.legacy+web.cordova/mt-os.osx.arm64/dev_bundle/mongodb/bin/mongod"
DATA_DIR="./mongo-replica"
PORTS=("unused" "27017" "27018" "27019")

for i in 1 2 3; do
  mkdir -p "$DATA_DIR/node$((i-1))"
done

for i in 1 2 3; do
  port=${PORTS[$i]}
  echo "Starting node $((i-1)) on port $port with replSet $REPLSET_NAME"
  $MONGOD_BIN --replSet "$REPLSET_NAME" --port "$port" --dbpath "$DATA_DIR/node$((i-1))" --bind_ip localhost --fork --logpath "$DATA_DIR/node$((i-1))/mongod.log"
done

sleep 5

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

echo "Replica set '$REPLSET_NAME' started. Use 'mongosh --port 27017' to connect."