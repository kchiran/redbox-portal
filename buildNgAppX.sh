#!/bin/bash

RBPORTAL_PS=redbox-portal_redboxportal_1
ng2App=$1

docker exec -u "node" $RBPORTAL_PS /bin/bash -c "cd /opt/redbox-portal/angular; npm i; node_modules/.bin/ng build --app=${ng2App}  --verbose " || exit
