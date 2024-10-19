import { FC } from "react";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Checkbox,
    FormControlLabel,
    FormGroup,
    FormGroupProps,
    Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { httpGetUserElasticHabits } from "@/services/elasticHabits";
import { ExpandMoreOutlined } from "@mui/icons-material";

type ElasticHabitsProps = {};
export const ElasticHabits: FC<ElasticHabitsProps> = () => {
    const { data: elasticHabits } = useQuery({
        queryKey: ["elasticHabits"],
        queryFn: httpGetUserElasticHabits,
    });

    const handleLevelsUpdate: FormGroupProps["onChange"] = (event) => {
        // TODO: API Call
        console.log(event);
    };

    return (
        <Box data-testid="elasticHabits">
            {elasticHabits?.map((elasticHabit, i) => {
                return (
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreOutlined />}
                            aria-controls={`elasticHabitHeader-${i}`}
                        >
                            {elasticHabit.name}
                        </AccordionSummary>
                        <AccordionDetails>
                            <FormGroup onChange={handleLevelsUpdate}>
                                {elasticHabit.levels.map((level) => {
                                    return (
                                        <Box>
                                            <FormControlLabel
                                                control={<Checkbox />}
                                                label={`${level}`}
                                            />
                                        </Box>
                                    );
                                })}
                            </FormGroup>
                        </AccordionDetails>
                    </Accordion>
                );
            })}
        </Box>
    );
};
