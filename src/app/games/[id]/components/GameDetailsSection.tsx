import MarkdownRenderer from "@/components/MarkdownRenderer";
import FactionsSection from "./FactionsSection";
import { GameFraction } from "@/services/gameService";

interface GameDetailsSectionProps {
  game: {
    detailedDescription: string;
    factions?: GameFraction[];
  };
}

export default function GameDetailsSection({ game }: GameDetailsSectionProps) {
  return (
    <div className="rounded-lg p-6 md:shadow-lg md:border md:bg-gray-800 md:border-gray-700 mb-8">
      <h2 className="text-2xl font-bold mb-4">Event Details</h2>
      <MarkdownRenderer content={game.detailedDescription} />
      
      {/* Integrated Factions section */}
      {game.factions && game.factions.length > 0 && (
        <FactionsSection factions={game.factions} />
      )}
    </div>
  );
}
