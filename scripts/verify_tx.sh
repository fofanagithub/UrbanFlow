#!/usr/bin/env bash
# Ouvre l’explorer pour un txId (manuel)
xdg-open "https://hashscan.io/${HEDERA_NETWORK:-testnet}/transaction/$1" 2>/dev/null || echo "Open: https://hashscan.io/${HEDERA_NETWORK:-testnet}/transaction/$1"