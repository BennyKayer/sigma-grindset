import Link from "next/link";
import { LINKS } from "@/features/menu";
import {
    Link as MuiLink,
    Toolbar,
    Box,
    Divider,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
} from "@mui/material";
import Copyright from "./Copyright";

type DrawerLinksProps = {
    pathname: string;
};
export default function DrawerLinks({ pathname }: DrawerLinksProps) {
    return (
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <Box>
                <Toolbar
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <MuiLink
                        href={"/"}
                        component={Link}
                        sx={{
                            textDecoration: "none",
                        }}
                    >
                        <Typography
                            sx={{
                                fontWeight: 700,
                                color: "text.secondary",
                            }}
                            variant="h3"
                        >
                            &Sigma;G
                        </Typography>
                    </MuiLink>
                </Toolbar>
                <Divider />
                <List>
                    {LINKS.map((link) => {
                        const { href, id, label } = link;
                        return (
                            <MuiLink
                                sx={{
                                    textDecoration: "none",
                                }}
                                key={id}
                                href={href}
                                component={Link}
                            >
                                <ListItem disablePadding>
                                    <ListItemButton
                                        selected={href === pathname}
                                    >
                                        <ListItemIcon>
                                            <link.icon />
                                        </ListItemIcon>
                                        <ListItemText primary={label} />
                                    </ListItemButton>
                                </ListItem>
                            </MuiLink>
                        );
                    })}
                </List>
            </Box>
            <Copyright
                sx={{
                    mt: "auto",
                    p: 0.5,
                }}
            />
        </Box>
    );
}
