"use client";
import { useEffect, useState } from "react";
import { animate } from "framer-motion";

export default function CountUp({ value, suffix = "" }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 0.8,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [value]);

  return (
    <>
      {display}
      {suffix}
    </>
  );
}
