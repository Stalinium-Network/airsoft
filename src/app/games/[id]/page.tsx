import Image from "next/image";
import { notFound } from "next/navigation";
import { formatDateTime } from "@/utils/time-format";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import Link from "next/link";
import { Metadata } from "next";
import { GameFraction } from "@/services/gameService"; // Изменено с Fraction на GameFraction
import dynamic from "next/dynamic";

// Динамически импортируем RegisterButton как клиентский компонент
const RegisterButton = dynamic(() => import('@/components/RegisterButton'));

// Enable revalidation every 1 hour (3600 seconds)
export const revalidate = 3600;

interface GameDetails {
  _id: string;
  name: string;
  date: string | Date;
  image: string;
  description: string;
  price: number;
  isPast: boolean;
  capacity?: {
    total: number;
    filled: number;
  };
  fractions?: GameFraction[]; // Изменено с Fraction на GameFraction
  location: {
    _id: string;
    coordinates: string;
    image?: string;
    description?: string;
  };
  detailedDescription: string;
  duration: number;
  registrationLink?: string; // Добавлено поле для общей ссылки регистрации
}

// // Fix the params type to match Next.js expectations
// interface GamePageParams {
//   params: {
//     id: string;
//   };
// }

// Fetch game data from API
async function getGameById(id: string): Promise<GameDetails> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/games/${id}`, {
      next: { revalidate },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch game: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching game details:", error);
    throw error;
  }
}

// Fix the metadata function signature
export async function generateMetadata({ params }: any): Promise<Metadata> {
  try {
    const game = await getGameById(params.id);
    return {
      title: `${game.name} | Airsoft Event`,
      description: game.description,
      openGraph: {
        images: [{ url: process.env.NEXT_PUBLIC_IMAGES_URL + game.image }],
      },
    };
  } catch (error) {
    return {
      title: "Game Details | Airsoft",
      description: "Detailed information about an airsoft game event.",
    };
  }
}

// Fix the component props type to match Next.js expectations
export default async function GameDetailPage({ params }: any) {
  let game: GameDetails;

  try {
    game = await getGameById(params.id);
  } catch (error) {
    return notFound();
  }

  // Calculate total capacity based on available data
  const getTotalCapacity = () => {
    // If using new fractions structure
    if (game.fractions && game.fractions.length > 0) {
      const total = game.fractions.reduce((sum, fraction) => sum + fraction.capacity, 0);
      const filled = game.fractions.reduce((sum, fraction) => sum + fraction.filled, 0);
      return {
        total,
        filled,
        percentFilled: Math.round((filled / total) * 100),
        spotsLeft: total - filled,
        isFull: total <= filled
      };
    }
    
    // Fallback
    return { total: 0, filled: 0, percentFilled: 0, spotsLeft: 0, isFull: true };
  };
  
  const capacity = getTotalCapacity();
  console.log(game.fractions)

  // Определяем, заполнена ли игра полностью
  const isFull = capacity.isFull || capacity.spotsLeft <= 0;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero section with game image */}
      <div className="relative h-[50vh] w-full">
        <Image
          src={process.env.NEXT_PUBLIC_IMAGES_URL + game.image}
          alt={game.name}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent"></div>

        <div className="absolute bottom-0 left-0 w-full p-8">
          <div className="max-w-6xl mx-auto">
            <Link
              href="/"
              className="inline-flex items-center text-green-400 hover:text-green-300 mb-4"
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Events
            </Link>

            <h1 className="text-4xl md:text-5xl font-bold">{game.name}</h1>

            <div className="flex flex-wrap items-center gap-4 mt-4">
              <div className="flex items-center text-green-400">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {formatDateTime(game.date)}
              </div>

              <div className="flex items-center text-green-400">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {game.duration} hours
              </div>

              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0z"
                  />
                </svg>
                <a
                  href={`https://maps.google.com/?q=${game.location.coordinates}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-green-400 hover:text-green-300"
                >
                  {game.location._id}
                </a>
              </div>

              {!game.isPast && (
                <div className="flex items-center ml-auto">
                  <span className="bg-green-500 text-gray-900 font-bold px-4 py-1 rounded">
                    ${game.price}/person
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="md:col-span-2">
            <div className="rounded-lg p-6 md:shadow-lg md:border md:bg-gray-800 md:border-gray-700 mb-8">
              <h2 className="text-2xl font-bold mb-4">Event Details</h2>
              <MarkdownRenderer content={game.detailedDescription} />
            </div>
            
            {/* Fractions section if available */}
            {game.fractions && game.fractions.length > 0 && (
              <div className="rounded-lg p-6 mt-8 shadow-lg border bg-gray-800 border-gray-700">
                <h2 className="text-2xl font-bold mb-6">Available Factions</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {game.fractions.map((fraction) => (
                    <div key={fraction._id} className="border border-gray-700 rounded-lg overflow-hidden">
                      {fraction.image && (
                        <div className="h-40 relative">
                          <Image
                            src={`${process.env.NEXT_PUBLIC_API_URL}/fractions/image/${fraction.image}`}
                            alt={fraction._id}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      
                      <div className="p-4">
                        <h3 className="text-xl font-bold mb-2">{fraction.name || fraction._id}</h3>
                        
                        {fraction.shortDescription && (
                          <p className="text-gray-300 mb-3">{fraction.shortDescription}</p>
                        )}
                        
                        <div className="mb-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-400">Capacity</span>
                            <span className="text-green-400">
                              {fraction.filled}/{fraction.capacity}
                            </span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                fraction.filled / fraction.capacity < 0.3
                                  ? "bg-green-500"
                                  : fraction.filled / fraction.capacity < 0.7
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                              }`}
                              style={{ width: `${(fraction.filled / fraction.capacity) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        {/* Уже не показываем кнопки для фракций */}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700 mb-6 top-8">
              <h3 className="text-xl font-bold mb-4">Registration</h3>

              {/* Capacity information */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Total Capacity</span>
                  <span className="text-green-400">
                    {capacity.filled}/{capacity.total}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5 mb-1">
                  <div
                    className={`h-2.5 rounded-full ${
                      capacity.percentFilled < 30
                        ? "bg-green-500"
                        : capacity.percentFilled < 70
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${capacity.percentFilled}%` }}
                  ></div>
                </div>
                {!game.isPast && capacity.spotsLeft > 0 && (
                  <p className="text-sm text-green-400 mt-2">
                    {capacity.spotsLeft} spots left
                  </p>
                )}
              </div>

              {/* Price information */}
              {!game.isPast && (
                <div className="mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Price per person</span>
                    <span className="text-2xl font-bold text-green-400">
                      ${game.price}
                    </span>
                  </div>
                </div>
              )}
              
              {/* Кнопка регистрации - заменяем на компонент RegisterButton */}
              {!game.isPast && (
                <div className="mt-4">
                  <RegisterButton
                    gameId={game._id.toString()}
                    gameName={game.name}
                    isPast={game.isPast}
                    isFull={isFull}
                    hasFractions={game.fractions && game.fractions.length > 0}
                    registrationLink={game.registrationLink}
                    className="w-full"
                  />
                </div>
              )}
              
              {/* Информация о фракциях */}
              {game.fractions && game.fractions.length > 0 && !game.isPast && (
                <div className="bg-gray-700 p-4 rounded-lg text-center mt-4">
                  <p className="text-gray-300 mb-2">Review available factions below</p>
                  <svg className="w-6 h-6 mx-auto text-green-500 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
              )}
            </div>

            {/* Location map and details */}
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
              <h3 className="text-xl font-bold mb-4">Location</h3>

              {/* Display location image if available */}
              {game.location.image && (
                <div className="aspect-video relative overflow-hidden rounded-lg mb-4">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_LOCATION_IMAGES_URL}${game.location.image}`}
                    alt={game.location._id}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {/* Location details */}
              <div className="space-y-2">
                <h4 className="font-bold text-lg">{game.location._id}</h4>

                {game.location.description && (
                  <p className="text-gray-300 text-sm mb-3">
                    {game.location.description}
                  </p>
                )}

                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-green-400 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0z"
                    />
                  </svg>
                  <a
                    href={`https://maps.google.com/?q=${game.location.coordinates}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-green-400 hover:text-green-300"
                  >
                    {game.location.coordinates}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
