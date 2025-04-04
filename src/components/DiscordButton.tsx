import { FaDiscord } from "react-icons/fa";

export default function DiscordButton() {
  return (
    <a
      href={process.env.NEXT_PUBLIC_LINK_DISCORD}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center gap-2 py-2.5 px-6 bg-discord hover:bg-discord-hover/80 text-white rounded-md transition-all transform hover:translate-y-[-2px] hover:shadow-lg shadow-md"
    >
      <FaDiscord size={20} />
      <span className="font-medium">Discord Community</span>
    </a>
  );
}
