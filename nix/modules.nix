{ mkYarnPackage
, mkYarnModules
, version
}:
let
  astroplant-api = mkYarnPackage {
    src = ../astroplant-api;
    yarnLock = ../yarn.lock;
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
