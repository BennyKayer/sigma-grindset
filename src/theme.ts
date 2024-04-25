"use client";
import { GFS_Neohellenic } from "next/font/google";
import { createTheme } from "@mui/material/styles";

const neoHellenic = GFS_Neohellenic({
    weight: ["400", "700"],
    subsets: ["greek"],
    display: "swap",
});

const theme = createTheme({
    palette: {
        mode: "dark",
    },
    typography: {
        fontFamily: neoHellenic.style.fontFamily,
    },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 900,
            lg: 1200,
            xl: 1536,
        },
    },
    components: {
        MuiAlert: {
            styleOverrides: {
                root: ({ ownerState }) => ({
                    ...(ownerState.severity === "info" && {
                        backgroundColor: "#60a5fa",
                    }),
                }),
            },
        },
    },
});

export default theme;
