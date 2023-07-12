{ mkYarnPackage
, mkYarnModules
, version
}:
(mkYarnModules {
  inherit version;
  pname = "astroplant-frontend";
  name = "astroplant-frontend-node-modules-${version}";
  packageJSON = ../astroplant-frontend/package.json;
  yarnLock = ../yarn.lock;
  workspaceDependencies = [ ];
})
