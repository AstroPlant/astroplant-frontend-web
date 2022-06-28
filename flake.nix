{
  description = "The AstroPlant web front-end";
  inputs.flake-utils.url = "github:numtide/flake-utils";
  inputs.flake-compat = {
    url = "github:edolstra/flake-compat";
    flake = false;
  };
  outputs = { self, nixpkgs, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        packages.astroplant-frontend = self.packageExprs.${system}.astroplant-frontend {
          apiUrl = "http://localhost:8080";
          websocketUrl = "ws://localhost:8080/ws";
        };

        packageExprs.astroplant-frontend = { apiUrl, websocketUrl }: pkgs.stdenv.mkDerivation rec {
          pname = "astroplant-frontend";
          version = "0.1.0-alpha.1";
          src = ./.;

          astroplant-api = pkgs.yarn2nix-moretea.mkYarnPackage {
            src = ./astroplant-api;
            yarnLock = ./yarn.lock;
            buildPhase = ''
              runHook preBuild
              yarn build
              runHook postBuild
            '';
          };

          # Is there a better way to include local workspace astroplant-api?
          nodeModules = pkgs.yarn2nix-moretea.mkYarnModules {
            name = "astroplant-frontend-node-modules-${version}";
            inherit pname version;
            packageJSON = ./astroplant-frontend/package.json;
            yarnLock = ./yarn.lock;
            workspaceDependencies = [ astroplant-api ];
          };

          nativeBuildInputs = with pkgs; [ yarn ];

          configurePhase = ''
            export REACT_APP_API_URL=${apiUrl}
            export REACT_APP_WEBSOCKET_URL=${websocketUrl}
          '';

          buildPhase = ''
            runHook preBuild

            mkdir ./node_modules

            # Symlink all files in node_modules, including hidden files
            shopt -s dotglob 
            for dep in ${nodeModules}/node_modules/*; do
              ln -s "$dep" ./node_modules/
            done
            shopt -u dotglob

            # Add astroplant-api dependency we built previously
            rm ./node_modules/astroplant-frontend
            rm ./node_modules/astroplant-api
            ln -s ${astroplant-api}/libexec/astroplant-api/deps/astroplant-api ./node_modules/astroplant-api

            yarn workspace astroplant-frontend build

            runHook postBuild
          '';

          installPhase = ''
            runHook preInstall
            mv astroplant-frontend/build $out
            runHook postInstall
          '';

          doDist = false;
        };
        defaultPackage = self.packages.${system}.astroplant-frontend-web;
        devShell = pkgs.mkShell {
          buildInputs = with pkgs; [
            bashInteractive
            nodejs-18_x
            nodePackages.javascript-typescript-langserver
            nodePackages.prettier
            jre
            coreutils
          ];
        };
      });
}
