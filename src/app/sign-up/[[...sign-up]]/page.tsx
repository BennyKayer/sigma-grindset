import { SignUp } from "@clerk/nextjs";
import { Container, Box } from "@mui/material";

export default function SignUpPage() {
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
                <SignUp />
            </Box>
        </Container>
    );
}
