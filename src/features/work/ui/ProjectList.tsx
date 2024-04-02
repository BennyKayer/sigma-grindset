import {
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Radio,
    RadioGroup,
} from "@mui/material";
import { getProjects } from "@/services/projects";
import { useState } from "react";

export default async function ProjectList() {
    // TODO: Fix 401
    // const projects = await getProjects();

    // const [checked, setChecked] = useState([1]);

    // const handleToggle = (value: number) => () => {
    //     const currentIndex = checked.indexOf(value);
    //     const newChecked = [...checked];

    //     if (currentIndex === -1) {
    //         newChecked.push(value);
    //     } else {
    //         newChecked.splice(currentIndex, 1);
    //     }

    //     setChecked(newChecked);
    // };

    return (
        <List
            dense
            sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
        >
            <RadioGroup>
                {[{ id: "xd" }, { id: "jp" }].map((el) => {
                    const { id } = el;
                    const labelId = `checkbox-list-secondary-label-${id}`;
                    return (
                        <ListItem
                            key={id}
                            secondaryAction={
                                <Radio value={id} />
                                //   <Checkbox
                                //     edge="end"
                                //     onChange={handleToggle(el)}
                                //     checked={checked.indexOf(el) !== -1}
                                //     inputProps={{ 'aria-labelledby': labelId }}
                                //   />
                            }
                            disablePadding
                        >
                            <ListItemButton>
                                <ListItemText
                                    id={labelId}
                                    primary={`Line item ${id}`}
                                />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </RadioGroup>
        </List>
    );
}
