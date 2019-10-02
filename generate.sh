#!/usr/bin/env bash
npx openapi-generator generate -i ../../server/rs-api/openapi.yaml -g typescript-rxjs -c generate.yaml -o ./local_modules/astroplant-api/
