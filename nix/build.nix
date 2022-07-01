{ pkgs
, stdenv
, yarn
, version
, apiUrl ? "http://localhost:8080"
, websocketUrl ? "ws://localhost:8080/ws"
, removeReferencesTo
}:
# Could this work with splicing, so we don't need to take from pkgsBuildBuild?
# If we put `astroplant-frontend-modules` in depsBuildBuild, but refer to the
# variable later, it's pulled in without offsetting.
let
  astroplant-frontend-modules = pkgs.pkgsBuildBuild.astroplant-frontend-modules;
in
stdenv.mkDerivation rec {
  inherit version;
  pname = "astroplant-frontend";
  src = builtins.filterSource
    (path: type: !(type == "directory" && baseNameOf path == "node_modules"))
    ./..;

  # The output is a static site; the compile target does not matter.
  # Hence, this is depsBuildBuild and not nativeBuildInputs.
  depsBuildBuild = [
    yarn
    removeReferencesTo
    # astroplant-frontend-modules
  ];

  configurePhase = ''
    export REACT_APP_API_URL=${apiUrl}
    export REACT_APP_WEBSOCKET_URL=${websocketUrl}
  '';

  buildPhase = ''
    runHook preBuild

    mkdir ./node_modules

    # Symlink all files in node_modules, including hidden files
    shopt -s dotglob 
    for dep in ${astroplant-frontend-modules}/node_modules/*; do
      ln -s "$dep" ./node_modules/
    done
    shopt -u dotglob

    # Add astroplant-api dependency we built previously
    rm ./node_modules/astroplant-frontend
    rm ./node_modules/astroplant-api
    ln -s ${astroplant-frontend-modules.astroplant-api}/libexec/astroplant-api/deps/astroplant-api ./node_modules/astroplant-api

    yarn workspace astroplant-frontend build

    runHook postBuild
  '';

  installPhase = ''
    runHook preInstall
    mv astroplant-frontend/build $out
    runHook postInstall
  '';

  # The source map files contain references to the nix store, causing
  # the closure to contain runtime dependencies we don't care about.
  postInstall = ''
    find "$out" -name "*.map" -type f -exec remove-references-to \
      -t ${astroplant-frontend-modules} \
      -t ${astroplant-frontend-modules.astroplant-api} '{}' +
  '';

  # Shouldn't have any runtime dependencies at all.
  allowedReferences = [ ];
  doDist = false;
  doCheck = false;
}
