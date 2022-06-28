with import <unstable> {};
pkgs.mkShell {
  buildInputs = [
    bashInteractive
    nodejs-18_x
    nodePackages.javascript-typescript-langserver
    nodePackages.prettier
    yarn
    jre
    coreutils
  ];
}
