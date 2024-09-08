import React from "react";

type Props = {
  children: React.ReactNode;
};

const Heading = (props: Props) => {
  return <h1 className="font-giest-sans text-4xl">{props.children}</h1>;
};

export default Heading;
