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
      overlay = self: super: {
        astroplant-frontend-modules = self.callPackage ./nix/modules.nix { inherit version; };
        astroplant-frontend = self.callPackage ./nix/build.nix { inherit version; };
      };
    in
    rec {
      overlays."astroplant-frontend" = overlay;
      overlays.default = overlays."astroplant-frontend";
    } //
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; overlays = [ overlay ]; };
      in
      {
        packageExprs.astroplant-frontend = { apiUrl, websocketUrl }:
          pkgs.astroplant-frontend.override { inherit apiUrl websocketUrl; };
        packages.astroplant-frontend = pkgs.astroplant-frontend;
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
