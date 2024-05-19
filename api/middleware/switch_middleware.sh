#!/bin/sh

if [ -e "api/middleware/temp" ]; then
    rm api/middleware/middleware.py
    cp api/middleware/middleware_original.py api/middleware/middleware.py
    rm api/middleware/temp
else
    rm api/middleware/middleware.py
    touch api/middleware/temp
    if [ "$1" = "true" ]; then
        cp api/middleware/middleware_lesgever_test.py api/middleware/middleware.py
    else
        cp api/middleware/middleware_student_test.py api/middleware/middleware.py
    fi
fi
