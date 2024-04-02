import { Box } from "@mui/material";
import { ProjectList } from "@/features/work";

export default function WorkPage() {
    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: "1fr 2fr",
                gridTemplateRows: "calc(100vh - 48px - 64px)", // TODO: Change to 2 rows later
            }}
        >
            <ProjectList />
        </Box>
    );
}
