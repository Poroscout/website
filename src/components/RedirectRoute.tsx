import { RouteProps } from "react-router-dom";
import Redirect from "./Redirect";

export type RedirectRouteProps = RouteProps & {
    to: string;
}

export default function RedirectRoute(props: RedirectRouteProps) {
    return <Redirect to={props.to} />;
}