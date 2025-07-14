"use client";
import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

const FAQs = [
  {
    question: "What is the purpose of this website?",
    answer:
      "This website lets you upload raw thumbnail images and customize them easily.",
  },
  {
    question: "Do I need to sign up or log in?",
    answer:
      "No, you don't need to sign up or log in. The app is completely free and doesn't require any account.",
  },
  {
    question: "Can I change the background of my thumbnail?",
    answer:
      "Yes, you can either use a solid color or upload a custom background image to replace the existing one.",
  },
  {
    question: "Can I add shadows or effects?",
    answer:
      "Yes, you can add shadows to your elements for a more professional and eye-catching look.",
  },
  {
    question: "Is this tool really free?",
    answer:
      "Yes, it's 100% free to use. There are no hidden fees or subscriptions.",
  },
  {
    question: "Is this project open source?",
    answer:
      "Yes! The entire project is open source. You can explore the code, contribute.",
  },
];
export function FAQ() {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className="mx-auto grid w-full max-w-7xl gap-4 px-4 py-20 md:px-8 md:py-40">
      <h2 className="font-sans text-bold text-xl text-center md:text-4xl w-fit mx-auto font-bold tracking-tight text-neutral-8000 dark:text-neutral-100 text-neutral-800">
        Built to be simple. Still got questions?
      </h2>
      <p className="max-w-lg text-sm text-neutral-600 text-center mx-auto mt-2 dark:text-neutral-400">
        Here’s the stuff people usually ask, fast and straight.
      </p>
      <div className="mx-auto mt-10 w-full max-w-3xl">
        {FAQs.map((faq, index) => (
          <FAQItem
            key={index}
            question={faq.question}
            answer={faq.answer}
            open={open}
            setOpen={setOpen}
          />
        ))}
      </div>
    </div>
  );
}

const FAQItem = ({
  question,
  answer,
  setOpen,
  open,
}: {
  question: string;
  answer: string;
  open: string | null;
  setOpen: (open: string | null) => void;
}) => {
  const isOpen = open === question;

  return (
    <div
      className="shadow-input mb-8 w-full cursor-pointer rounded-lg bg-white p-4 dark:bg-neutral-900"
      onClick={() => {
        if (isOpen) {
          setOpen(null);
        } else {
          setOpen(question);
        }
      }}
    >
      <div className="flex items-start">
        <div className="relative mr-4 mt-1 h-6 w-6 flex-shrink-0">
          <IconChevronUp
            className={cn(
              "absolute inset-0 h-6 w-6 transform text-black transition-all duration-200 dark:text-white",
              isOpen && "rotate-90 scale-0"
            )}
          />
          <IconChevronDown
            className={cn(
              "absolute inset-0 h-6 w-6 rotate-90 scale-0 transform text-black transition-all duration-200 dark:text-white",
              isOpen && "rotate-0 scale-100"
            )}
          />
        </div>
        <div>
          <h3 className="text-lg font-medium text-neutral-700 dark:text-neutral-200">
            {question}
          </h3>
          <AnimatePresence mode="wait">
            {isOpen && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="overflow-hidden text-neutral-500 dark:text-neutral-400"
              >
                {answer.split("").map((line, index) => (
                  <motion.span
                    initial={{ opacity: 0, filter: "blur(5px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, filter: "blur(0px)" }}
                    transition={{
                      duration: 0.2,
                      ease: "easeOut",
                      delay: index * 0.005,
                    }}
                    key={index}
                  >
                    {line}
                  </motion.span>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
