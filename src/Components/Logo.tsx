import React from "react";

export type Props = {
  size?: number;
  variant: "green" | "white" | "black";
};

export const Logo = ({ size = 48, variant }: Props) => (
  <img
    alt="AstroPlant"
    style={{ height: size, width: "auto" }}
    src={`/logo-${variant}.svg`}
  />
);
