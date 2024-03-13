import {Stack} from "@mui/material";
import {Header} from "../../components/Header.tsx";
import {useState} from "react";
import {Dayjs} from "dayjs";

interface assignment {
    title: string,
    description: string,
    dueDate: Dayjs,
    restrictions: restriction[],
    groups: boolean,
    visible: boolean,
}

interface restriction {
    type: string,
    value: string,
    artifact: string,
}

export function AddChangeAssignmentPage() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState<Dayjs>();
    const [restrictions, setRestrictions] = useState<restriction[]>([]);
    const [groups, setGroups] = useState(false);
    const [visible, setVisible] = useState(false);

    //upload the details of the assignment trough a text file
    
    const uploadDescription = (event: React.ChangeEvent<HTMLInputElement>) => {


        setDescription(event.target.value);
    }

    return (
        <>
            <Stack direction={"column"}>
                <Header variant={"default"} title={title}/>

            </Stack>
        </>
    );
}