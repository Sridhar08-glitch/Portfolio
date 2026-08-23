"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Standard entrance: 20-24px rise + fade, ~560ms, cubic-bezier(.22,.68,0,1),
 * once on scroll-in. Disabled entirely under prefers-reduced-motion or when the
 * site theme sets motion to "off".
 */
const EASE: [number, number, number, number] = [0.22, 0.68, 0, 1];

export function useMotionEnabled(): boolean {
  const reduced = useReducedMotion();
  const [themeOff, setThemeOff] = useState(false);
  useEffect(() => {
    setThemeOff(document.documentElement.dataset.motion === "off");
  }, []);
  return !reduced && !themeOff;
}

export function Reveal({
  children,
  delay = 0,
  y = 22,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article";
}) {
  const enabled = useMotionEnabled();
  const MotionTag = motion[as];

  if (!enabled) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 0.56, ease: EASE, delay }}
    >
      {children}
    </MotionTag>
  );
}

export const staggerParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

export const staggerChild: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

export function Stagger({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const enabled = useMotionEnabled();
  if (!enabled) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      variants={staggerParent}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-8% 0px" }}
    >
      {children}
    </motion.div>
  );
}
