import FlexContainer from "@/components/FlexContainer";
import Heading from "@/components/Heading";
import Wrapper from "@/components/Wrapper";
import React from "react";

type Props = {};

const Index = (props: Props) => {
  return (
    <Wrapper>
      <Heading>Privacy Policy</Heading>
      <p className="max-w-3xl font-giest-mono text-lg text-gray-700 dark:text-gray-300">
        This Privacy Policy outlines how LegalCyfle collects, uses, discloses,
        and protects your personal information when you use our website. Please
        read this policy carefully to understand our practices regarding your
        data.
      </p>
      <FlexContainer variant="column-start" gap="sm">
        <p className="max-w-3xl font-giest-mono text-lg text-gray-700 dark:text-gray-300">
          <strong>1. Information We Collect.</strong>
        </p>
        <p className="max-w-3xl font-giest-mono text-lg text-gray-700 dark:text-gray-300">
          We may collect personal information, such as your name, email address,
          contact details, and any other information you provide voluntarily
          when using our website or services. We may also collect non-personal
          information such as browser type, IP address, and other technical
          details.
        </p>
      </FlexContainer>
      <FlexContainer variant="column-start" gap="sm">
        <p className="max-w-3xl font-giest-mono text-lg text-gray-700 dark:text-gray-300">
          <strong>2. How We Use Your Information.</strong>
        </p>
        <p className="max-w-3xl font-giest-mono text-lg text-gray-700 dark:text-gray-300">
          We use the collected information for various purposes, including: –
          Providing and personalizing our services. – Responding to your
          inquiries and providing customer support. – Improving our website and
          services. – Sending periodic emails, newsletters, or updates.
        </p>
      </FlexContainer>
      <FlexContainer variant="column-start" gap="sm">
        {" "}
        <p className="max-w-3xl font-giest-mono text-lg text-gray-700 dark:text-gray-300">
          <strong>3. Cookies and Tracking Technologies.</strong>
        </p>
        <p className="max-w-3xl font-giest-mono text-lg text-gray-700 dark:text-gray-300">
          We use cookies and similar tracking technologies to enhance your
          experience on our website. These technologies help us analyze user
          behavior, manage user sessions, and personalize content. You can
          control the use of cookies through your browser settings.
        </p>
      </FlexContainer>

      <FlexContainer variant="column-start" gap="sm">
        <p className="max-w-3xl font-giest-mono text-lg text-gray-700 dark:text-gray-300">
          <strong>4. Third-Party Links.</strong>
        </p>
        <p className="max-w-3xl font-giest-mono text-lg text-gray-700 dark:text-gray-300">
          Our website may contain links to third-party websites. Please note
          that we are not responsible for the privacy practices or content of
          these third-party sites. We encourage you to review the privacy
          policies of these websites.
        </p>
      </FlexContainer>

      <FlexContainer variant="column-start" gap="sm">
        <p className="max-w-3xl font-giest-mono text-lg text-gray-700 dark:text-gray-300">
          5. Data Security.
        </p>
        <p className="max-w-3xl font-giest-mono text-lg text-gray-700 dark:text-gray-300">
          We employ industry-standard security measures to safeguard your
          personal information. However, no method of transmission over the
          internet or electronic storage is entirely secure. Therefore, while we
          strive to protect your data, we cannot guarantee its absolute
          security.
        </p>
      </FlexContainer>

      <FlexContainer variant="column-start" gap="sm">
        <p className="max-w-3xl font-giest-mono text-lg text-gray-700 dark:text-gray-300">
          <strong>6. Sharing Your Information.</strong>
        </p>
        <p className="max-w-3xl font-giest-mono text-lg text-gray-700 dark:text-gray-300">
          We do not sell, trade, or otherwise transfer your personally
          identifiable information to third parties without your consent, except
          as described in this Privacy Policy. We may share information with
          trusted third parties who assist us in operating our website or
          servicing you.
        </p>
      </FlexContainer>

      <FlexContainer variant="column-start" gap="sm">
        <p className="max-w-3xl font-giest-mono text-lg text-gray-700 dark:text-gray-300">
          <strong>7. Children’s Privacy.</strong>
        </p>
        <p className="max-w-3xl font-giest-mono text-lg text-gray-700 dark:text-gray-300">
          Our website is not intended for individuals under the age of 13. We do
          not knowingly collect personal information from children. If you
          believe that we have inadvertently collected information from a child,
          please contact us, and we will take steps to delete the information.
        </p>
      </FlexContainer>

      <FlexContainer variant="column-start" gap="sm">
        <p className="max-w-3xl font-giest-mono text-lg text-gray-700 dark:text-gray-300">
          <strong>8. Changes to the Privacy Policy.</strong>
        </p>
        <p className="max-w-3xl font-giest-mono text-lg text-gray-700 dark:text-gray-300">
          We reserve the right to modify this Privacy Policy at any time. Any
          changes will be effective immediately upon posting on our website. It
          is your responsibility to review this Privacy Policy periodically to
          stay informed about how we are protecting your information.
        </p>
      </FlexContainer>

      <FlexContainer variant="column-start" gap="sm">
        <p className="max-w-3xl font-giest-mono text-lg text-gray-700 dark:text-gray-300">
          <strong>9. Contact Information.</strong>
        </p>
        <p className="max-w-3xl font-giest-mono text-lg text-gray-700 dark:text-gray-300">
          If you have any questions or concerns about our Privacy Policy, please
          contact us{" "}
          <a href="mailto:contact@legalcyfle.in" className="text-green-500">
            contact@legalcyfle.in
          </a>{" "}
          By using our website, you consent to the terms outlined in this
          Privacy Policy. Last updated [05 Jan 2024]
        </p>
      </FlexContainer>
    </Wrapper>
  );
};

export default Index;
