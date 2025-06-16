#!/bin/zsh

REPLSET_NAME="${1:-rs0}"

echo "Stopping mongod processes with replSet $REPLSET_NAME"
pkill -f "mongod.*--replSet $REPLSET_NAME"

sleep 2
ps aux | grep mongod | grep -- --replSet || echo "All mongod from replica set '$REPLSET_NAME' have been terminated."