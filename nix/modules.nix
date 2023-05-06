{ mkYarnPackage
, mkYarnModules
, version
, apiUrl ? "http://localhost:8080"
}:
let
  astroplant-api = mkYarnPackage {
    src = ../astroplant-api;
    yarnLock = ../yarn.lock;
    preConfigure = ''
      export VITE_API_URL=${apiUrl}
    '';
    buildPhase = ''
      runHook preBuild
      yarn build
      runHook postBuild
    '';
  };
in
# Is there a better way to include local workspace astroplant-api?
(mkYarnModules {
  inherit version;
  pname = "astroplant-frontend";
  name = "astroplant-frontend-node-modules-${version}";
  packageJSON = ../astroplant-frontend/package.json;
  yarnLock = ../yarn.lock;
  workspaceDependencies = [ astroplant-api ];
}) // { inherit astroplant-api; }
