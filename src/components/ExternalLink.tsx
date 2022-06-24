import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

type ExternalLinkProps = {
  href: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLAnchorElement>;

export default function ExternalLink(props: ExternalLinkProps) {
  var propsForAnchor: React.HTMLAttributes<HTMLAnchorElement> = { ...props };
  delete propsForAnchor['children'];

  return (
    <a {...propsForAnchor} className="text-blue-800">
      {props.children} <FontAwesomeIcon icon={["fas", "arrow-up-right-from-square"]} size="xs" />
    </a>
  );
}
