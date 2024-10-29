import FlexContainer from "@/components/FlexContainer";
import Heading from "@/components/Heading";
import Wrapper from "@/components/Wrapper";
import Image from "next/image";
import React from "react";

type Props = {};

const Page = (props: Props) => {
  return (
    <Wrapper>
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
      <div className="grid gap-5 md:grid-cols-3">
        <ImageCard
          src="/tufail-sir.png"
          title="Dr. Tufail Ahmad"
          subtitle="Advisor"
        />

        <ImageCard
          src="/fuzail-sir.jpg"
          title="Mohd Fuzail Khan"
          subtitle="Advisor"
        />

        <ImageCard
          src="/asif-iqbal.png"
          title="Dr. Asif Iqubal Shah"
          subtitle="Advisor"
        />

        <ImageCard
          src="/aijaj-sir.png"
          title="Dr. Aijaj Ahmed Raj"
          subtitle="Advisor"
        />

        {/* <ImageCard
          src="/nitin-sir.png"
          title="Advocate Nitin Bhandare"
          subtitle="Advisor"
        /> */}

        <ImageCard
          src="/souvik-sir.png"
          title="Souvik Ghosh"
          subtitle="Advisor"
        />

        <ImageCard
          src="/deeba-maam.png"
          title="Deeba Maam"
          subtitle="Advisor"
        />
      </div>
      <p className="font-giest-mono text-2xl text-zinc-600 dark:text-zinc-400">
        Our PR Team
      </p>
      <div className="grid gap-5 md:grid-cols-3">
        <ImageCard
          src="/latifur-rahman.png"
          title="Latifur Rahman"
          subtitle="Media & PR Head"
        />
      </div>
    </Wrapper>
  );
};

interface ImageCardProps {
  src: string;
  title: string;
  subtitle: string;
}

const ImageCard = ({ src, title, subtitle }: ImageCardProps) => {
  return (
    <FlexContainer
      variant="column-start"
      gap="sm"
      className="rounded-[25px] border bg-zinc-100 p-1.5 pb-5 text-center dark:bg-zinc-800"
    >
      <div className="h-40 overflow-hidden rounded-[20px] border bg-black">
        <Image
          src={src}
          alt="Team Member"
          className="h-full w-full object-cover object-center"
          width={200}
          height={200}
        />
      </div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-gray-400">{subtitle}</p>
    </FlexContainer>
  );
};

export default Page;
