import {
  Game,
  getYoutubeThumbnail,
  getYoutubeVideoId,
  isPreviewUrl,
} from "@/services/gameService";
import Image from "next/image";
import { formatDateTime } from "@/utils/time-format";
import LocationLink from "@/components/home/LocationLink";
import Link from "next/link";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { Location } from "@/services/locationService";

export default function OldHeroSection({ game }: { game: Game }) {
  // Проверяем, является ли preview URL (ссылкой на YouTube)
  const isYoutubeVideo = isPreviewUrl(game.preview);

  // Если это YouTube видео, получаем его ID
  const youtubeVideoId = isYoutubeVideo
    ? getYoutubeVideoId(game.preview)
    : null;

  // Формируем URL для отображения
  const imageUrl = isYoutubeVideo
    ? youtubeVideoId
      ? getYoutubeThumbnail(youtubeVideoId)
      : game.preview
    : `${process.env.NEXT_PUBLIC_IMAGES_URL}${game.preview}`;

  return (
    <div className="relative w-full mb-16">
      <div className="max-w-7xl mx-auto">
        {/* Статус регистрации, если открыт */}
        {game.regInfo?.status === "open" && (
          <div className="mb-6">
            <span className="text-zone-gold-lite font-bold">
              Registration is open
            </span>
          </div>
        )}

        {/* Название игры с градиентным текстом */}
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-white to-zone-gold-lite bg-clip-text text-transparent w-fit pb-2">
          {game.name}
        </h1>

        {/* Дата и длительность игры */}
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="flex items-center text-zone-gold-lite">
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
            {formatDateTime(game.date)}{" "}
            <span className="ml-2">({game.duration} hours)</span>
          </div>
        </div>

        {/* Локация */}
        {typeof game.location === "object" &&
          "coordinates" in game.location && (
            <div className="mb-6">
              <LocationLink
                coordinates={(game.location as Location).coordinates}
                locationName={(game.location as Location)._id}
              />
            </div>
          )}

        <div className="rounded-xl overflow-hidden my-8">
          {isYoutubeVideo && youtubeVideoId ? (
            <div className="aspect-video w-full relative">
              <iframe
                src={`https://www.youtube.com/embed/${youtubeVideoId}?rel=0`}
                title={game.name}
                className="w-full h-full absolute inset-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                frameBorder="0"
              ></iframe>
            </div>
          ) : (
            <div className="aspect-video w-full relative">
              <Image
                src={imageUrl}
                alt={game.name}
                fill
                priority
                className="object-cover"
              />
            </div>
          )}
        </div>

        <div className="text-lg text-gray-200 mb-12">
          <MarkdownRenderer content={game.description} />
        </div>

        {/* Кнопка регистрации (если регистрация открыта) */}
        {(game.regInfo?.status === "open" && game.regInfo?.link) ? (
          <div className="mt-6 mb-8">
            <a
              href={game.regInfo.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-3 bg-zone-gold-lite hover:bg-zone-gold text-zone-dark-brown font-bold rounded-lg transition-all"
            >
              Register Now
              <svg
                className="ml-2 w-5 h-5 inline-block"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </a>
          </div>
        ) : (
          <div className="mt-6 mb-8 text-black font-bold bg-zone-gold-lite/50 w-fit px-6 py-3 rounded-lg">
            Registration is currently unavailable
          </div>
        )}
      </div>
    </div>
  );
}
