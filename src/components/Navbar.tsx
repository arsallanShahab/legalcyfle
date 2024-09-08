import { useGlobalContext } from "@/context/GlobalContext";
import IUser from "@/types/global/user";
import {
  DropdownMenu,
  DropdownTrigger,
  Dropdown as NextUiDropdown,
  DropdownItem as NextUiDropdownItem,
} from "@nextui-org/react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Router, useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Avatar, { AvatarFullConfig, genConfig } from "react-nice-avatar";
import DarkModeToggle from "./DarkModeToggle";
import { Dropdown, DropdownContent, DropdownItem } from "./Dropdown";
import FlexContainer from "./FlexContainer";
import { Button } from "./ui/button";

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
  const router = useRouter();

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
    if (user) {
      const config = genConfig(user?.firstName);
      setAvatarConfig(config);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
  return (
    <>
      <FlexContainer
        variant="row-between"
        alignItems="center"
        className="relative h-[80px] border-b px-5 py-5 dark:border-zinc-800 md:px-10"
      >
        <FlexContainer gap="2xl" alignItems="center">
          <Link href="/" className="font-work text-xl font-bold text-green-600">
            LegalCyfle
          </Link>
          <FlexContainer className="hidden *:rounded-lg *:font-rubik *:text-sm *:font-medium md:flex">
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
          <DarkModeToggle />
          {loading && (
            <div className="rounded-xl bg-zinc-100 p-2">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          )}
          {user && !loading && (
            <NextUiDropdown>
              <DropdownTrigger>
                <div className="flex cursor-pointer items-center justify-center gap-3 rounded-2xl bg-zinc-100 p-2 hover:bg-zinc-200">
                  <Avatar className="h-10 w-10" {...avatarConfig} />
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
                <NextUiDropdownItem key="profile">Profile</NextUiDropdownItem>
                <NextUiDropdownItem key="settings">Settings</NextUiDropdownItem>
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
                <Button variant={"ghost"} className="h-auto rounded-xl py-2.5">
                  Signup
                </Button>
              </Link>

              <Link href={"/login"}>
                <Button className="h-auto rounded-xl py-2.5">Login</Button>
              </Link>
            </FlexContainer>
          )}
          {/* <Input
            placeholder="Search on LegalCyfle..."
            radius="md"
            classNames={{
              inputWrapper:
                "w-[300px] border border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 text-sm font-medium",
            }}
            endContent={<Search className="h-4 w-4 cursor-pointer" />}
          /> */}
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
