with import <nixpkgs> {};
pkgs.mkShell {
  buildInputs = [
    bashInteractive
    nodejs-10_x
    nodePackages.javascript-typescript-langserver
    nodePackages.prettier
  ];
}
