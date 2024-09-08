import Wrapper from "@/components/Wrapper";
import React from "react";

type Props = {};

const Page = (props: Props) => {
  return (
    <Wrapper className="pb-20">
      <h1 className="font-giest-sans text-4xl font-semibold">
        Career at LegalCyfle
      </h1>
      <p className="max-w-3xl font-giest-mono text-lg text-gray-700 dark:text-gray-300">
        LegalCyfle prides itself on fostering a collaborative and inclusive work
        environment where creativity thrives, and individuals are empowered to
        reach their full potential.
        <br />
        <br /> we highly appreciate your interest of working with us. Currently,
        we are only providing internships on monthly basis to law students and
        if any job vacancy comes will be updated here.
        <br />
        <br />
        Send your CV along with a brief cover letter or email letter at{" "}
        <a href="mailto:career@legalcyfle.in" className="text-green-500">
          career@legalcyfle.in
        </a>{" "}
        seeking an internship opportunity at LegalCyfle.
      </p>
    </Wrapper>
  );
};

export default Page;
