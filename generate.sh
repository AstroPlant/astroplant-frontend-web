#!/usr/bin/env bash
npx openapi-generator generate -i ../../server/rs-api/openapi.yaml -g typescript-axios -o ./tmp/
