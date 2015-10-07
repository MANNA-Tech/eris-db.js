#!/usr/bin/env bash

# These are for tests that use erisdbss (server-server) to create a
# new node with some given settings like priv-validator and genesis.json.
# Usually those settings are put in the javscript test files themselves.
if [[ -z $(command -v erisdbss) ]]; then
    echo "Cannot find erisdbss executable on path"
    exit 1
fi
if [[ -z $(command -v erisdb) ]]; then
    echo "Cannot find erisdb executable on path"
    exit 1
fi
if [[ -z $(command -v mocha) ]]; then
    echo "Cannot find mocha executable on path"
    exit 1
fi
# Check if already running
SSOLDPID=$(pidof erisdbss)
if [[ -z ${SSOLDPID} ]]; then
    (erisdbss) &> /dev/null & SSPID=$!
    # Give it some time (if needed).
    sleep 1
else
   echo "Using already running instance of erisdbss"
fi

eris init --yes

# eris-db.js doesn't work with eris-db 0.10.3.
sed --in-place 's/0.10.3/0.10.2/' /home/eris/.eris/blockchains/default.toml

eris chains new --genesis=blockchain/genesis.json --priv=blockchain/priv_validator.json --api --publish blockchain
eris chains start blockchain

echo "Type 'mocha' to run the tests."
/bin/bash
