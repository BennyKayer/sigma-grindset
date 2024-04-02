import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import NextLink from "next/link";
import { LINKS } from "@/features/menu";

export default function Home() {
    return (
        <Container maxWidth="lg">
            <Box
                sx={{
                    my: 4,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
                    &Sigma; Grindset
                </Typography>
                <Typography variant="h5" component={"h2"} sx={{ mb: 2 }}>
                    Grind your way to greatness
                </Typography>
                {LINKS.map((el) => (
                    <Link href={el.href} color="secondary" component={NextLink}>
                        {el.label}
                    </Link>
                ))}
            </Box>
        </Container>
    );
}
