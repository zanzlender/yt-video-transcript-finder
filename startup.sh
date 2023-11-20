#!/bin/bash

# This script is used to startup all services needed for this app to work

# Run Meilisearch Docker container
printf "Running Youtube video finder startup script ~\n\n"

printf ">>> Checking if docker daemon is running...\n\n"

# check if docker is running
if (! docker stats --no-stream &> /dev/null); then
    printf "Docker daemon is not running, please start the Docker daemon.\n\n"
# Wait until Docker daemon is running and has completed initialisation
while (! docker stats --no-stream &> /dev/null); do
    echo "Waiting for Docker to launch..."
    sleep 1 && echo "." && sleep 1 && echo "." && sleep 1 && echo "." && sleep 2
done
fi

# check if Meilisearch image exists if not pull it
if [[ "$(docker images -q getmeili/meilisearch:v1.4)" == "" ]]; then
  printf "\n\n>>> Image getmeili/meilisearch:v1.4 doesn't exist, pulling image...\n\n"
  docker pull getmeili/meilisearch:v1.4
fi

printf "\n\n>>> Starting docker container...\n\n"

# check if meilisearch container already exists, if yes start it
# else initialize it first
if [[ "$(docker ps --all -q --filter name=meilisearch_container)" != "" ]]; then
    docker container start meilisearch_container

    #printf "\n>>> Deleting existing Meilisearch container and volume...\n"
    #docker rm -v -f solr 
else
  docker run -p 7700:7700 --name meilisearch_container -v meili_data getmeili/meilisearch:v1.4
fi


until $(curl --output /dev/null --silent --head --fail 127.0.0.1:7770); do
    printf "\n>>> Waiting for Meilisearch to start...\n"
    curl 127.0.0.1:7770
    sleep 5
done

printf "\n\Meilisearch setup and data population completed.\n\n"
printf "Open http://localhost:7700/tasks in your browser.\n\n"
printf "This window will automatically close in 10 seconds.\n\n"

sleep 10