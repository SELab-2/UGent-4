#!/bin/bash

#@param
# Vul hieronder de naam in dat het ingediende bestand moet hebben
file_name="verslag.pdf"


if [ -e "$file_name" ]; then
    echo "$file_name present: OK"
else
    echo "$file_name not present: FAIL"
fi
