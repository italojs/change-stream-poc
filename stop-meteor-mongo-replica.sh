#!/bin/zsh

# Script to stop all mongod from local replica set
# Kills all mongod processes started with --replSet rs0

REPLSET_NAME="rs0"

# Terminates all mongod from replica set
pkill -f "mongod.*--replSet $REPLSET_NAME"

# Optional: wait a bit and show if any process remains
sleep 2
ps aux | grep mongod | grep -- --replSet || echo "All mongod from replica set $REPLSET_NAME have been terminated."
