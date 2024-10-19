"use client";

import { PropsWithChildren, useState } from "react";
import { UserButton } from "@clerk/nextjs";
import {
    AppBar,
    Box,
    Drawer,
    IconButton,
    Toolbar,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { DrawerLinks, LINKS } from "@/features/menu";
import { usePathname } from "next/navigation";
import { WorkProvider } from "@/features/work";
import { ReactQueryProvider } from "@/features/shared/ui/ReactQueryProvider";

const drawerWidth = 140;

type DashBoardLayoutProps = PropsWithChildren<{}>;
export default function DashBoardLayout({ children }: DashBoardLayoutProps) {
    const { breakpoints } = useTheme();
    const matches = useMediaQuery(breakpoints.up("sm"));
    const pathname = usePathname();

    const [mobileOpen, setMobileOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    // SEC: handlers
    const handleDrawerClose = () => {
        setIsClosing(true);
        setMobileOpen(false);
    };

    const handleDrawerTransitionEnd = () => {
        setIsClosing(false);
    };

    const handleDrawerToggle = () => {
        if (!isClosing) {
            setMobileOpen(!mobileOpen);
        }
    };

    return (
        <Box sx={{ display: "flex" }}>
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: "none" } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Box
                        sx={{
                            display: "flex",
                            width: "100%",
                            justifyContent: "space-between",
                        }}
                    >
                        <Typography variant="h4">
                            {LINKS.find((el) => el.href === pathname)?.label}
                        </Typography>
                        <UserButton />
                    </Box>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="menu links"
            >
                {matches ? (
                    <Drawer
                        variant="permanent"
                        sx={{
                            "& .MuiDrawer-paper": {
                                boxSizing: "border-box",
                                width: drawerWidth,
                            },
                        }}
                        open
                    >
                        <DrawerLinks pathname={pathname} />
                    </Drawer>
                ) : (
                    <Drawer
                        variant="temporary"
                        open={mobileOpen}
                        onTransitionEnd={handleDrawerTransitionEnd}
                        onClose={handleDrawerClose}
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}
                        sx={{
                            "& .MuiDrawer-paper": {
                                boxSizing: "border-box",
                                width: drawerWidth,
                            },
                        }}
                    >
                        <DrawerLinks pathname={pathname} />
                    </Drawer>
                )}
            </Box>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                }}
            >
                <Toolbar />
                <ReactQueryProvider>
                    <WorkProvider>{children}</WorkProvider>
                </ReactQueryProvider>
            </Box>
        </Box>
    );
}
