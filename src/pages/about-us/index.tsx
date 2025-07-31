import FlexContainer from "@/components/FlexContainer";
import Heading from "@/components/Heading";
import Wrapper from "@/components/Wrapper";
import client from "@/lib/contentful";
import { formatImageLink } from "@/lib/utils";
import { Author } from "@/types/contentful/author";
import { Accordion, AccordionItem } from "@nextui-org/react";
import { User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Props {
  authors: { [key: string]: Author[] };
}

const Page = (props: Props) => {
  console.log(props.authors);
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
      {Object.entries(props.authors).map(([type, authors]) => (
        <Accordion key={type} variant="shadow">
          <AccordionItem
            title={type.replace(/-/g, " ").toUpperCase()}
            subtitle={`${authors.length} Members`}
          >
            <div className="grid gap-5 md:grid-cols-2">
              {authors.map((author) => (
                <Link href={`/author/${author.sys.id}`} key={author.sys.id}>
                  <div className="flex gap-4 rounded-lg border bg-zinc-50 p-4 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800">
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-full border bg-zinc-100 dark:bg-zinc-800">
                      {author.fields.avatar ? (
                        <Image
                          src={formatImageLink(
                            author.fields.avatar.fields.file.url,
                          )}
                          alt={author.fields.name}
                          className="h-full w-full object-cover"
                          width={80}
                          height={80}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-zinc-400">
                          <User className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold">
                        {author.fields.name}
                      </h4>
                      {author.fields.bio && (
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                          {author.fields.bio.length > 100
                            ? `${author.fields.bio.slice(0, 100)}...`
                            : author.fields.bio}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </AccordionItem>
        </Accordion>
      ))}
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

export const getStaticProps = async () => {
  const response = await client.getEntries({
    content_type: "author",
  });
  const authors = response.items as Author[];
  const groupByType = (authors: Author[]) => {
    return authors.reduce(
      (acc, author) => {
        const type = author.fields.type as string;
        if (!acc[type]) {
          acc[type] = [];
        }
        acc[type].push(author);
        return acc;
      },
      {} as { [key: string]: Author[] },
    );
  };
  return {
    props: { authors: groupByType(authors) },
    // revalidate: 60, // Revalidate every 60 seconds
  };
};

export default Page;
