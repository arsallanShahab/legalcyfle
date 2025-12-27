"use client";

import { useGlobalContext } from "@/context/GlobalContext";
import { SocialLinks } from "@/lib/constants";
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
import { cn } from "@/lib/utils";
import { lora, playfair } from "@/lib/fonts";

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
    <FlexContainer
      variant="column-start"
      gap="none"
      className="mx-auto max-w-7xl"
    >
      {pathname === "/" && (
        <div className="w-full border-t-4 border-black bg-gray-50 px-5 py-12 dark:border-white dark:bg-gray-900 md:px-10">
          <div className="max-w-4xl text-left">
            <h3
              className={cn(
                "mb-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white",
                playfair.className,
              )}
            >
              Disclaimer
            </h3>
            <div
              className={cn(
                "space-y-4 text-lg leading-relaxed text-gray-700 dark:text-gray-300",
                lora.className,
              )}
            >
              <p>
                LegalCyfle is a platform for legal professionals to share their
                knowledge and insights. The information provided on this
                platform is for educational purposes only. It should not be
                considered as legal advice. Please consult with a legal
                professional for specific legal advice.
              </p>
              <p>
                Furthermore, all articles featured on LegalCyfle represent the
                exclusive opinions and views of the respective guest writers,
                and do not reflect the opinions or views of LegalCyfle, its
                editor, or its team.
              </p>
            </div>
          </div>
        </div>
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
      <footer className="w-full border-t border-gray-200 bg-white pt-16 dark:border-gray-800 dark:bg-gray-950">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-5 pb-12 md:grid-cols-2 md:px-10 lg:grid-cols-5 lg:gap-8">
          {/* Brand Column */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            <Link
              href="/"
              className={cn(
                "text-4xl font-black tracking-tighter text-black dark:text-white",
                playfair.className,
              )}
            >
              LegalCyfle
            </Link>
            <p className="font-lora max-w-sm text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              LegalCyfle is a platform for legal professionals to share their
              knowledge and insights. The information provided on this platform
              is for educational purposes only.
            </p>
            <div className="flex gap-4">
              {Object.keys(SocialLinks).map((key) => {
                const Icon = SocialLinks[key].icon;
                return (
                  <Link
                    key={key}
                    target="_blank"
                    href={SocialLinks[key].url}
                    className="group flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition-all hover:border-black hover:bg-black hover:text-white dark:border-gray-800 dark:text-gray-400 dark:hover:border-white dark:hover:bg-white dark:hover:text-black"
                  >
                    <Icon className="h-4 w-4 fill-current" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Links Column 1: Opportunities */}
          <div className="flex flex-col gap-6">
            <h4
              className={cn(
                "text-lg font-bold tracking-wide text-black dark:text-white",
                playfair.className,
              )}
            >
              Opportunities
            </h4>
            <div className="flex flex-col gap-3">
              {[
                { label: "Internships", href: "/category/internships" },
                { label: "Jobs", href: "/category/jobs" },
                { label: "Competitions", href: "/category/competitions" },
                { label: "Call for Papers", href: "/category/call-for-papers" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-sans text-sm font-medium text-gray-600 transition-colors hover:text-black dark:text-gray-400 dark:hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Links Column 2: Company */}
          <div className="flex flex-col gap-6">
            <h4
              className={cn(
                "text-lg font-bold tracking-wide text-black dark:text-white",
                playfair.className,
              )}
            >
              Company
            </h4>
            <div className="flex flex-col gap-3">
              {[
                { label: "About Us", href: "/about-us" },
                { label: "Contact Us", href: "/contact-us" },
                { label: "Privacy Policy", href: "/privacy-policy" },
                { label: "Terms of Service", href: "/disclaimer-and-terms" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-sans text-sm font-medium text-gray-600 transition-colors hover:text-black dark:text-gray-400 dark:hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Links Column 3: Resources & Misc */}
          <div className="flex flex-col gap-6">
            <h4
              className={cn(
                "text-lg font-bold tracking-wide text-black dark:text-white",
                playfair.className,
              )}
            >
              Resources
            </h4>
            <div className="flex flex-col gap-3">
              {[
                { label: "Blog", href: "/category/blogs" },
                { label: "News", href: "/category/news" },
                {
                  label: "Publish with Us",
                  href: "/write-post-for-legalcyfle",
                },
                { label: "Subscribe", href: "/subscribe" },
                { label: "Careers", href: "/work-with-us" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-sans text-sm font-medium text-gray-600 transition-colors hover:text-black dark:text-gray-400 dark:hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 bg-gray-50 py-8 dark:border-gray-800 dark:bg-black">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 md:flex-row md:px-10">
            <p className="font-sans text-xs font-bold uppercase tracking-widest text-gray-500">
              © {new Date().getFullYear()} LegalCyfle. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </FlexContainer>
  );
};

export default Footer;
