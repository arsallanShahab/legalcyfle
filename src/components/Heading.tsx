import React from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
};

const Heading = ({ children, className, level = 1 }: Props) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  return (
    <Tag className={cn("font-giest-sans text-4xl", className)}>{children}</Tag>
  );
};

export default Heading;
