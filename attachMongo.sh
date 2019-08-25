#! /bin/sh
#Attach a shell to redbox-portal_mongodb_1
RBP_PS=$(docker ps -f name=redbox-portal_mongodb_1 -q)
docker exec -it $RBP_PS sh -c 'cd /; exec "${SHELL:-sh}"'
