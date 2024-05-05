import * as React from 'react'
import { t } from 'i18next'
import { TextField, Checkbox, List, ListItem, ListItemText, IconButton, Button } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

/**
 * This UI will show different fields for parameters regarding the restrictions template.
 * @returns {React.ReactElement} - The rendered component.
 */
export default function RestrictionTemplateUI({restrictionCode} : {restrictionCode: string}) {
    // There are four types of variables that can be used in a restriction template:
    // 1. Integer
    // 2. String
    // 3. Boolean
    // 4. List

    const params = parseParams(restrictionCode);

    const initialArrayValues = params.filter(param => param.type === 'array').map(param => {
        return param.value;
    });
    const [arrayValues, setArrayValues] = React.useState([...initialArrayValues.map(value => ({ value }))]);

    const handleArrayChange = (index: number, event) => {
        const newArrayValues = [...arrayValues];
        newArrayValues[index].value = event.target.value;
        setArrayValues(newArrayValues);
    };

    const handleDeleteRow = (index: number) => {
        const newArrayValues = [...arrayValues];
        newArrayValues.splice(index, 1);
        setArrayValues(newArrayValues);
    };

    const handleAddRow = () => {
        setArrayValues([...arrayValues, { value: '' }]);
    };

    return (
        <div>
            {params.map((param, index) => (
                <div key={index} style={{ marginBottom: '20px' }}>
                    {param.type === 'number' && (
                        <TextField
                            label={param.description}
                            type='number'
                            value={param.value}
                            fullWidth
                        />
                    )}
                    {param.type === 'string' && (
                        <TextField
                            label={param.description}
                            type='text'
                            value={param.value}
                            fullWidth
                        />
                    )}
                    {param.type === 'boolean' && (
                        <Checkbox
                            checked={param.value}
                            color="primary"
                            inputProps={{ 'aria-label': param.description }}
                        />
                    )}
                    {param.type === 'array' && (
                        <div>
                            <List>
                                {arrayValues.map((item, idx) => (
                                    <ListItem key={idx}>
                                        <ListItemText>
                                            <TextField
                                                label={param.description}
                                                type='text'
                                                value={item.value}
                                                onChange={(event) => handleArrayChange(idx, event)}
                                            />
                                        </ListItemText>
                                        <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteRow(idx)}>
                                            <DeleteOutlineIcon />
                                        </IconButton>
                                    </ListItem>
                                ))}
                            </List>
                            <Button variant="outlined" onClick={handleAddRow} startIcon={<AddCircleOutlineIcon />}>Add Row</Button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

function parseValue(value: string): string | number | boolean | any[] {
    if (value.startsWith('"') && value.endsWith('"')) {
        return value.slice(1, -1);
    } else if (value === 'True' || value === 'true') {
        return true;
    } else if (value === 'False' || value === 'false') {
        return false;
    } else if (!isNaN(parseInt(value))) {
        return parseInt(value);
    } else if (value.startsWith('[') && value.endsWith(']')) {
        // Python-style list
        return value.slice(1, -1).split(',').map(item => parseValue(item.trim()));
    } else if (value.startsWith('(') && value.endsWith(')')) {
        // Bash-style list
        return value.slice(1, -1).split(' ').map(item => parseValue(item.trim()));
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

        if (line.startsWith('#@param')) {
            description = lines[i + 1].trim().replace(/^# ?/, '');
            const variableLine = lines[i + 2].trim();
            const [variable, value] = variableLine.split('=').map(str => str.trim());

            let parsedValue = parseValue(value);

            params.push({type: Array.isArray(parsedValue) ? 'array' : typeof(parsedValue), description, variable, value: parsedValue});
        }
    }

    console.log("params length:");
    console.log(params.length);

    return params;
}

