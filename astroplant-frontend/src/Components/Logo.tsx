import React, { FC } from "react"

export const Logo: FC<{
    size?: number;
    variant: "green" | "white" | "black";
}> = ({ size = 48, variant }) => {
    return (
        <img style={{ height: size, width: "auto" }} src={`/logo-${variant}.svg`} />
    )
}