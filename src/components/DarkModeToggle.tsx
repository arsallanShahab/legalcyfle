import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";

export default function DarkModeToggle() {
  const { setTheme } = useTheme();

  return (
    <>
      <Dropdown>
        <DropdownTrigger>
          <Button variant="ghost" size="icon">
            <SunIcon className="h-[1.1rem] w-[1.1rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <MoonIcon className="absolute h-[1.1rem] w-[1.1rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownTrigger>
        <DropdownMenu>
          <DropdownItem key={"light"} onClick={() => setTheme("light")}>
            Light
          </DropdownItem>
          <DropdownItem key={"dark"} onClick={() => setTheme("dark")}>
            Dark
          </DropdownItem>
          <DropdownItem key={"system"} onClick={() => setTheme("system")}>
            System
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </>
  );
}
