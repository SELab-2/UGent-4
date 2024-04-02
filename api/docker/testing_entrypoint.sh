#!/bin/bash
cd data

for filename in ./restricties/*; do
    echo -n "Testing ${filename}: "

    if [[ "$filename" == *.sh ]]
    then
    	bash $filename
    elif [[ "$filename" == *.py ]]
    then
	    python3 $filename
    fi
done
