import * as React from 'react'
import { t } from 'i18next'


/**
 * This UI will show different fields for parameters regarding the restrictions template.
 * @returns {React.ReactElement} - The rendered component.
 */
export default function RestrictionTemplateUI(restrictionCode: string) {
    // There are four types of variables that can be used in a restriction template:
    // 1. Integer
    // 2. String
    // 3. Boolean
    // 4. List

    const params = parseParams(restrictionCode);

    return (
        <>
            {params.map(param => {
                switch (param.type) {
                    // there are four cases: integer, string, boolean, and list
                    // for integer, we will use a number input
                    case 'integer':
                        return (
                            <div>
                                <label>{param.description}</label>
                                <input type='number' value={param.value as number} />
                            </div>
                        );
                    // for string, we will use a text input
                    case 'string':
                        return (
                            <div>
                                <label>{param.description}</label>
                                <input type='text' value={param.value as string} />
                            </div>
                        );
                    // for boolean, we will use a checkbox
                    case 'boolean':
                        return (
                            <div>
                                <label>{param.description}</label>
                                <input type='checkbox' checked={param.value as boolean} />
                            </div>
                        );
                    // for lists, we will use a drop down menu
                    case 'array':
                        return (
                            <div>
                                <label>{param.description}</label>
                                <select>
                                    {Array.isArray(param.value) && param.value.map((item: string) => <option value={item}>{item}</option>)}
                                </select>
                            </div>
                        );
                }
            })}
        

        </>
    )
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

    return params;
}

