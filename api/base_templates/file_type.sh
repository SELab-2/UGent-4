#!/bin/bash

#@param
# Vul hieronder het type dat het bestand moet hebben
file_type="pdf"


file_exists=false
for file in *.$file_type; do
    if [ -e "$file" ]; then
        file_exists=true
        break
    fi
done

if [ "$file_exists" = true ]; then
    echo "$file_type: OK"
else
    echo "$file_type: FAIL"
fi
