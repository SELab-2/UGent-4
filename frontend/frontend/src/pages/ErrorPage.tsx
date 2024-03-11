import { useRouteError } from "react-router-dom";

//TODO:: fix a decent error page
export default function ErrorPage() {

    const error = useRouteError();
    console.error(error);

    return (
        <div id="error-page">
            <h1>Oops!</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <p>
                error
            </p>
        </div>
    );
}