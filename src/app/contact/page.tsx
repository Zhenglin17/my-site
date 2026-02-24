"use client";
import { Github, Mail } from "lucide-react";
import Link from "next/link";
import { Navigation } from "../components/nav";
import { Card } from "../components/card";

const socials = [
  {
    icon: <Mail size={20} />,
    href: "mailto:zhenglinzhang6@gmail.com",
    label: "Email",
    handle: "zhenglinzhang6@gmail.com",
  },
  {
    icon: <Github size={20} />,
    href: "https://github.com/Zhenglin17",
    label: "GitHub",
    handle: "Zhenglin17",
  },
];

export default function ContactPage() {
  return (
    <div className="bg-gradient-to-tl from-stone-50/0 via-amber-50/50 to-stone-50/0">
      <Navigation />
      <div className="container flex items-center justify-center min-h-screen px-4 mx-auto">
        <div className="grid w-full grid-cols-1 gap-8 mx-auto mt-32 sm:mt-0 sm:grid-cols-2 lg:gap-16 max-w-2xl">
          {socials.map((s) => (
            <Card key={s.href}>
              <Link
                href={s.href}
                target="_blank"
                className="p-4 relative flex flex-col items-center gap-4 duration-700 group md:gap-8 md:py-24 lg:pb-48 md:p-16"
              >
                <span
                  className="absolute w-px h-2/3 bg-gradient-to-b from-stone-400 via-stone-300/50 to-transparent"
                  aria-hidden="true"
                />
                <span className="relative z-10 flex items-center justify-center w-12 h-12 text-sm duration-1000 border rounded-full text-stone-600 group-hover:text-stone-900 group-hover:bg-stone-100 border-stone-300 bg-stone-50 group-hover:border-stone-500">
                  {s.icon}
                </span>
                <div className="z-10 flex flex-col items-center">
                  <span className="lg:text-xl font-medium duration-150 xl:text-3xl text-stone-700 group-hover:text-stone-900 font-display">
                    {s.handle}
                  </span>
                  <span className="mt-4 text-sm text-center duration-1000 text-stone-500 group-hover:text-stone-700">
                    {s.label}
                  </span>
                </div>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
