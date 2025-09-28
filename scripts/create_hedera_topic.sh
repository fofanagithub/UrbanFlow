#!/usr/bin/env bash
set -e
pushd orchestrator >/dev/null
npm i --silent || true
HEDERA_NETWORK=${HEDERA_NETWORK:-testnet} \
HEDERA_OPERATOR_ID=${HEDERA_OPERATOR_ID} \
HEDERA_OPERATOR_KEY=${HEDERA_OPERATOR_KEY} \
node src/create_topic.js
popd >/dev/null 
