import { css } from "@emotion/css";
import React, { PropsWithoutRef } from "react";

// props for html span element
type SlashCommandProps = PropsWithoutRef<JSX.IntrinsicElements["span"]>;

const style = css`
  background-color: #404675;
  border-radius: 0.25rem;
  padding: 0.15rem;
  color: #a7d7fe;
  white-space: nowrap;
`;

export default function SlashCommand(props: SlashCommandProps) {
  return (
    <span
      {...props}
      className={`${style} text-sm leading-relaxed font-semibold ${props.className ?? ""}`}
    />
  );
}
