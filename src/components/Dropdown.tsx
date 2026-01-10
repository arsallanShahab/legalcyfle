import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import React from "react";

type Props = {
  title?: string;
  children: React.ReactNode;
  className?: string;
};

const Dropdown = (props: Props) => {
  const url = props.title
    ?.replace(/[^a-zA-Z0-9]/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();
  return (
    <div className="group relative">
      <Link href={"/category/" + url}>
        <div
          className={cn(
            "font-google flex cursor-pointer select-none items-center justify-center gap-1 px-3 py-2 transition-colors duration-200 hover:text-black dark:hover:text-white",
            props?.className,
          )}
        >
          {props?.title} <ChevronDown className="h-3 w-3 stroke-[3px]" />
        </div>
      </Link>
      {props.children}
    </div>
  );
};

type DropdownContentProps = {
  children: React.ReactNode;
};

const DropdownContent = (props: DropdownContentProps) => {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-7 z-[700] flex w-[200px] origin-top -translate-y-1 scale-50 flex-col rounded-2xl border border-gray-200 bg-white px-2 py-2 opacity-0 shadow-lg transition-all duration-300 ease-in-out *:w-full *:text-xs group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100 dark:border-zinc-700 dark:bg-zinc-800">
      {props.children}
    </div>
  );
};

const DropdownItem = (props: { children: React.ReactNode; href: string }) => {
  return (
    <Link
      href={props.href}
      className="font-google block rounded-lg px-4 py-2 text-zinc-700 duration-150 hover:bg-gray-100 hover:text-black dark:text-gray-300 dark:hover:bg-zinc-700 dark:hover:text-white"
    >
      {props.children}
    </Link>
  );
};

export { Dropdown, DropdownContent, DropdownItem };
