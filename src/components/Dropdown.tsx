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
  return (
    <div className="group relative">
      <div
        className={cn(
          "flex cursor-pointer select-none items-center justify-center gap-2 rounded-lg border border-transparent px-2 py-1 transition-all duration-200 hover:bg-zinc-200 group-hover:bg-zinc-100 dark:hover:bg-zinc-900 dark:group-hover:bg-zinc-800",
          props?.className,
        )}
      >
        {props?.title} <ChevronDown className="h-3.5 w-3.5 stroke-[3px]" />
      </div>
      {props.children}
    </div>
  );
};

type DropdownContentProps = {
  children: React.ReactNode;
};

const DropdownContent = (props: DropdownContentProps) => {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-7 z-[700] flex w-[175px] origin-top -translate-y-1 scale-50 flex-col rounded-xl border bg-white px-1.5 py-2 opacity-0 shadow-xl transition-all duration-300 ease-in-out *:w-full *:text-xs group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100 dark:border-zinc-800 dark:bg-zinc-900">
      {props.children}
    </div>
  );
};

const DropdownItem = (props: { children: React.ReactNode; href: string }) => {
  return (
    <Link
      href={props.href}
      className="block rounded-lg px-3 py-1.5 duration-150 hover:bg-zinc-200 dark:hover:bg-zinc-800"
    >
      {props.children}
    </Link>
  );
};

export { Dropdown, DropdownContent, DropdownItem };
