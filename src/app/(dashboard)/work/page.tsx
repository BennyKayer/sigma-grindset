import { Box } from "@mui/material";
import { NewNote, NotesCarousel, ProjectList } from "@/features/work";

export default function WorkPage() {
    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: "1fr 2fr",
                gridTemplateRows: "repeat(2, 43vh)",
                gap: 2,
            }}
        >
            <ProjectList
                sx={{
                    gridRow: "1 / span 2",
                }}
            />
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 2fr",
                    gap: 1,
                }}
            >
                <NewNote />
                <NotesCarousel />
            </Box>
        </Box>
    );
}
