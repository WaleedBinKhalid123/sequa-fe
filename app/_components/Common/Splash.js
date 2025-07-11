"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function Splash({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onFinish) onFinish();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div>
      <motion.div
        animate={{
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 3,
          ease: "easeIn",
        }}
        className="relative w-[45vw] md:w-[30vw] xl:w-[20vw] h-[45vh] md:h-[30vh] xl:h-[20vh]"
      >
        <Image
          src="/logo.svg"
          alt="Splash Logo"
          fill
          className="object-contain"
          priority
        />
      </motion.div>
    </div>
  );
};
