import React, { useState } from 'react';
import { Box, TextField, Checkbox, List, ListItem, ListItemText, IconButton, Button } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import CloseIcon from '@mui/icons-material/Close'

const saveBashRestrictionTemplate = (restrictionCode: string, params: { [key: string]: any }) => {
    // This function will save the restriction template with the given parameters.
    // It finds the #@param tags in the restriction code and replaces the values with the given parameters.
    // It does this with javascript regexp
    
    let newRestrictionCode = restrictionCode;
    Object.keys(params).forEach(key => {
        // match on the #@param tag and the variable name
        // between the #@param tag there can be any number of newline comments and whitespace
        // between the value and the variable name is an equals sign
        // There may be any number of spaces around the equals sign
        let valueString = params[key];

        // If the value is an array, we need to convert it to a string

        if (Array.isArray(valueString)) {
            valueString = '(' + valueString.join(' ') + ')';
        } else if (typeof valueString === 'string') {
            valueString = '"' + valueString + '"';
        } else if (typeof valueString === 'boolean') {
            valueString = valueString ? 'true' : 'false';
        } else if (typeof valueString === 'number') {
            // This case already works without intervention.
        }

        // write this value next to the equals sign in the variable line, keep all the lines surrounding it, such as the comments
        // It may be that comments come after the value, those should be kept as well
        newRestrictionCode = newRestrictionCode.replace(new RegExp(`(#@param[\\s\\S]*?${key}[\\s\\S]*?=)[^\\n]*`), `$1${valueString}`);
        
    });

    console.log(newRestrictionCode);

    return newRestrictionCode;
}

const savePythonRestrictionTemplate = (restrictionCode: string, params: { [key: string]: any }) => {
    return restrictionCode;
}

const saveRestrictionTemplate = (restrictionCode: string, params: { [key: string]: any }, extension: string) => {
    // This function will save the restriction template with the given parameters.
    // It chooses the correct function based on the extension of the file.
    switch (extension) {
        case 'py':
            return savePythonRestrictionTemplate(restrictionCode, params);
        case 'sh':
            return saveBashRestrictionTemplate(restrictionCode, params);
        default:
            return restrictionCode;
    }
}

/**
 * This UI will show different fields for parameters regarding the restrictions template.
 * @returns {React.ReactElement} - The rendered component.
 */
