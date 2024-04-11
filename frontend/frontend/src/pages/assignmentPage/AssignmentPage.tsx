import {useEffect, useState} from "react";
import instance from "../../axiosConfig.ts";
import {AssignmentTeacherPage} from "./AssignmentTeacherPage.tsx";
import {AssignmentStudentPage} from "./AssignmentStudentPage.tsx";


export function AssignmentPage() {
    const [is_teacher, setIsTeacher] = useState<boolean>(false);

    useEffect(() => {
        instance.get('/gebruikers/me').then((response) => {
            console.log('me' + response.data);
            setIsTeacher(response.data.is_lesgever);
        })
    }, []);


    return (
        <>{is_teacher ?
            <AssignmentTeacherPage/> :
            <AssignmentStudentPage/>
        }
        </>
    );
}