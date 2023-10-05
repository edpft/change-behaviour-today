{
  description = "A very basic node.js flake";

  inputs = {
    nixpkgs.url = "nixpkgs/nixos-unstable";
  };

  outputs = { self, nixpkgs, ... }:
    let
      system = "x86_64-linux";

      pkgs = import nixpkgs {
        inherit system;
        config = {
          allowUnfree = true;
        };
      };
    in
    with pkgs;
    {
      formatter.${system} = nixpkgs-fmt;

      devShell.${system} = mkShell {
        buildInputs = [ nodejs_18 ];
      };
    };
}
