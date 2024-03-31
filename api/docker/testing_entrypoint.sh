#!/bin/bash
echo $1
echo $2
echo $(ls)
for filename in ./data/restricties/*; do
    echo "Testing ${filename:8} ..."

    if [[ "$filename" == *.sh ]]
    then
    	bash $filename
    elif [[ "$filename" == *.py ]]
    then
	    python3 $filename
    fi
done
