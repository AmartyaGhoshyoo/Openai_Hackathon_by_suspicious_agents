"use client";

import { ArrowRight, Bot, Github, Menu, X } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { motion } from "motion/react";
import React from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const Headers = () => {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  const { login, id, img, name } = useSelector(
    (state: RootState) => state.loginuserSlice
  );

  return (
    <>
      {/* Transparent, responsive navigation */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-transparent backdrop-blur-sm">
        <section className="flex justify-between items-center pr-4 sm:pr-12">
          <div className="flex h-20 gap-20 justify-between sm:justify-start  items-center px-4 sm:px-12">
            <Link
              href="/"
              className="font-semibold tracking-tight text-white flex items-center gap-2"
            >
              <Bot className="size-12 cursor-pointer bg-gradient-to-b from-indigo-500 to-indigo-600 shadow-[0px_4px_32px_0_rgba(99,102,241,.70)] p-2 rounded-xl" />
              <h1 className="font-bold text-xl capitalize">AgenticWebpilot</h1>
            </Link>
            <nav className="hidden gap-8 text-base text-white/80 md:flex md:items-center">
              <a href="#features" className="hover:text-white">
                Features
              </a>
              <a href="#showcase" className="hover:text-white">
                How It Works
              </a>
              <a href="#pricing" className="hover:text-white">
                Pricing
              </a>
              <a href="#faq" className="hover:text-white">
                FAQ
              </a>
              <div className="hidden md:block">
                <Button asChild size="sm">
                  <Link href="/docs" className="gap-1">
                    Docs <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </nav>
          </div>
          <button
            aria-label="Open menu"
            className="md:hidden inline-flex items-center justify-center rounded-md border border-white/15 px-2.5 py-2 text-white/80 hover:bg-white/5"
            onClick={() => setOpen(true)}
          >
            <Menu className="size-5 font-bold" />
          </button>
          <div className="hidden sm:flex sm:items-center sm:gap-8">
            <Link
              href={
                "https://github.com/AmartyaGhoshyoo/Openai_Hackathon_by_suspicious_agents"
              }
              target="_blank"
            >
              <Github />
            </Link>
            <div>
              {login ? (
                <button className="h-[40px] w-[max-content] text-sm px-8 py-4 rounded-full bg-[#242424] border border-[#313131] flex justify-center items-center cursor-pointer">
                  {name}
                </button>
              ) : (
                <button
                  onClick={() => router.push("/signin")}
                  className="h-[40px] w-[max-content] px-8 py-4 rounded-full bg-[#242424] border border-[#313131] flex justify-center items-center cursor-pointer"
                >
                  Signin
                </button>
              )}
            </div>
          </div>
        </section>
        {/* Mobile sheet */}
        {open && (
          <div className="md:hidden">
            <div
              className="fixed inset-0 z-40 bg-black/60"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ y: -24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -24, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-[#0b0c0f] p-4"
            >
              <div className="mb-3 flex items-center justify-between px-4">
                {login ? (
                  <button className="h-[42px] px-8 py-4 rounded-full bg-[#242424] border border-[#323232] text-white flex justify-center items-center">
                    {name}
                  </button>
                ) : (
                  <Link
                    href={"/signin"}
                    className="font-semibold tracking-tight text-white"
                  >
                    <button className="h-[42px] px-8 py-4 rounded-full bg-[#242424] border border-[#323232] text-white flex justify-center items-center">
                      Signin
                    </button>
                  </Link>
                )}
                <button
                  aria-label="Close menu"
                  className="inline-flex items-center justify-center rounded-md border border-white/15 px-2.5 py-2 text-white/80 hover:bg-white/5"
                  onClick={() => setOpen(false)}
                >
                  <X className="size-5" />
                </button>
              </div>
              <div className="grid gap-2 text-white/80">
                <a
                  href="#features"
                  onClick={() => setOpen(false)}
                  className="rounded-md border border-transparent px-3 py-2 hover:bg-white/5 hover:text-white"
                >
                  Features
                </a>
                <a
                  href="#showcase"
                  onClick={() => setOpen(false)}
                  className="rounded-md border border-transparent px-3 py-2 hover:bg-white/5 hover:text-white"
                >
                  How It Works
                </a>
                <a
                  href="#pricing"
                  onClick={() => setOpen(false)}
                  className="rounded-md border border-transparent px-3 py-2 hover:bg-white/5 hover:text-white"
                >
                  Pricing
                </a>
                <a
                  href="#faq"
                  onClick={() => setOpen(false)}
                  className="rounded-md border border-transparent px-3 py-2 hover:bg-white/5 hover:text-white"
                >
                  FAQ
                </a>
                <Link
                  href="/docs"
                  onClick={() => setOpen(false)}
                  className="rounded-md border border-white/10 px-3 py-2 text-white hover:bg-white/5"
                >
                  Open Docs
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </header>
    </>
  );
};

export default Headers;