export default function RestrictionTemplateUI({ restrictionCode, handleCloseTemplateInterface }: { restrictionCode: string, handleCloseTemplateInterface: () => void }) {
    // There are four types of variables that can be used in a restriction template:
    // 1. Integer
    // 2. String
    // 3. Boolean
    // 4. List

    const params = parseParams(restrictionCode);

    const [paramsState, setParamsState] = useState<{ [key: string]: any }>({});

    // Initialize paramsState with default values
    useState(() => {
        const initialState: { [key: string]: any } = {};
        params.forEach(param => {
            initialState[param.variable] = param.value;
        });
        setParamsState(initialState);
    });

    // All functions beneath are for handling the array type of parameters.
    const handleArrayChange = (variable: string, newValue: string) => {
        setParamsState(prevState => ({
            ...prevState,
            [variable]: newValue
        }));
    };

    // This function is specifically for handling the array type of parameters.
    // It will change the row at the given index to the new value.
    const handleChangeRow = (variable: string, newValue: any, index: number) => {
        const newArrayValues = [...paramsState[variable]];
        newArrayValues[index] = newValue;
        setParamsState(prevState => ({
            ...prevState,
            [variable]: newArrayValues
        }));
    }

    const handleDeleteRow = (variable: string, index: number) => {
        const newArrayValues = [...paramsState[variable]];
        newArrayValues.splice(index, 1);
        setParamsState(prevState => ({
            ...prevState,
            [variable]: newArrayValues
        }));
    };

    const handleAddRow = (variable: string) => {
        setParamsState(prevState => ({
            ...prevState,
            [variable]: [...(prevState[variable] || []), ''] // Initialize with an empty string
        }));
    };

    return (
        <Box>
            <AppBar sx={{ position: 'relative' }}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleCloseTemplateInterface}
                        aria-label="close"
                    >
                    <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ ml: 2, flex: 1 }}>
                        {'Template'}
                    </Typography>
                    <Button
                        autoFocus
                        color="inherit"
                        onClick={() => saveRestrictionTemplate(restrictionCode, paramsState, 'sh')}
                    >
                        save
                    </Button>
                </Toolbar>
            </AppBar>
            <Box aria-label={'Content'} padding={1}>
                {params.map((param, index) => (
                    <div key={index} style={{ marginBottom: '20px' }}>
                        {param.type === 'number' && (
                            // In this case we have a number
                            // It needs the appropriate input field
                            <>
                                <Typography variant={'body2'}>
                                    {param.description}
                                </Typography>
                                <TextField
                                    type='number'
                                    value={paramsState[param.variable]}
                                    fullWidth
                                    onChange={(e) => handleArrayChange(param.variable, Number(e.target.value))}
                                />
                            </>
                        )}
                        {param.type === 'string' && (
                            // In this case we have a string
                            // It needs the appropriate input field
                            <>
                                <Typography variant={'body2'}>
                                    {param.description}
                                </Typography>
                                <TextField
                                    type='text'
                                    value={paramsState[param.variable]}
                                    fullWidth
                                    onChange={(e) => handleArrayChange(param.variable, e.target.value)}
                                />
                            </>
                        )}
                        {param.type === 'boolean' && (
                            // In this case we have a boolean
                            // It needs the appropriate input field
                            <>
                                <Typography variant={'body2'}>
                                    {param.description}
                                </Typography>
                                <Checkbox
                                    checked={paramsState[param.variable]}
                                    color="primary"
                                    onChange={(e) => handleArrayChange(param.variable, e.target.checked)}
                                />
                            </>
                        )}
                        {param.type === 'array' && (
                            // In this case we have a list
                            // It needs to have a listing of the present elements,
                            // as well as a button to add entries to the list.
                            <div>
                                <Typography variant={'body2'}>
                                    {param.description}
                                </Typography>
                                <List>
                                    {(paramsState[param.variable] || []).map((item, idx) => (
                                        <ListItem key={idx}>
                                            <ListItemText>
                                                <TextField
                                                    type='text'
                                                    value={item}
                                                    onChange={(e) => handleChangeRow(param.variable, e.target.value, idx)}
                                                />
                                            </ListItemText>
                                            <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteRow(param.variable, idx)}>
                                                <DeleteOutlineIcon />
                                            </IconButton>
                                        </ListItem>
                                    ))}
                                </List>
                                <Button variant="outlined" onClick={() => handleAddRow(param.variable)} startIcon={<AddCircleOutlineIcon />}>Add Row</Button>
                            </div>
                        )}
                    </div>
                ))}
            </Box>
        </Box>
    );
}

// Helper function for parsing a value in either python or bash code.
function parseValue(value: string): string | number | boolean | any[] {
    if (value.startsWith('"') && value.endsWith('"')) {
        return value.slice(1, -1);
    } else if (value === 'True' || value === 'true') { // capital T for python or lowercase t for bash
        return true;
    } else if (value === 'False' || value === 'false') { // capital F for python or lowercase f for bash
        return false;
    } else if (!isNaN(parseInt(value))) {
        return parseInt(value);
    } else if (value.startsWith('[') && value.endsWith(']')) { // square brackets for python lists
        // Python-style list
        return value.slice(1, -1).split(',').map(item => parseValue(item.trim())); // in python the values are separated by commas
    } else if (value.startsWith('(') && value.endsWith(')')) { // round brackets for bash lists
        // Bash-style list
        return value.slice(1, -1).split(' ').map(item => parseValue(item.trim())); // in bash the values are separated by whitespace
    } else {
        return value;
    }
}

function parseParams(code: string) {
    // Parse the restriction code into different fields
    const params = [];
    const lines = code.split('\n');
    let description = '';

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // Look for the #@param tag
        if (line.startsWith('#@param')) {
            description = lines[i + 1].trim().replace(/^# ?/, '');
            const variableLine = lines[i + 2].trim();
            const [variable, value] = variableLine.split('=').map(str => str.trim());

            let parsedValue = parseValue(value);

            params.push({ type: Array.isArray(parsedValue) ? 'array' : typeof (parsedValue), description, variable, value: parsedValue });
        }
    }

    return params;
}
