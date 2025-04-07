import Link from "next/link";
import Image from "next/image";
import { HiOutlineNewspaper } from "react-icons/hi2";
import { BiSolidPhotoAlbum } from "react-icons/bi";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import NavigationClient from "./NavigationClient";
import { publicApi } from "@/utils/api";
import { Game } from "@/services/gameService";

export const revalidate = 3600;

// Навигационные элементы вынесены на уровень модуля
export const navItems = [
  { href: "/world", label: "Our World" },
  { href: "/checklist", label: "Checklist" },
  { href: "/about", label: "About Us" },
  { href: "/news", label: "News", svg: HiOutlineNewspaper },
  { href: "/gallery", label: "Gallery", svg: BiSolidPhotoAlbum },
  { href: "/faqs", label: "FAQs", svg: AiOutlineQuestionCircle },
  { href: "/rules", label: "Rules" },
  { href: "/waiver", label: "Waiver" },
];

// Отдельный компонент для пункта навигации в десктопной версии
export const DesktopNavItem = ({
  href,
  label,
  isActive,
}: {
  href: string;
  label: string;
  isActive: boolean;
}) => (
  <Link
    href={href}
    className={`relative px-2 lg:px-3 py-2 text-xs lg:text-sm font-medium rounded-md transition-colors
      ${
        isActive
          ? "text-zone-gold"
          : "text-gray-300 hover:text-zone-gold hover:bg-zone-dark-brown/30"
      }`}
  >
    {label}
    {isActive && (
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-zone-gold rounded-full" />
    )}
  </Link>
);

// Отдельный компонент для пункта навигации в мобильной версии
export const MobileNavItem = ({
  href,
  label,
  isActive,
}: {
  href: string;
  label: string;
  isActive: boolean;
}) => (
  <Link
    href={href}
    className={`block px-3 py-2.5 rounded-md transition-colors ${
      isActive
        ? "bg-zone-dark-brown/70 text-zone-gold font-medium border-l-2 border-zone-gold pl-4"
        : "text-gray-300 hover:bg-zone-dark-brown/50"
    }`}
  >
    {label}
  </Link>
);

export function UpcomingEventButton({ link }: { link: string }) {
  return (
    <button className="bg-zone-gold-lite text-black px-4 lg:px-6 py-1.5 lg:py-2 text-xs lg:text-sm rounded-md hover:bg-zone-gold/80 transition duration-200 font-semibold whitespace-nowrap">
      <Link href={link}>UPCOMING EVENT</Link>
    </button>
  );
}

export default async function Navigation() {
  const upcomingEvent: Game | null =
    (await publicApi.getGames()).upcoming[0] || null;
  const id = upcomingEvent?._id

  return <NavigationClient upcomingEventLink={`/games/${id}`} />;
}
