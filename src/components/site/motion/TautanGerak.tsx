"use client";

import Link from "next/link";
import * as m from "motion/react-m";
import { useReducedMotion } from "motion/react";
import type { ComponentProps } from "react";

const MotionLink = m.create(Link);

export function TautanGerak(props: ComponentProps<typeof MotionLink>) {
  const reduce = useReducedMotion();
  return <MotionLink {...props} whileHover={reduce ? undefined : { y: -3, scale: 1.015 }}
    whileTap={reduce ? undefined : { scale: 0.98 }} transition={{ duration: 0.18 }} />;
}
