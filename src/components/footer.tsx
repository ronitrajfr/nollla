import Image from "next/image";
import Link from "next/link";
import React from "react";
//import { Logo } from "./logo";

export function Footer() {
  const pages = [
    { title: "Home", href: "/" },
    { title: "Get Started", href: "/app" },
  ];

  const socials = [
    { title: "Twitter", href: "https://x.com/ronitrajfr" },
    { title: "GitHub", href: "https://github.com/ronitrajfr/nollla" },
  ];

  return (
    <div className="border-t border-neutral-100 dark:border-white/[0.1] px-8 py-20 bg-white dark:bg-neutral-950 w-full relative overflow-hidden">
      <div className="max-w-7xl mx-auto text-sm text-neutral-500 flex sm:flex-row flex-col justify-between items-start md:px-8">
        <div>
          <div className="mt-2 ml-2 text-neutral-600 dark:text-neutral-400">
            <p>
              &copy; 2025 Nollla. Built by{" "}
              <Link
                href="https://x.com/ronitrajfr"
                target="_blank"
                className="underline text-sky-600 dark:text-sky-400 hover:text-sky-800"
              >
                @ronitrajfr
              </Link>{" "}
              and{" "}
              <Link
                href="https://x.com/webofayush"
                target="_blank"
                className="underline text-sky-600 dark:text-sky-400 hover:text-sky-800"
              >
                @ayushbairagi
              </Link>
            </p>
            <p className="mt-1">
              View the repo on{" "}
              <Link
                href="https://github.com/ronitrajfr/nollla"
                target="_blank"
                className="underline text-sky-600 dark:text-sky-400 hover:text-sky-800"
              >
                GitHub
              </Link>{" "}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 items-start mt-10 sm:mt-0 md:mt-0">
          <div className="flex justify-center space-y-4 flex-col w-full">
            <p className="text-neutral-600 dark:text-neutral-300 font-bold">
              Pages
            </p>
            <ul className="text-neutral-600 dark:text-neutral-300 space-y-4">
              {pages.map((page, idx) => (
                <li key={"pages" + idx}>
                  <Link
                    href={page.href}
                    className="hover:text-neutral-800 dark:hover:text-white"
                  >
                    {page.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-center space-y-4 flex-col">
            <p className="text-neutral-600 dark:text-neutral-300 font-bold">
              Socials
            </p>
            <ul className="text-neutral-600 dark:text-neutral-300 space-y-4">
              {socials.map((social, idx) => (
                <li key={"social" + idx}>
                  <Link
                    href={social.href}
                    className="hover:text-neutral-800 dark:hover:text-white"
                    target="_blank"
                  >
                    {social.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <p className="text-center uppercase mt-20 text-5xl md:text-9xl lg:text-[12rem] xl:text-[13rem] font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 dark:from-neutral-950 to-neutral-200 dark:to-neutral-800 inset-x-0">
        NOLLA
      </p>
    </div>
  );
}
