import { cn } from "@/lib/utils";
import React from "react";
import FlexContainer from "./FlexContainer";

type Props = {
  children: React.ReactNode;
  className?: string;
};

const Wrapper = (props: Props) => {
  return (
    <div className={cn("px-5 py-10 md:px-10", props.className)}>
      <FlexContainer variant="column-start" gap="4xl">
        {props.children}
      </FlexContainer>
    </div>
  );
};

export default Wrapper;
