import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { Box, Divider } from "@mui/material";

const MOCK = [
    {
        id: 1,
        title: "10:22 03.04.2024",
        content: "Working on Notes carousel",
    },
    {
        id: 2,
        title: "9:30 03.04.2024",
        content: "Working on New Note editor",
    },
    {
        id: 3,
        title: "15:23, 02.04.2024",
        content: "Working on project's list",
    },
    // {
    //     id: 4,
    //     title: "12:22, 02.04.2024",
    //     content: "Fixing the 401 issue",
    // },
    // {
    //     id: 5,
    //     title: "10:22, 02.04.2024",
    //     content: "Basics of projects list",
    // },
];

export default function NotesCarousel() {
    return (
        <Box
            sx={{
                width: "100%",
                height: "100%",
                display: "grid",
                gridTemplateColumns: "min-content 1fr min-content",
                alignItems: "center",
                justifyItems: "center",
                p: 1,
            }}
        >
            <ArrowLeftIcon />
            <Box
                sx={{
                    display: "flex",
                    gap: 2,
                }}
            >
                {MOCK.map((el) => (
                    <Box
                        key={el.id}
                        sx={{
                            backgroundColor: "background.paper",
                            width: "200px",
                            height: "200px",
                        }}
                    >
                        {el.title}
                        <Divider />
                        {el.content}
                    </Box>
                ))}
            </Box>
            <ArrowRightIcon />
        </Box>
    );
}
