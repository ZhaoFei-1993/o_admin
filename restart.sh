#!/usr/bin/env bash
pm2 kill && pm2 startOrRestart ecosystem.json --update-env --env production
