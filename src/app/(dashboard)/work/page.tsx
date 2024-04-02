import { Box } from "@mui/material";
import { ProjectList } from "@/features/work";

export default function WorkPage() {
    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: "1fr 2fr",
                gridTemplateRows: "1fr 1fr",
            }}
        >
            <ProjectList />
        </Box>
    );
}
