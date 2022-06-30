{
  description = "The AstroPlant web front-end";
  inputs.flake-utils.url = "github:numtide/flake-utils";
  inputs.flake-compat = {
    url = "github:edolstra/flake-compat";
    flake = false;
  };
  outputs = { self, nixpkgs, flake-utils, ... }:
    let
      version = "0.1.0-alpha.1";
    in
    {
      overlays.default = final: prev: {
        astroplant-frontend-modules = final.callPackage ./nix/modules.nix { inherit version; };
        astroplant-frontend = final.callPackage ./nix/build.nix { inherit version; };
      };
    } //
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          inherit system;
          overlays = [ self.overlays.default ];
        };
      in
      {
        packageExprs.astroplant-frontend = { apiUrl, websocketUrl }:
          pkgs.astroplant-frontend.override { inherit apiUrl websocketUrl; };
        packages.astroplant-frontend = pkgs.astroplant-frontend;
        defaultPackage = self.packages.${system}.astroplant-frontend;
        devShells.default = pkgs.mkShell {
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
