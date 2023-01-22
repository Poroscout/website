"use client";

/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useState, useEffect } from "react";

const formatter = Intl.NumberFormat(undefined, { notation: "compact" });

export type StatCardProps = {
  number: number | undefined;
};

export default function BigNumberStatCard(props: StatCardProps) {
  // animate up from 0
  const [number, setNumber] = useState(0);

  useEffect(() => {
    if (props.number === undefined) return;

    const amountToChange = props.number / 30;

    const timer = setInterval(() => {
      setNumber(number => {
        if (number < props.number!) {
          return number + amountToChange;
        } else {
          return number;
        }
      });

      if (number >= props.number!) {
        clearInterval(timer);
      }
    }, 100);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.number]);

  return <>
    {
      props.number
        ? formatter.format(number)
        : "Err!"
    }
  </>
}
