# Youtube video finder

## How to run

Execute the following commands:

```bash
docker pull getmeili/meilisearch:v1.4
```

Followed by

```bash
docker run -p 7700:7700 --name meilisearch_container -v meili_data getmeili/meilisearch:v1.4
```

If you have already created a container with the previous command then run with:

```bash
docker container start meilisearch_container
```

then

```bash
curl \
  -X POST 'http://localhost:7700/indexes/transcripts/documents?primaryKey=id' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer aSampleMasterKey' \
  --data-binary @transcripts.json
```

then

```bash

```
