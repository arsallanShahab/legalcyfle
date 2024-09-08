import Wrapper from "@/components/Wrapper";
import React from "react";

type Props = {};

const Page = (props: Props) => {
  return (
    <Wrapper>
      <h1 className="font-giest-sans text-4xl font-semibold">
        Write Post for LegalCyfle
      </h1>
      <p className="max-w-3xl font-giest-mono text-lg text-gray-700 dark:text-gray-300">
        LegalCyfle is a platform for law students, lawyers, and legal
        professionals to share their knowledge and experience with the legal
        community. If you are interested in writing a post for LegalCyfle,
        please send your article to{" "}
        <a href="mailto:publish@legalcyfle.in" className="text-green-500">
          publish@legalcyfle.in
        </a>
        . We will review your article and publish it on our platform.
      </p>
      <h3 className="mt-8 font-giest-sans text-2xl font-semibold">
        Guidelines for writing an article (Article/Blog/Law Notes/Case Analysis
        )
      </h3>
      <ul className="max-w-5xl list-inside list-disc space-y-5 font-giest-sans text-lg text-gray-700 dark:text-gray-300">
        <li>
          <strong className="mr-2">Originality:</strong>
          We only accept original content that has not been published elsewhere.
          Plagiarized or duplicate or AI generated content will not be
          considered. And authors also have to submit a plagiarism report (for
          articles only), of not more than 15%, as well.
        </li>

        <li>
          <strong className="mr-2">Quality:</strong> We value high-quality
          writing that is engaging, well-researched, and well-written. Proofread
          your content for grammar, spelling, and punctuation errors before
          submission.
        </li>
        <li>
          <strong className="mr-2">Length:</strong> Aim for a word count of
          minimum 2000words. However, we prioritize substance over length, so
          make sure your post is comprehensive and informative.
        </li>
        <li>
          <strong className="mr-2">Formatting:</strong> Please format your post
          for readability. Use subheadings, bullet points, and short paragraphs
          to break up the text. Include images, videos, or other multimedia if
          relevant.
        </li>
        <li>
          <strong className="mr-2">Attribution:</strong> If you include any
          statistics, quotes, or references, make sure to properly attribute
          them to the original source. Provide links to credible sources
          whenever possible. All the references should follow the Indian Law
          Institute (ILI) citation style.
        </li>
        <li>
          <strong className="mr-2">Images:</strong> If you include images in
          your post, ensure that you have the right to use them. Provide proper
          attribution for images that are not your own and include image
          captions where necessary.
        </li>
        <li>
          <strong className="mr-2">Submission Process:</strong> Send your post
          as a Word document or Google Doc to publish@legalcyfle.in with the
          subject line “Guest Post Submission – [Your Post Title]”. Include any
          relevant images as attachments or provide links to them within the
          document. We will review your submission and get back to you.
        </li>
        <li>
          <strong className="mr-2">Editing:</strong> We reserve the right to
          edit your post for clarity, grammar, and formatting. We’ll notify you
          of any significant changes before publishing.
        </li>
        <li>
          <strong className="mr-2">Exclusivity:</strong> Once your post is
          published on our blog, we request that you do not republish it
          elsewhere. You may, however, share a link to the published post on
          your own website or social media platforms.
        </li>
        <li>
          <strong className="mr-2">Certificates:</strong> Certificates shall be
          issued against articles only. Although, the credit or author’s profile
          after each post is for all type of posts, articles, blogs, Law Notes,
          etc.
        </li>
        <li>
          By submitting a post to LegalCyfle, you acknowledge that you have read
          and agreed to abide by these guidelines. We look forward to receiving
          your submission and working with you to create valuable content for
          our readers.
        </li>
      </ul>
      <h3 className="mt-8 font-giest-sans text-2xl font-semibold">
        Format/Guidelines for posting internship and other opportunities.
      </h3>
      <p className="max-w-4xl font-giest-mono text-lg text-gray-700 dark:text-gray-300">
        The prior objective of LegalCyfle is to disseminate the notification of
        legal internships and other legal opportunities to the law students at
        the earliest. So, any of such notification from any organisation,
        college, law-firm or advocate will be highly appreciated. However, you
        are requested to provide the below details for convenience and clarity.
      </p>
      <ol className="max-w-5xl list-inside list-disc space-y-5 font-giest-sans text-lg text-gray-700 dark:text-gray-300">
        <li>
          A short intro about you or your organisation and also about the
          opportunity.
        </li>
        <li>Eligibility and other guidelines pertaining to the same.</li>
        <li>Deadline and contact info.</li>
        <li>
          Application/Submission/Registration or other relevant procedure.
        </li>
        <li>Brochure or any official link.</li>
      </ol>
      <p className="max-w-4xl font-giest-mono text-lg text-gray-700 dark:text-gray-300">
        *For any query or doubt, please feel free to contact us on
        Contact@legalcyfle.in.
        <br />
        <br />
        We are looking forward to your valuable contribution to the legal
        community. Thank you for your interest in writing for LegalCyfle!
      </p>
    </Wrapper>
  );
};

export default Page;
