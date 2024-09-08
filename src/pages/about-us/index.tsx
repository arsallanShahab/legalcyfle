import FlexContainer from "@/components/FlexContainer";
import Heading from "@/components/Heading";
import Image from "next/image";
import React from "react";

type Props = {};

const Page = (props: Props) => {
  return (
    <FlexContainer
      variant="column-start"
      gap="3xl"
      className="px-5 py-10 lg:px-10 lg:py-20"
    >
      <Heading>About Us</Heading>
      <p className="max-w-3xl font-giest-mono text-lg text-gray-700 dark:text-gray-300">
        LegalCyfle is an online platform, run by a group of passionate lawyers,
        which aims to provide legal education and updates. The goal is to
        disseminate the legal knowledge and provide the best of the legal
        contents, suggestions and solutions such as article publication,
        internships and opportunities. We starve to enhance skills of students
        by organizing events such as webinar, conference etc. In addition to the
        above, we are very open in networking with like-minded individuals.
      </p>

      <Heading>Our Team</Heading>
      <p className="max-w-3xl font-giest-mono text-lg text-gray-700 dark:text-gray-300">
        Our team is a group of passionate lawyers and law students who are
        dedicated to providing the best legal content and opportunities to the
        legal community.
      </p>
      <p className="font-giest-mono text-2xl text-zinc-600 dark:text-zinc-400">
        Our Advisors
      </p>
      <div className="grid gap-5 md:grid-cols-3 lg:grid-cols-6">
        <FlexContainer
          variant="column-start"
          gap="sm"
          className="col-span-1 rounded-[50px] bg-zinc-100 p-1.5 pb-5 text-center dark:bg-zinc-800"
        >
          <Image
            src="https://picsum.photos/200/300?random=1"
            alt="Team Member"
            className="h-28 w-full rounded-[200px] object-cover object-center"
            width={200}
            height={200}
          />
          <h3 className="text-xl font-semibold">Dr. Tufail Ahmad</h3>
          <p className="text-gray-400">Advisor</p>
        </FlexContainer>
        <FlexContainer
          variant="column-start"
          gap="sm"
          className="col-span-1 rounded-[50px] bg-zinc-100 p-1.5 pb-5 text-center dark:bg-zinc-800"
        >
          <Image
            src="https://picsum.photos/200/300?random=2"
            alt="Team Member"
            className="h-28 w-full rounded-[200px] object-cover object-center"
            width={200}
            height={200}
          />
          <h3 className="text-xl font-semibold">Mohd Fuzail Khan</h3>
          <p className="text-gray-400">Advisor</p>
        </FlexContainer>
        <FlexContainer
          variant="column-start"
          gap="sm"
          className="col-span-1 rounded-[50px] bg-zinc-100 p-1.5 pb-5 text-center dark:bg-zinc-800"
        >
          <Image
            src="https://picsum.photos/200/300?random=3"
            alt="Team Member"
            className="h-28 w-full rounded-[200px] object-cover object-center"
            width={200}
            height={200}
          />
          <h3 className="text-xl font-semibold">Dr. Asif Iqubal Shah</h3>
          <p className="text-gray-400">Advisor</p>
        </FlexContainer>
        <FlexContainer
          variant="column-start"
          gap="sm"
          className="col-span-1 rounded-[50px] bg-zinc-100 p-1.5 pb-5 text-center dark:bg-zinc-800"
        >
          <Image
            src="https://picsum.photos/200/300?random=4"
            alt="Team Member"
            className="h-28 w-full rounded-[200px] object-cover object-center"
            width={200}
            height={200}
          />
          <h3 className="text-xl font-semibold">Dr. Aijaj Ahmed Raj</h3>
          <p className="text-gray-400">Advisor</p>
        </FlexContainer>
        <FlexContainer
          variant="column-start"
          gap="sm"
          className="col-span-1 rounded-[50px] bg-zinc-100 p-1.5 pb-5 text-center dark:bg-zinc-800"
        >
          <Image
            src="https://picsum.photos/200/300?random=1"
            alt="Team Member"
            className="h-28 w-full rounded-[200px] object-cover object-center"
            width={200}
            height={200}
          />
          <h3 className="text-xl font-semibold">Advocate Nitin Bhandare</h3>
          <p className="text-gray-400">Advisor</p>
        </FlexContainer>
        <FlexContainer
          variant="column-start"
          gap="sm"
          className="col-span-1 rounded-[50px] bg-zinc-100 p-1.5 pb-5 text-center dark:bg-zinc-800"
        >
          <Image
            src="https://picsum.photos/200/300?random=2"
            alt="Team Member"
            className="h-28 w-full rounded-[200px] object-cover object-center"
            width={200}
            height={200}
          />
          <h3 className="text-xl font-semibold">Souvik Ghosh</h3>
          <p className="text-gray-400">Advisor</p>
        </FlexContainer>
      </div>
      <p className="font-giest-mono text-2xl text-zinc-600 dark:text-zinc-400">
        Our PR Team
      </p>
      <div className="grid gap-5 md:grid-cols-3 lg:grid-cols-6">
        <FlexContainer
          variant="column-start"
          gap="sm"
          className="col-span-1 rounded-[50px] bg-zinc-100 p-1.5 pb-5 text-center dark:bg-zinc-800"
        >
          <Image
            src="https://picsum.photos/200/300?random=3"
            alt="Team Member"
            className="h-28 w-full rounded-[200px] object-cover object-center"
            width={200}
            height={200}
          />
          <h3 className="text-xl font-semibold">Latifur Rahman</h3>
          <p className="text-gray-400">Media & PR Head</p>
        </FlexContainer>
      </div>
    </FlexContainer>
  );
};

export default Page;
