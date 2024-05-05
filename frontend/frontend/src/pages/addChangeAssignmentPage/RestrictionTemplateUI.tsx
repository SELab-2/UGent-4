import * as React from 'react'
import { t } from 'i18next'
import { TextField, Checkbox, List, ListItem, ListItemText, IconButton, Button } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Typography from '@mui/material/Typography'

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

    // TODO: als er meerdere parameters van het type array zijn, 
    // dan worden die allemaal samengezet, wat natuurlijk niet de bedoeling is.
    // Waarschijnlijk zullen de values pas uit de parameter gehaald moeten worden in de code.
    // Het probleem wordt dan wel weer hoe de onderste functies aangepast moeten worden.
    // Want elke array moet een eigen state hebben, en die moet dan ook weer aangepast worden.
    const initialArrayValues = params.filter(param => param.type === 'array').map(param => {
        return param.value;
    });
    const [arrayValues, setArrayValues] = React.useState([...initialArrayValues.map(value => ({ value }))]);

    // All functions beneath are for handling the array type of parameters.
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
                        // In this case we have a number
                        // It needs the appropriate input field
                        <>
                            <Typography variant={'body2'}>
                                {param.description}
                            </Typography>
                            <TextField
                                type='number'
                                value={param.value}
                                fullWidth
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
                                //label={param.description}
                                type='text'
                                value={param.value}
                                fullWidth
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
                                checked={param.value}
                                color="primary"
                                inputProps={{ 'aria-label': param.description }}
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
                                {arrayValues.map((item, idx) => (
                                    <ListItem key={idx}>
                                        <ListItemText>
                                            <TextField
                                                //label={param.description}
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

            params.push({type: Array.isArray(parsedValue) ? 'array' : typeof(parsedValue), description, variable, value: parsedValue});
        }
    }

    return params;
}

