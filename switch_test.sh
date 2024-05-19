#!/bin/sh

if [ -e "testing" ]; then
    rm api/middleware/middleware.py
    cp api/middleware/middleware_original.py api/middleware/middleware.py

    rm frontend/frontend/src/main.tsx
    cp frontend/frontend/src/main_original.tsx frontend/frontend/src/main.tsx

    rm testing
else
    rm api/middleware/middleware.py
    if [ "$1" = "true" ]; then
        cp api/middleware/middleware_lesgever_test.py api/middleware/middleware.py
    else
        cp api/middleware/middleware_student_test.py api/middleware/middleware.py
    fi

    rm frontend/frontend/src/main.tsx
    cp frontend/frontend/src/main_test.tsx frontend/frontend/src/main.tsx

    touch testing
fi


