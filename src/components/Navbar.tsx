import { useGlobalContext } from "@/context/GlobalContext";
import IUser from "@/types/global/user";
import {
  DropdownMenu,
  DropdownTrigger,
  Input,
  Dropdown as NextUiDropdown,
  DropdownItem as NextUiDropdownItem,
} from "@nextui-org/react";
import {
  CircleEllipsis,
  LayoutGrid,
  Loader2,
  Menu,
  Search,
  SquareChevronRight,
} from "lucide-react";
import Link from "next/link";
import { Router, useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Avatar, { AvatarFullConfig, genConfig } from "react-nice-avatar";
import DarkModeToggle from "./DarkModeToggle";
import { Dropdown, DropdownContent, DropdownItem } from "./Dropdown";
import FlexContainer from "./FlexContainer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

const QUICK_LINKS = [
  {
    label: "Jobs",
    href: "/jobs",
    icon: null,
  },
  {
    label: "Internships",
    href: "/internships",
    icon: null,
  },
  {
    label: "Competitions",
    href: "/competitions",
    icon: null,
  },
  {
    label: "Call for Papers",
    href: "/call-for-papers",
    icon: null,
  },
  {
    label: "Blog",
    href: "/blog",
    icon: null,
  },
  {
    label: "News",
    href: "/news",
    icon: null,
  },
  {
    label: "Books",
    href: "/books",
    icon: null,
  },
  {
    label: "Articles",
    href: "/articles",
    icon: null,
  },
  {
    label: "Videos",
    href: "/videos",
    icon: null,
  },
  {
    label: "Podcasts",
    href: "/podcasts",
    icon: null,
  },
  {
    label: "Webinars",
    href: "/webinars",
    icon: null,
  },
  {
    label: "Courses",
    href: "/courses",
    icon: null,
  },
  {
    label: "Conferences",
    href: "/conferences",
    icon: null,
  },
  {
    label: "Seminars",
    href: "/seminars",
    icon: null,
  },
  {
    label: "Workshops",
    href: "/workshops",
    icon: null,
  },
  {
    label: "Events",
    href: "/events",
    icon: null,
  },
  {
    label: "LegalTech",
    href: "/legaltech",
    icon: null,
  },
  {
    label: "Legal Design",
    href: "/legal-design",
    icon: null,
  },
  {
    label: "Legal Research",
    href: "/legal-research",
    icon: null,
  },
  {
    label: "Legal Writing",
    href: "/legal-writing",
    icon: null,
  },
  {
    label: "Legal Marketing",
    href: "/legal-marketing",
    icon: null,
  },
  {
    label: "Legal Operations",
    href: "/legal-operations",
    icon: null,
  },
  {
    label: "Legal Innovation",
    href: "/legal-innovation",
    icon: null,
  },
  {
    label: "Legal Education",
    href: "/legal-education",
    icon: null,
  },
  {
    label: "Legal Jobs",
    href: "/legal-jobs",
    icon: null,
  },
];

type Props = {
  // user: IUser | null;
};

const Navbar = (_props: Props) => {
  const { user, setUser, loading, setLoading } = useGlobalContext();
  const [avatarConfig, setAvatarConfig] = useState<AvatarFullConfig | null>(
    null,
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const path = router.pathname;
  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "GET",
      });
      const data = await res.json();
      if (data.success) {
        setUser(null);
        router.reload();
        toast.success(data.message);
      }
    } catch (error) {
      console.log(error, "error from navbar logout");
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await fetch("/api/auth/me", {
          method: "GET",
        });
        const data = await user.json();
        const config = genConfig(data?.firstName);
        setAvatarConfig(config);
        setUser(data.data);
      } catch (error) {
        console.log(error, "error from navbar fetch user");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setSidebarOpen(false);
  }, [router.asPath]);
  return (
    <>
      <FlexContainer
        variant="row-between"
        alignItems="center"
        className="sticky top-0 z-[900] h-[80px] border-b border-gray-200 bg-white px-5 py-5 dark:border-gray-700 dark:bg-gray-900 md:px-10"
      >
        <FlexContainer gap="2xl" alignItems="center">
          <Link
            href="/"
            className="text-xl font-bold text-gray-900 dark:text-white"
          >
            LegalCyfle
          </Link>
          <FlexContainer className="hidden items-center *:text-xs *:font-bold *:uppercase *:tracking-wider lg:flex">
            <Link
              href="/category/publications"
              className="px-3 py-2 text-gray-700 transition-colors duration-200 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              Publications
            </Link>
            <Dropdown title="Opportunities">
              <DropdownContent>
                <DropdownItem href="/category/internships">
                  Internships
                </DropdownItem>
                <DropdownItem href="/category/jobs">Jobs</DropdownItem>
                <DropdownItem href="/category/competitions">
                  Competitions
                </DropdownItem>
                <DropdownItem href="/category/call-for-papers">
                  Call for papers
                </DropdownItem>
              </DropdownContent>
            </Dropdown>
            <Link
              href="/jobs"
              className="px-3 py-2 text-gray-700 transition-colors duration-200 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              Jobs
            </Link>
            <Link
              href="/internships"
              className="px-3 py-2 text-gray-700 transition-colors duration-200 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              Internships
            </Link>
            <Dropdown title="Resources">
              <DropdownContent>
                <DropdownItem href="/category/blogs">Blog</DropdownItem>
                <DropdownItem href="/category/news">News</DropdownItem>
                <DropdownItem href="/category/law-notes">
                  Law Notes
                </DropdownItem>
                <DropdownItem href="/category/case-analysis">
                  Case Analysis
                </DropdownItem>
              </DropdownContent>
            </Dropdown>
            <Link
              target="_blank"
              href="https://www.indiacode.nic.in/"
              className="px-3 py-2 text-gray-700 transition-colors duration-200 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              Bare Acts
            </Link>
            {/* <Link
              href="/journal"
              target="_blank"
              className="px-3 py-2 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors duration-200"
            >
              Journal
            </Link> */}
          </FlexContainer>
        </FlexContainer>
        <FlexContainer variant="row-end" alignItems="center" className="flex">
          <DarkModeToggle className="hidden sm:flex" />
          <Input
            placeholder="Search LegalCyfle"
            className="hidden md:flex"
            value={search}
            onValueChange={setSearch}
            startContent={
              <span
                onClick={() => {
                  router.push(`/search?q=${search}`);
                }}
              >
                <Search className="h-5 w-5" />
              </span>
            }
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                router.push(`/search?q=${search}`);
              }
            }}
          />
          {loading && (
            <div className="border border-gray-200 bg-white p-2 dark:border-gray-700 dark:bg-gray-900">
              <Loader2 className="h-4 w-4 animate-spin text-gray-600 dark:text-gray-400" />
            </div>
          )}
          {user && !loading && (
            <NextUiDropdown
              classNames={{
                content:
                  "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
              }}
            >
              <DropdownTrigger>
                <div className="hidden cursor-pointer items-center justify-center gap-3 border border-gray-200 bg-white p-2 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-600 dark:hover:bg-gray-800 sm:flex">
                  <Avatar
                    className="h-8 w-8"
                    {...genConfig({
                      sex: user.gender !== "male" ? "woman" : "man",
                    })}
                  />
                  <FlexContainer variant="column-start" gap="none">
                    <p className="text-nowrap text-sm font-semibold text-gray-900 dark:text-white">
                      {user.firstName + " " + user.lastName}
                    </p>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {user.username}
                    </span>
                  </FlexContainer>
                </div>
              </DropdownTrigger>
              <DropdownMenu aria-label="Static Actions">
                {/* <NextUiDropdownItem key="profile">Profile</NextUiDropdownItem> */}
                {/* <NextUiDropdownItem key="settings">Settings</NextUiDropdownItem> */}
                <NextUiDropdownItem
                  key="logout"
                  className="text-danger"
                  color="danger"
                  onPress={handleLogout}
                >
                  Logout
                </NextUiDropdownItem>
              </DropdownMenu>
            </NextUiDropdown>
          )}
          {!user && (
            <FlexContainer>
              <Link href={"/signup"}>
                <Button
                  variant={"ghost"}
                  className="hidden h-auto border-0 px-4 py-2 text-sm font-medium uppercase tracking-wider text-gray-700 transition-colors duration-200 hover:bg-transparent hover:text-gray-900 dark:text-gray-300 dark:hover:text-white md:inline-flex"
                >
                  Signup
                </Button>
              </Link>

              <Link href={"/login"}>
                <Button className="hidden h-auto border border-gray-200 bg-white px-4 py-2 text-sm font-medium uppercase tracking-wider text-gray-900 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:hover:border-gray-600 dark:hover:bg-gray-800 md:inline-flex">
                  Login
                </Button>
              </Link>
            </FlexContainer>
          )}

          <Sheet
            open={sidebarOpen}
            onOpenChange={(isOpen) => setSidebarOpen(isOpen)}
          >
            <SheetTrigger asChild>
              <button className="flex h-auto border border-gray-200 bg-white p-2 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-600 dark:hover:bg-gray-800 lg:hidden">
                <LayoutGrid className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              </button>
            </SheetTrigger>
            <SheetContent className="z-[910]">
              <SheetHeader className="space-y-0 text-left">
                {user && !loading && (
                  <NextUiDropdown
                    classNames={{
                      content:
                        "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
                    }}
                  >
                    <DropdownTrigger>
                      <div className="mt-5 flex cursor-pointer items-center justify-center gap-3 border border-gray-200 bg-white p-2 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-600 dark:hover:bg-gray-800">
                        <Avatar
                          className="h-10 w-10"
                          {...genConfig(user.firstName)}
                        />
                        <FlexContainer variant="column-start" gap="none">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {user.firstName + " " + user.lastName}
                          </p>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {user.username}
                          </span>
                        </FlexContainer>
                      </div>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Static Actions">
                      <NextUiDropdownItem
                        key="logout"
                        className="text-danger"
                        color="danger"
                        onPress={handleLogout}
                      >
                        Logout
                      </NextUiDropdownItem>
                    </DropdownMenu>
                  </NextUiDropdown>
                )}
              </SheetHeader>
              <FlexContainer
                variant="column-start"
                gap="none"
                className="z-[100] mt-7"
              >
                <Link
                  href="/category/publications"
                  className="border-b border-gray-200 py-3 text-sm font-medium uppercase tracking-wider text-gray-900 dark:border-gray-700 dark:text-gray-200"
                >
                  Publications
                </Link>
                <Link
                  target="_blank"
                  href="https://www.indiacode.nic.in/"
                  className="border-b border-gray-200 py-3 text-sm font-medium uppercase tracking-wider text-gray-900 dark:border-gray-700 dark:text-gray-200"
                >
                  Bare Acts
                </Link>
                <Accordion type="single">
                  <AccordionItem
                    value="item-1"
                    className="border-b border-gray-200 dark:border-gray-700"
                  >
                    <AccordionTrigger className="text-sm font-medium uppercase tracking-wider text-gray-900 dark:text-gray-200">
                      Opportunities
                    </AccordionTrigger>
                    <AccordionContent>
                      <FlexContainer
                        variant="column-start"
                        className="space-y-2 pb-3"
                      >
                        <Link
                          href="/category/jobs"
                          className="text-sm font-medium text-gray-700 transition-colors duration-200 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                        >
                          Jobs
                        </Link>
                        <Link
                          href="/category/internships"
                          className="text-sm font-medium text-gray-700 transition-colors duration-200 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                        >
                          Internships
                        </Link>
                        <Link
                          href="/category/competitions"
                          className="text-sm font-medium text-gray-700 transition-colors duration-200 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                        >
                          Competitions
                        </Link>
                        <Link
                          href="/category/call-for-papers"
                          className="text-sm font-medium text-gray-700 transition-colors duration-200 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                        >
                          Call for Papers
                        </Link>
                      </FlexContainer>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem
                    value="item-3"
                    className="border-b border-gray-200 dark:border-gray-700"
                  >
                    <AccordionTrigger className="text-sm font-medium uppercase tracking-wider text-gray-900 dark:text-gray-200">
                      Resources
                    </AccordionTrigger>
                    <AccordionContent>
                      <FlexContainer
                        variant="column-start"
                        className="space-y-2 pb-3"
                      >
                        <Link
                          href="/category/blogs"
                          className="text-sm font-medium text-gray-700 transition-colors duration-200 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                        >
                          Blogs
                        </Link>
                        <Link
                          href="/category/news"
                          className="text-sm font-medium text-gray-700 transition-colors duration-200 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                        >
                          News
                        </Link>
                        <Link
                          href="/category/law-notes"
                          className="text-sm font-medium text-gray-700 transition-colors duration-200 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                        >
                          Law Notes
                        </Link>
                        <Link
                          href="/category/case-analysis"
                          className="text-sm font-medium text-gray-700 transition-colors duration-200 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                        >
                          Case Analysis
                        </Link>
                      </FlexContainer>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                <Link
                  href="/internships"
                  className="mb-3 py-3 text-sm font-medium uppercase tracking-wider text-gray-900 dark:text-gray-200"
                >
                  Internships
                </Link>
                <Link
                  href="/jobs"
                  className="mb-3 py-3 text-sm font-medium uppercase tracking-wider text-gray-900 dark:text-gray-200"
                >
                  Jobs
                </Link>
                <Input
                  placeholder="Search LegalCyfle"
                  className="w-full"
                  value={search}
                  onValueChange={setSearch}
                  startContent={
                    <span
                      onClick={() => {
                        router.push(`/search?q=${search}`);
                      }}
                    >
                      <Search className="h-5 w-5" />
                    </span>
                  }
                  onKeyUp={(e) => {
                    if (e.key === "Enter") {
                      router.push(`/search?q=${search}`);
                    }
                  }}
                />
                <Link href={"/login"} className="mt-3 w-full">
                  <Button className="h-auto w-full border border-gray-200 bg-white px-4 py-3 text-sm font-medium uppercase tracking-wider text-gray-900 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:hover:border-gray-600 dark:hover:bg-gray-800">
                    Login
                  </Button>
                </Link>
                <FlexContainer
                  variant="row-between"
                  alignItems="center"
                  className="z-[100] mt-5 border-t border-gray-200 pt-5 dark:border-gray-700"
                >
                  <span className="text-sm font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    Toggle Theme
                  </span>
                  <DarkModeToggle className="z-[920]" />
                </FlexContainer>
              </FlexContainer>
            </SheetContent>
          </Sheet>
        </FlexContainer>
      </FlexContainer>
      {/* <FlexContainer
        gap="xl"
        alignItems="center"
        className="border-y px-10 py-2.5 dark:border-zinc-800"
      >
        <h3 className="text-sm font-semibold">Quick Links</h3>
        <FlexContainer gap="md" className="flex-wrap">
          {QUICK_LINKS.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className="rounded-xl bg-zinc-100 px-2 py-1 text-xs font-medium hover:bg-zinc-200 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700 dark:hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </FlexContainer>
      </FlexContainer> */}
    </>
  );
};

export default Navbar;
