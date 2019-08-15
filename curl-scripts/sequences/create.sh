#!/bin/bash

API="http://localhost:4741"
URL_PATH="/sequences"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --data '{
    "sequence": {
      "sequenceDescription": "'"${DESC}"'",
      "sequenceName": "'"${NAME}"'",
      "sequence": "'"${SEQUENCE}"'"
    }
  }'

echo
