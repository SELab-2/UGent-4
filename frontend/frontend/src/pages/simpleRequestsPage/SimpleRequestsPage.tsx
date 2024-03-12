import {Button, Stack, TextField, Typography} from "@mui/material";
import {FormEvent, useState} from "react";
import axios from "axios";

export function SimpleRequestsPage() {
    const [url, setUrl] = useState("");
    const [query, setQuery] = useState("");
    const [response, setResponse] = useState("");

    const handleRequest = (e: FormEvent) => {
        e.preventDefault();
        console.log("Requesting...");
        const params = JSON.parse(query);
        axios.get(url, {params: params}).then((response) => {
                setResponse(response.data);
            }
        ).catch((error) => {
            setResponse(error.message);
        });

    }

    return (
        <>
            <Stack direction={"column"} gap={2}
                   component={"form"} noValidate
                   onSubmit={handleRequest}
            >
                <TextField variant={"outlined"} label="url"
                           fullWidth required error={url === ""}
                           onChange={(e) => setUrl(e.target.value)}
                />
                <TextField variant={"outlined"} label="query" multiline
                           fullWidth required error={query === ""}
                           onChange={(e) => setQuery(e.target.value)}
                />
                <Button variant={"contained"} type={"submit"} disabled={(url === "") || (query === "")}>Submit</Button>
            </Stack>
            <Typography>{response}</Typography>
        </>
    );
}