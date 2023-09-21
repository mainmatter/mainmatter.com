#!/bin/sh

chmod +x twios/this-week-in-open-source

$(pwd)/twios/this-week-in-open-source --config-path=$(pwd)/config/this-week-in-open-source.config.json
