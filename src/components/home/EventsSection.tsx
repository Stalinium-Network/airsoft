import FeaturedGameCard from "./FeaturedGameCard";
import GameCard from "./GameCard";

interface EventsSectionProps {
  games: any[];
}

export default function EventsSection({ games = [] }: EventsSectionProps) {
  // Разделяем игры на основную (первую) и остальные
  const [nextGame, ...otherGames] = games || [];

  return (
    <div
      id="upcoming-events"
      className="bg-zone-dark"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            UPCOMING <span className="text-zone-gold">EVENTS</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Join our next immersive STALKER-themed airsoft experience. Limited
            slots available.
          </p>
        </div>

        {/* Отображаем основную игру, если она есть */}
        {nextGame && <FeaturedGameCard game={nextGame} />}

        {/* Отображаем карточки остальных игр, если они есть */}
        {otherGames.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherGames.map((game) => (
              <GameCard key={game._id} game={game} />
            ))}
          </div>
        )}

        {/* Если нет предстоящих игр */}
        {games.length === 0 && (
          <div className="text-center p-12 bg-zone-dark-brown/20 rounded-xl border border-zone-dark-brown/40 max-w-2xl mx-auto">
            <h3 className="text-2xl font-medium text-zone-gold mb-3">
              There are no upcoming events.
            </h3>
            <p className="text-gray-300">
              Stay tuned for more updates. More games will be announced soon!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
