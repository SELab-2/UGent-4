#!/bin/bash

#@param
# Vul hieronder de namen van de bestanden in die je in de gezipte folder wilt vinden.
file_names=("testfile1.txt" "testfile2.txt")

#@param
# Vul hieronder de naam van het zip bestand waarin je de files wil vinden
zip_file_name="file.zip"


for file_name in "${file_names[@]}"; do
    unzip -l $zip_file_name | grep -q $file_name;
    if [ "$?" == "0" ]
    then
        echo "$file_name present: OK"
    else
        echo "$file_name not present: FAIL"
    fi;
done
