import { cn } from "@/lib/utils";
import React from "react";
import FlexContainer from "./FlexContainer";

type Props = {
  children: React.ReactNode;
  className?: string;
};

const Wrapper = (props: Props) => {
  return (
    <div
      className={cn(
        "mx-auto max-w-5xl px-4 py-10 md:px-10 md:py-20",
        props.className,
      )}
    >
      <FlexContainer variant="column-start" gap="xl">
        {props.children}
      </FlexContainer>
    </div>
  );
};

export default Wrapper;
