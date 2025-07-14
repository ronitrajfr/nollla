"use client";
import { cn } from "@/lib/utils";
import { IconMenu2, IconX } from "@tabler/icons-react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import Link from "next/link";
import React, { useRef, useState } from "react";
import { Button } from "./button";
import { ModeToggle } from "./moddle-toggle";

interface NavbarProps {
  navItems: {
    name: string;
    link: string;
  }[];
  visible: boolean;
}

export const Navbar = () => {
  const navItems = [
    {
      name: "Features",
      link: "/#features",
    },
    {
      name: "Pricing",
      link: "/#pricing",
    },
    {
      name: "Contact",
      link: "/#contact",
    },
  ];

  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const [visible, setVisible] = useState<boolean>(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 100) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  });

  return (
    <motion.div ref={ref} className="w-full fixed top-0 inset-x-0 z-50">
      <DesktopNav visible={visible} navItems={navItems} />
      <MobileNav visible={visible} navItems={navItems} />
    </motion.div>
  );
};

const DesktopNav = ({ navItems, visible }: NavbarProps) => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <motion.div
      onMouseLeave={() => {
        setHovered(null);
      }}
      animate={{
        backdropFilter: visible ? "blur(10px)" : "none",
        boxShadow: visible
          ? "0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset"
          : "none",
        width: visible ? "40%" : "100%",
        y: visible ? 20 : 0,
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 50,
      }}
      style={{
        minWidth: "800px",
      }}
      className={cn(
        "hidden lg:flex flex-row  self-start bg-transparent dark:bg-transparent items-center justify-between py-2 max-w-7xl mx-auto px-4 rounded-full relative z-[60] w-full",
        visible && "bg-white/80 dark:bg-neutral-950/80"
      )}
    >
      <motion.div className="lg:flex flex-row flex-1 absolute inset-0 hidden items-center justify-center space-x-2 lg:space-x-2 text-sm text-zinc-600 font-medium hover:text-zinc-800 transition duration-200">
        {navItems.map((navItem: any, idx: number) => (
          <Link
            onMouseEnter={() => setHovered(idx)}
            className="text-neutral-600 dark:text-neutral-300 relative px-4 py-2"
            key={`link=${idx}`}
            href={navItem.link}
          >
            {hovered === idx && (
              <motion.div
                layoutId="hovered"
                className="w-full h-full absolute inset-0 bg-gray-100 dark:bg-neutral-800 rounded-full"
              />
            )}
            <span className="relative z-20">{navItem.name}</span>
          </Link>
        ))}
      </motion.div>
      <div className="flex items-center gap-4">
        <ModeToggle />

        <AnimatePresence mode="popLayout" initial={false}>
          {!visible && (
            <motion.div
              initial={{
                x: 100,
                opacity: 0,
              }}
              animate={{
                x: 0,
                opacity: [0, 0, 1],
              }}
              exit={{
                x: 100,
                opacity: [0, 0, 0],
              }}
              transition={{
                duration: 0.5,
                ease: "easeOut",
              }}
            >
              <Button
                as={Link}
                variant="secondary"
                className="hidden md:block "
              >
                Login
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const MobileNav = ({ navItems, visible }: NavbarProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.div
        animate={{
          backdropFilter: visible ? "blur(10px)" : "none",
          boxShadow: visible
            ? "0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset"
            : "none",
          width: visible ? "90%" : "100%",
          y: visible ? 20 : 0,
          borderRadius: open ? "4px" : "2rem",
          paddingRight: visible ? "12px" : "0px",
          paddingLeft: visible ? "12px" : "0px",
        }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 50,
        }}
        className={cn(
          "flex relative flex-col lg:hidden w-full justify-between items-center bg-transparent   max-w-[calc(100vw-2rem)] mx-auto px-0 py-2 z-50",
          visible && "bg-white/80 dark:bg-neutral-950/80"
        )}
      >
        <div className="flex flex-row justify-between items-center w-full">
          {open ? (
            <IconX
              className="text-black dark:text-white"
              onClick={() => setOpen(!open)}
            />
          ) : (
            <IconMenu2
              className="text-black dark:text-white"
              onClick={() => setOpen(!open)}
            />
          )}
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex rounded-lg absolute top-16 bg-white dark:bg-neutral-950 inset-x-0 z-50 flex-col items-start justify-start gap-4 w-full px-4 py-8 shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            >
              {navItems.map((navItem: any, idx: number) => (
                <Link
                  key={`link=${idx}`}
                  href={navItem.link}
                  onClick={() => setOpen(false)}
                  className="relative text-neutral-600 dark:text-neutral-300"
                >
                  <motion.span className="block">{navItem.name} </motion.span>
                </Link>
              ))}
              <Button
                as={Link}
                onClick={() => setOpen(false)}
                variant="primary"
                className="block md:hidden w-full"
              >
                Login
              </Button>
              <Button
                as="button"
                onClick={() => setOpen(false)}
                variant="primary"
                className="block md:hidden w-full"
              >
                Book a call
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};
