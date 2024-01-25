{ pkgs
, stdenv
, version
, apiUrl ? "http://localhost:8080"
, websocketUrl ? "ws://localhost:8080/ws"
, buildString ? "Unknown"
, yarn
, nodejs-18_x
, fetchYarnDeps
# this can become fixup-yarn-lock once https://github.com/NixOS/nixpkgs/pull/281902 is merged
, prefetch-yarn-deps
}:
stdenv.mkDerivation rec {
  inherit version;
  pname = "astroplant-frontend";

  src = ./..;

  packageJSON = ../package.json;

  offlineCache = fetchYarnDeps {
    name = "bla";
    yarnLock = "${src}/yarn.lock";
    hash = "sha256-pK+VfSTyt0ZNWvYIFsCqCZjRyfkV3aA+IwevT84dLsc=";
  };

  nativeBuildInputs = [ yarn nodejs-18_x prefetch-yarn-deps ];

  configurePhase = ''
    # FIXME: this isn't a long-term solution. With an upgrade of react-scripts
    # to 5.x it shouldn't be necessary anymore.
    export NODE_OPTIONS=--openssl-legacy-provider
    
    export VITE_API_URL=${apiUrl}
    export VITE_WEBSOCKET_URL=${websocketUrl}
    export VITE_BUILD_STRING=${buildString}
  '';

  buildPhase = ''
    export HOME=$(mktemp -d)

    fixup-yarn-lock yarn.lock
    yarn config --offline set yarn-offline-mirror $offlineCache
    yarn install --offline --frozen-lockfile --ignore-engines --ignore-scripts --no-progress

    patchShebangs node_modules

    yarn --offline build
  '';

  installPhase = ''
    runHook preInstall
    mv build $out
    runHook postInstall
  '';

  # Shouldn't have any runtime dependencies at all.
  allowedReferences = [ ];
  doDist = false;
  doCheck = false;
}
