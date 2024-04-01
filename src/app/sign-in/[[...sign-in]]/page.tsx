import { SignIn } from "@clerk/nextjs";
import { Box, Container } from "@mui/material";

export default function SignInPage() {
    return (
        <Container
            maxWidth="lg"
            sx={{
                width: "100vw",
                height: "100vh",
            }}
        >
            <Box
                component={"main"}
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    height: "100%",
                }}
            >
                <SignIn />
            </Box>
        </Container>
    );
}
