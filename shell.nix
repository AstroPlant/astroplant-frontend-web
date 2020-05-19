with import <unstable> {};
pkgs.mkShell {
  buildInputs = [
    bashInteractive
    nodejs-13_x
    nodePackages.javascript-typescript-langserver
    nodePackages.prettier
    jre
    coreutils
  ];
}
