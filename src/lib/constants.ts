import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  TelegramIcon,
  WhatsappIcon,
} from "@/components/icons";

export const SocialLinks = Object.freeze({
  facebook: {
    url: "https://www.facebook.com/share/14jA9sKyNj/?mibextid=qi2Omg",
    icon: FacebookIcon,
  },
  instagram: {
    url: "https://www.instagram.com/legalcyfle/profilecard/?igsh=OWhvZWg0dWUxZHlu",
    icon: InstagramIcon,
  },
  linkedin: {
    url: "https://www.linkedin.com/company/legalcyfle-in/",
    icon: LinkedInIcon,
  },
  telegram: {
    url: "https://t.me/legalcyfle",
    icon: TelegramIcon,
  },
  whatsapp: {
    url: "https://chat.whatsapp.com/LYroveHgsMMLvbpIqVPKCe",
    icon: WhatsappIcon,
  },
}) as {
  [key: string]: {
    url: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
  };
};
