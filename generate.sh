#!/usr/bin/env sh
set -e

npx openapi-generator generate -i ../../server/rs-api/openapi.yaml -g typescript-rxjs -c generate.yaml -o ./local_modules/astroplant-api/

# Remove previously created types.d.ts if it exists.
types="./local_modules/astroplant-api/types.d.ts"
if [ -f $types ] ; then
    rm $types
fi

patch -p1 <<'EOF'
--- a/local_modules/astroplant-api/runtime.ts
+++ b/local_modules/astroplant-api/runtime.ts
@@ -15,7 +15,7 @@
 import { ajax, AjaxRequest, AjaxResponse } from 'rxjs/ajax';
 import { map, concatMap } from 'rxjs/operators';

-export const BASE_PATH = 'https://api.astroplant.sda-projects.nl'.replace(/\/+$/, '');
+export const BASE_PATH = process.env.REACT_APP_API_URL || "http://localhost:8080";

 export interface ConfigurationParameters {
     basePath?: string; // override base path

--- /dev/null
+++ b/local_modules/astroplant-api/types.d.ts
@@ -0,0 +1,3 @@
+declare namespace process {
+  const env: any;
+}
EOF
