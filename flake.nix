{
  description = "A very basic node.js flake";

  inputs = {
    nixpkgs.url = "nixpkgs/nixos-unstable";
  };

  outputs = {
    self,
    nixpkgs,
    ...
  }: let
    system = "x86_64-linux";

    pkgs = import nixpkgs {
      inherit system;
      config = {
        allowUnfree = true;
      };
    };
  in
    {
      devShell.${system} = pkgs.mkShell {
        buildInputs = [
          pkgs.nodejs_22
        ];
      };
    };
}
