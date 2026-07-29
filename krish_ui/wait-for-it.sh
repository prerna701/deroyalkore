#!/usr/bin/env bash
# Simple wait-for-it script
hostport=$1
shift

host=$(echo $hostport | cut -d : -f 1)
port=$(echo $hostport | cut -d : -f 2)

echo "Waiting for $host:$port..."

while ! nc -z $host $port; do
  sleep 1
done

echo "$host:$port is available!"

if [ $# -gt 0 ]; then
  exec "$@"
fi
