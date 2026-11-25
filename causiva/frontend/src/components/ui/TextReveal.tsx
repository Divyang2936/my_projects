import React from "react";
import { motion } from "framer-motion";

interface TextRevealProps {
  children: string;
  className?: string;
}

export const TextReveal: React.FC<TextRevealProps> = ({ children, className = "" }) => {
  return (
    <motion.span
      className={`inline-flex flex-wrap overflow-hidden ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.7 }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.055 } },
      }}
      aria-label={children}
    >
      {children.split(" ").map((word, index) => (
        <span key={`${word}-${index}`} className="mr-[0.28em] overflow-hidden last:mr-0">
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y: "110%", opacity: 0 },
              visible: { y: 0, opacity: 1 },
            }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
};
