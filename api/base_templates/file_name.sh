#!/bin/bash

#@param
# Vul hieronder de namen van de bestanden in die je in de gezipte folder wilt vinden.
file_name="verslag.pdf"


if [ -e "$file_name" ]; then
    echo "$file_name present: OK"
else
    echo "$file_name not present: FAIL"
fi