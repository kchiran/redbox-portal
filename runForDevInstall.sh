#!/bin/bash
# Uncomment below if you need to see the minified version....
# export buildTarget="PROD"
PORTAL_DIR=/opt/redbox-portal
PORTAL_IMAGE=qcifengineering/redbox-portal:travis-2398
source dev_build/buildFns.sh

docker run -it --rm -v $PWD:$PORTAL_DIR $PORTAL_IMAGE /bin/bash -c "cd $PORTAL_DIR; npm install --unsafe-perm -g yarn; yarn add sails-hook-autoreload && yarn global add typings && yarn install"