"use client";

import { useGlobalContext } from "@/context/GlobalContext";
import useStorage from "@/lib/hooks/use-storage";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import React from "react";
import FlexContainer from "./FlexContainer";

const Footer = () => {
  const { setDisclaimerAccepted } = useGlobalContext();
  const { getItem, setItem } = useStorage({ storageType: "local" });
  const disclaimer = getItem("disclaimer") || "false";

  const pathname = usePathname();
  const { isOpen, onOpen, onOpenChange } = useDisclosure({
    defaultOpen: disclaimer === "false" ? true : false,
  });
  const router = useRouter();

  //if  not accepted then kick out the user
  const handleClose = () => {
    setItem("disclaimer", "false");
    //get the user off from the website
    router.push("/disclaimer-and-terms");
  };

  const handleAccept = () => {
    setItem("disclaimer", "true");
    setDisclaimerAccepted(true);
    onOpenChange();
  };

  return (
    <FlexContainer variant="column-start" gap="none">
      {pathname === "/" && (
        <FlexContainer
          variant="column-start"
          className="bg-gradient-to-bl from-purple-400 to-indigo-900 px-5 py-16 md:px-10"
        >
          <h3 className="font-rubik text-4xl font-semibold text-white">
            Disclaimer
          </h3>
          <p className="max-w-2xl text-medium text-white">
            LegalCyfle is a platform for legal professionals to share their
            knowledge and insights. The information provided on this platform is
            for educational purposes only. It should not be considered as legal
            advice. Please consult with a legal professional for specific legal
            advice.
          </p>
          <p className="max-w-2xl text-medium text-white">
            Furthermore, all articles featured on LegalCyfle represent the
            exclusive opinions and views of the respective guest writers, and do
            not reflect the opinions or views of LegalCyfle, its editor, or its
            team.
          </p>
        </FlexContainer>
      )}
      <Modal
        size="xl"
        backdrop="blur"
        isDismissable={false}
        hideCloseButton={true}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Disclaimer{" "}
                <span className="text-xs text-gray-500">LegalCyfle</span>
              </ModalHeader>
              <ModalBody>
                <p className="max-w-2xl text-medium">
                  LegalCyfle is a platform for legal professionals to share
                  their knowledge and insights. The information provided on this
                  platform is for educational purposes only. It should not be
                  considered as legal advice. Please consult with a legal
                  professional for specific legal advice.
                </p>
                <p className="max-w-2xl text-medium">
                  Furthermore, all articles featured on LegalCyfle represent the
                  exclusive opinions and views of the respective guest writers,
                  and do not reflect the opinions or views of LegalCyfle, its
                  editor, or its team.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={handleClose}>
                  Reject
                </Button>
                <Button color="primary" onPress={handleAccept}>
                  Accept
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <div className="bg-zinc-100 px-5 py-20 dark:bg-zinc-900 md:px-10 lg:px-20">
        <FlexContainer className="flex-col gap-10 md:flex-row md:gap-20">
          {/* <h3 className="font-rubik text-2xl font-semibold">Legal Cyfle</h3> */}
          <FlexContainer variant="column-start" gap="md">
            <h3 className="font-rubik text-lg font-semibold text-zinc-800 dark:text-zinc-200">
              Legal Cyfle
            </h3>
            <p className="max-w-xs text-sm text-zinc-600 dark:text-zinc-300">
              LegalCyfle is a platform for legal professionals to share their
              knowledge and insights. The information provided on this platform
              is for educational purposes only.
            </p>
          </FlexContainer>
          <FlexContainer variant="column-start" gap="md">
            <h3 className="text-sm font-semibold text-black dark:text-zinc-200">
              Opportunities
            </h3>
            <Link
              href="/category/internships"
              className="text-sm text-zinc-600 dark:text-zinc-300"
            >
              Internships
            </Link>
            <Link
              href="/category/jobs"
              className="text-sm text-zinc-600 dark:text-zinc-300"
            >
              Jobs
            </Link>
            <Link
              href="/category/competitions"
              className="text-sm text-zinc-600 dark:text-zinc-300"
            >
              Competitions
            </Link>
            <Link
              href="/category/call-for-papers"
              className="text-sm text-zinc-600 dark:text-zinc-300"
            >
              Call for papers
            </Link>
          </FlexContainer>
          <FlexContainer variant="column-start">
            <h3 className="text-sm font-semibold text-black dark:text-zinc-200">
              Company
            </h3>
            <Link
              href="/about-us"
              className="text-sm text-zinc-600 dark:text-zinc-300"
            >
              About Us
            </Link>
            <Link
              href="/contact-us"
              className="text-sm text-zinc-600 dark:text-zinc-300"
            >
              Contact Us
            </Link>
            <Link
              href="/privacy-policy"
              className="text-sm text-zinc-600 dark:text-zinc-300"
            >
              Privacy Policy
            </Link>
            <Link
              href="/disclaimer-and-terms"
              className="text-sm text-zinc-600 dark:text-zinc-300"
            >
              Terms of Service
            </Link>
          </FlexContainer>
          <FlexContainer variant="column-start" gap="md">
            <h3 className="text-sm font-semibold text-black dark:text-zinc-200">
              Resources
            </h3>
            <Link
              href="/category/blogs"
              className="text-sm text-zinc-600 dark:text-zinc-300"
            >
              Blog
            </Link>
            <Link
              href="/category/news"
              className="text-sm text-zinc-600 dark:text-zinc-300"
            >
              News
            </Link>
          </FlexContainer>

          <FlexContainer variant="column-start">
            <h3 className="text-sm font-semibold text-black dark:text-zinc-200">
              Miscellaneous
            </h3>

            <Link
              href="/write-post-for-legalcyfle"
              className="text-sm text-zinc-600 dark:text-zinc-300"
            >
              Publish on LegalCyfle
            </Link>
            <Link
              href="/subscribe"
              className="text-sm text-zinc-600 dark:text-zinc-300"
            >
              Subscribe
            </Link>
            <Link
              href="/work-with-us"
              className="text-sm text-zinc-600 dark:text-zinc-300"
            >
              Careers
            </Link>
          </FlexContainer>
        </FlexContainer>
      </div>
    </FlexContainer>
  );
};

export default Footer;
