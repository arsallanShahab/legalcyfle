import FlexContainer from "@/components/FlexContainer";
import { SocialLinks } from "@/lib/constants";
import { italiana } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function SocialMediaSection() {
  return (
    <FlexContainer
      variant="column-start"
      gap="md"
      className="mt-8 px-3 pb-10 md:px-5 lg:px-10"
    >
      <div className="flex w-full items-center justify-between border-zinc-200 pb-2 dark:border-white">
        <h2
          className={cn(
            "font-google text-2xl font-bold tracking-tight text-zinc-900 dark:text-white",
          )}
        >
          Connect With Us
        </h2>
        <span className="font-google hidden text-xs font-bold uppercase tracking-widest text-zinc-500 sm:block">
          Follow for Updates
        </span>
      </div>

      <div className="grid w-full grid-cols-2 border-l border-t border-gray-200 dark:border-zinc-800 sm:grid-cols-5">
        {Object.keys(SocialLinks).map((key) => {
          const Icon = SocialLinks[key].icon;
          return (
            <Link
              href={SocialLinks[key].url}
              target="_blank"
              key={key}
              className="group flex flex-col items-center justify-center gap-3 border-b border-r border-gray-200 bg-white py-8 transition-all duration-300 hover:bg-gray-50 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-800"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 transition-all duration-300 group-hover:border-black group-hover:bg-black group-hover:text-white dark:border-zinc-700 dark:group-hover:border-white dark:group-hover:bg-white dark:group-hover:text-black">
                <Icon className="h-5 w-5 fill-current" />
              </div>
              <span className="font-google text-sm font-bold capitalize tracking-tighter text-zinc-900 dark:text-white">
                {key}
              </span>
            </Link>
          );
        })}
      </div>
    </FlexContainer>
  );
}
