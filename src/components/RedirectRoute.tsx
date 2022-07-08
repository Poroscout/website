import React from "react";
import { Route, RouteProps } from "react-router-dom";
import Redirect from "./Redirect";

export type RedirectRouteProps = RouteProps & {
    to: string;
}

export default function RedirectRoute(props: RedirectRouteProps) {
    return <Route {...props} element={<Redirect to={props.to} />} />;
}