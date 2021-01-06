#!/bin/bash

RBPORTAL_PS=redbox-portal_redboxportal_1

docker exec -u "node" $RBPORTAL_PS /bin/bash -c "cd /opt/redbox-portal/; npm i; node_modules/.bin/grunt" || exit
