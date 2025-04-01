import { Metadata } from 'next';
import Image from 'next/image';
import { serverApi } from '@/utils/api-server';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Zone 37 | Immersive Airsoft Experience',
  description: 'Join the ultimate 40-hour continuous immersion role-playing airsoft game.',
};

export const revalidate = 3600; // Revalidate every hour

export default async function HomePage() {
  // Fetch games from the server
  const games = await serverApi.getGames();

  const [nextGame, ...otherGames] = games.upcoming || [];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative h-screen">
        <video
          src="/video.mp4"
          autoPlay
          loop
          muted
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
          <Image
            src="/logo-z37.svg"
            alt="Zone 37 Logo"
            width={200}
            height={200}
            className="mb-6"
          />
          <h1 className="text-4xl md:text-6xl font-bold mb-4">WELCOME TO ZONE 37</h1>
          <p className="text-lg md:text-2xl mb-10">
            40 hour continuous immersion role-playing airsoft game
          </p>
          <a
            href="#upcoming-events"
            className="px-8 py-4 bg-zone-gold text-zone-dark-brown font-bold rounded-lg hover:bg-zone-gold/80 transition-all transform hover:scale-105 shadow-lg"
          >
            EXPLORE OUR WORLD
          </a>
        </div>
      </div>

      {/* Upcoming Events Section */}
      <div id="upcoming-events" className="bg-gradient-to-b from-zone-dark to-black py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              UPCOMING <span className="text-zone-gold">EVENTS</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Join our next immersive STALKER-themed airsoft experience. Limited slots available.
            </p>
          </div>

          {nextGame && (
            <div className="relative bg-zone-dark-brown/20 rounded-lg overflow-hidden shadow-lg mb-16">
              <div className="relative aspect-video">
                {nextGame.image ? (
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL}/games/image/${nextGame.image}`}
                    alt={nextGame.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-zone-dark-brown/40 to-zone-dark flex items-center justify-center">
                    <Image
                      src="/logo-z37.svg"
                      alt="Zone 37 Logo"
                      width={80}
                      height={80}
                      className="opacity-30"
                    />
                  </div>
                )}
              </div>
              <div className="p-8">
                <h3 className="text-3xl font-bold text-zone-gold mb-4">
                  {nextGame.name}
                </h3>
                <p className="text-gray-300 mb-4">
                  {nextGame.description}
                </p>
                <p className="text-sm text-gray-400 mb-2">
                  {new Date(nextGame.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
                <p className="text-sm text-gray-400 mb-4">
                  {nextGame.location ? nextGame.location.name : 'Location TBA'}
                </p>
                <Link 
                  href={`/games/${nextGame._id}`}
                  className="inline-flex items-center px-5 py-2.5 bg-zone-gold hover:bg-zone-gold/80 text-zone-dark-brown font-medium rounded-lg transition-all"
                >
                  Event Details
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
          )}

          {otherGames.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {otherGames.map((game) => (
                <div 
                  key={game._id}
                  className="relative bg-zone-dark-brown/20 rounded-lg overflow-hidden shadow-lg hover:shadow-zone-gold/20 transition-shadow"
                >
                  <div className="relative aspect-video">
                    {game.image ? (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_API_URL}/games/image/${game.image}`}
                        alt={game.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-zone-dark-brown/40 to-zone-dark flex items-center justify-center">
                        <Image
                          src="/logo-z37.svg"
                          alt="Zone 37 Logo"
                          width={80}
                          height={80}
                          className="opacity-30"
                        />
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-zone-gold mb-2">
                      {game.name}
                    </h3>
                    <p className="text-gray-300 mb-4">
                      {game.description}
                    </p>
                    <p className="text-sm text-gray-400 mb-4">
                      {new Date(game.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                    <p className="text-sm text-gray-400">
                      {game.location ? game.location.name : 'Location TBA'}
                    </p>
                    <div className="mt-6">
                      <Link 
                        href={`/games/${game._id}`}
                        className="inline-flex items-center px-5 py-2.5 bg-zone-gold hover:bg-zone-gold/80 text-zone-dark-brown font-medium rounded-lg transition-all"
                      >
                        Event Details
                        <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
