import FlexContainer from "@/components/FlexContainer";
import Image from "next/image";
import React from "react";

type Props = {};

const Page = (props: Props) => {
  return (
    <FlexContainer variant="column-start" gap="3xl" className="px-10 py-20">
      <h1 className="font-poppins text-4xl font-semibold">About Us</h1>
      <p className="max-w-5xl font-rubik text-xl text-gray-400">
        LegalCyfle is an online platform, run by a group of passionate lawyers,
        which aims to provide legal education and updates. The goal is to
        disseminate the legal knowledge and provide the best of the legal
        contents, suggestions and solutions such as article publication,
        internships and opportunities. We starve to enhance skills of students
        by organizing events such as webinar, conference etc. In addition to the
        above, we are very open in networking with like-minded individuals.
      </p>

      <h2 className="my-5 text-center font-poppins text-3xl font-semibold">
        Our Team
      </h2>
      <FlexContainer variant="row-center" className="gap-14">
        <FlexContainer variant="column-center" className="col-span-1">
          <Image
            src="https://picsum.photos/200/300?random=1"
            alt="Team Member"
            className="h-36 w-36 rounded-[200px] object-cover object-center"
            width={200}
            height={200}
          />
          <h3 className="text-xl font-semibold">Dr. Tufail Ahmad</h3>
          <p className="text-gray-400">Advisor</p>
        </FlexContainer>
        <FlexContainer variant="column-center" className="col-span-1">
          <Image
            src="https://picsum.photos/200/300?random=2"
            alt="Team Member"
            className="h-36 w-36 rounded-[200px] object-cover object-center"
            width={200}
            height={200}
          />
          <h3 className="text-xl font-semibold">Mohd Fuzail Khan</h3>
          <p className="text-gray-400">Advisor</p>
        </FlexContainer>
        <FlexContainer variant="column-center" className="col-span-1">
          <Image
            src="https://picsum.photos/200/300?random=3"
            alt="Team Member"
            className="h-36 w-36 rounded-[200px] object-cover object-center"
            width={200}
            height={200}
          />
          <h3 className="text-xl font-semibold">Dr. Asif Iqubal Shah</h3>
          <p className="text-gray-400">Advisor</p>
        </FlexContainer>
        <FlexContainer variant="column-center" className="col-span-1">
          <Image
            src="https://picsum.photos/200/300?random=4"
            alt="Team Member"
            className="h-36 w-36 rounded-[200px] object-cover object-center"
            width={200}
            height={200}
          />
          <h3 className="text-xl font-semibold">Dr. Aijaj Ahmed Raj</h3>
          <p className="text-gray-400">Advisor</p>
        </FlexContainer>
      </FlexContainer>
      <FlexContainer variant="row-center" className="gap-14">
        <FlexContainer variant="column-center" className="col-span-1">
          <Image
            src="https://picsum.photos/200/300?random=1"
            alt="Team Member"
            className="h-36 w-36 rounded-[200px] object-cover object-center"
            width={200}
            height={200}
          />
          <h3 className="text-xl font-semibold">Advocate Nitin Bhandare</h3>
          <p className="text-gray-400">Advisor</p>
        </FlexContainer>
        <FlexContainer variant="column-center" className="col-span-1">
          <Image
            src="https://picsum.photos/200/300?random=2"
            alt="Team Member"
            className="h-36 w-36 rounded-[200px] object-cover object-center"
            width={200}
            height={200}
          />
          <h3 className="text-xl font-semibold">Souvik Ghosh</h3>
          <p className="text-gray-400">Advisor</p>
        </FlexContainer>
        <FlexContainer variant="column-center" className="col-span-1">
          <Image
            src="https://picsum.photos/200/300?random=3"
            alt="Team Member"
            className="h-36 w-36 rounded-[200px] object-cover object-center"
            width={200}
            height={200}
          />
          <h3 className="text-xl font-semibold">Latifur Rahman</h3>
          <p className="text-gray-400">Media & PR Head</p>
        </FlexContainer>
      </FlexContainer>
    </FlexContainer>
  );
};

export default Page;
