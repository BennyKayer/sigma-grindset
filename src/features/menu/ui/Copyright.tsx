import * as React from "react";
import Typography from "@mui/material/Typography";
import MuiLink from "@mui/material/Link";
import { Box, BoxProps } from "@mui/material";

export default function Copyright(props: BoxProps) {
    return (
        <Box {...props}>
            <Typography variant="body2" color="text.secondary" align="center">
                {"Copyright © "}
                <MuiLink color="inherit" href="#">
                    &Sigma;G
                </MuiLink>{" "}
                {new Date().getFullYear()}.
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
                <MuiLink
                    color={"inherit"}
                    href="https://www.flaticon.com/free-icons/shapes-and-symbols"
                    title="shapes and symbols icons"
                >
                    Icons created by ArtBit
                </MuiLink>
            </Typography>
        </Box>
    );
}
