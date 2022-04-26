import { useEffect } from "react"

export default function Redirect(props: { to: string }) {
    useEffect(() => {
        window.location.href = props.to
    }, []);

    return (
        <p>Redirecting... Click <a className="text-blue-600" href={props.to}>here</a> if you are not redirected automatically.</p>
    )
}