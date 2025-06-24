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
        className="sticky top-0 z-[900] h-[80px] border-b bg-zinc-50 px-5 py-5 dark:border-zinc-800 dark:bg-zinc-900 md:px-10"
      >
        <FlexContainer gap="2xl" alignItems="center">
          <Link href="/" className="font-work text-xl font-bold text-green-600">
            LegalCyfle
          </Link>
          <FlexContainer className="hidden *:rounded-lg *:font-rubik *:text-sm *:font-medium lg:flex">
            <Link
              href="/category/publications"
              className="px-2 py-1 hover:bg-zinc-100 dark:hover:bg-zinc-800"
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
            <Dropdown title="Blogs & News">
              <DropdownContent>
                <DropdownItem href="/category/blogs">Blog</DropdownItem>
                <DropdownItem href="/category/news">News</DropdownItem>
              </DropdownContent>
            </Dropdown>
            <Dropdown title="Resources">
              <DropdownContent>
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
              className="px-2 py-1 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              India Code
            </Link>
            <Link
              href="/internships"
              className="px-2 py-1 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              Internships
            </Link>
            {/* <Link
              href="/journal"
              target="_blank"
              className="px-2 py-1 hover:bg-zinc-100 dark:hover:bg-zinc-800"
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
            <div className="rounded-xl bg-zinc-100 p-2">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          )}
          {user && !loading && (
            <NextUiDropdown
              classNames={{ content: "bg-white dark:bg-zinc-800" }}
            >
              <DropdownTrigger>
                <div className="hidden cursor-pointer items-center justify-center gap-3 rounded-2xl bg-zinc-100 p-2 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 sm:flex">
                  <Avatar
                    className="h-8 w-8"
                    {...genConfig({
                      sex: user.gender !== "male" ? "woman" : "man",
                    })}
                  />
                  <FlexContainer variant="column-start" gap="none">
                    <p className="text-nowrap text-sm font-semibold">
                      {user.firstName + " " + user.lastName}
                    </p>
                    <span className="text-xs text-gray-500">
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
                  className="hidden h-auto rounded-xl py-2.5 md:inline-flex"
                >
                  Signup
                </Button>
              </Link>

              <Link href={"/login"}>
                <Button className="hidden h-auto rounded-xl py-2.5 md:inline-flex">
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
              <button className="flex h-auto rounded-md bg-zinc-50 p-2 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 lg:hidden">
                <LayoutGrid className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent className="z-[910]">
              <SheetHeader className="space-y-0 text-left">
                {user && !loading && (
                  <NextUiDropdown
                    classNames={{ content: "bg-white dark:bg-zinc-800" }}
                  >
                    <DropdownTrigger>
                      <div className="mt-5 flex cursor-pointer items-center justify-center gap-3 rounded-2xl bg-zinc-100 p-2 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800">
                        <Avatar
                          className="h-10 w-10"
                          {...genConfig(user.firstName)}
                        />
                        <FlexContainer variant="column-start" gap="none">
                          <p className="text-sm font-semibold">
                            {user.firstName + " " + user.lastName}
                          </p>
                          <span className="text-xs text-gray-500">
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
                  className="border-b py-3 text-sm font-medium text-black dark:text-zinc-200"
                >
                  Publications
                </Link>
                <Link
                  target="_blank"
                  href="https://www.indiacode.nic.in/"
                  className="border-b py-3 text-sm font-medium text-black dark:text-zinc-200"
                >
                  Bare Acts
                </Link>
                <Accordion type="single">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Oppurtunities</AccordionTrigger>
                    <AccordionContent>
                      <FlexContainer variant="column-start">
                        <Link
                          href="/category/jobs"
                          className="text-sm text-zinc-700 dark:text-zinc-200"
                        >
                          Jobs
                        </Link>
                        <Link
                          href="/category/internships"
                          className="text-sm text-zinc-700 dark:text-zinc-200"
                        >
                          Internships
                        </Link>
                        <Link
                          href="/category/competitions"
                          className="text-sm text-zinc-700 dark:text-zinc-200"
                        >
                          Competitions
                        </Link>
                        <Link
                          href="/category/call-for-papers"
                          className="text-sm text-zinc-700 dark:text-zinc-200"
                        >
                          Call for Papers
                        </Link>
                      </FlexContainer>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2">
                    <AccordionTrigger>Blogs & News</AccordionTrigger>
                    <AccordionContent>
                      <FlexContainer variant="column-start">
                        <Link
                          href="/category/blogs"
                          className="text-sm text-zinc-700 dark:text-zinc-200"
                        >
                          Blogs
                        </Link>
                        <Link
                          href="/category/news"
                          className="text-sm text-zinc-700 dark:text-zinc-200"
                        >
                          News
                        </Link>
                      </FlexContainer>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3">
                    <AccordionTrigger>Resources</AccordionTrigger>
                    <AccordionContent>
                      <FlexContainer variant="column-start">
                        <Link
                          href="/category/law-notes"
                          className="text-sm text-zinc-700 dark:text-zinc-200"
                        >
                          Law Notes
                        </Link>
                        <Link
                          href="/category/case-analysis"
                          className="text-sm text-zinc-700 dark:text-zinc-200"
                        >
                          Case Analysis
                        </Link>
                      </FlexContainer>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                <Link
                  href="/internships"
                  className="mb-3 py-3 text-sm font-medium text-black dark:text-zinc-200"
                >
                  Internships
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
                  <Button className="h-auto w-full rounded-xl py-2.5">
                    Login
                  </Button>
                </Link>
                <FlexContainer
                  variant="row-between"
                  alignItems="center"
                  className="z-[100] mt-3"
                >
                  <span className="text-sm font-medium text-zinc-600 dark:text-zinc-200">
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
