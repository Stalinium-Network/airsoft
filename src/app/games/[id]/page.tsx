import { Metadata } from "next";
import { isPreviewUrl } from "@/services/gameService";
import LocationSection from "./components/LocationSection";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import RegistrationSection from "./components/RegistrationSection";
import { Location } from "@/services/locationService";
import OldHeroSection from "./components/OldHeroSection";
import { publicApi } from "@/utils/api";
import TextGradient from "@/components/TextGradient";
import DiscordButton from "@/components/DiscordButton";
import LionDenCollab from "../../../template/components/LionDenCollab";

// Enable revalidation every 1 hour (3600 seconds)
export const revalidate = 3600;

// Metadata
export async function generateMetadata({ params }: any): Promise<Metadata> {
  try {
    const game = await publicApi.getGame(params.id);
    const imageUrl = isPreviewUrl(game.preview)
      ? game.preview
      : `${process.env.NEXT_PUBLIC_IMAGES_URL}${game.preview}`;

    return {
      title: `${game.name} | Airsoft Event`,
      description: game.description,
      openGraph: {
        images: [{ url: imageUrl }],
      },
    };
  } catch (error) {
    return {
      title: "Game Details | Airsoft",
      description: "Detailed information about an airsoft game event.",
    };
  }
}

const RenderSvgIcon: React.FC<{ svgString: string; className?: string }> = ({
  svgString,
  className,
}) => {
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: svgString }}
    />
  );
};

// Main page
export default async function GameDetailPage({ params }: any) {
  const game = await publicApi.getGame(params.id);
  const timelineData = game?.cards?.timeline;
  const starterPackData = game?.cards?.["starter_pack"];

  console.log(game);

  return (
    <div className="min-h-screen text-white">
      <div className="max-w-7xl text-base mx-auto p-6 md:p-8 mt-24">
        <OldHeroSection game={game} />
        {/* {collabData && <LionDenCollab />} */}
        <LocationSection location={game.location as Location} />
        <MarkdownRenderer content={game.detailedDescription} />

        {/* Вставка деталей мероприятия */}
        {(timelineData || starterPackData) && (
          <div className="pb-16 px-4 sm:px-6 lg:px-8 text-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10 max-w-7xl mx-auto">
              {timelineData && (
                <div className="bg-zone-dark-light rounded-xl p-6 md:p-8">
                  <div className="gap-4 mb-5">
                    <RenderSvgIcon
                      svgString={timelineData.svgContent}
                      className="w-6 h-6 text-zone-gold-lite flex-shrink-0 mt-1"
                    />
                    <TextGradient
                      text={timelineData.title}
                      className="text-2xl mt-3"
                    />
                  </div>
                  <div className="prose prose-base prose-invert max-w-none text-gray-300 prose-li:my-1 prose-strong:text-white prose-headings:text-gray-400 prose-headings:uppercase prose-headings:text-sm prose-headings:font-semibold prose-headings:mb-2 prose-headings:mt-4">
                    <MarkdownRenderer content={timelineData.content} />
                  </div>
                </div>
              )}

              {!timelineData && starterPackData && (
                <div className="hidden md:block" />
              )}

              {starterPackData && (
                <div className="bg-zone-dark-light rounded-xl p-6 md:p-8 flex flex-col">
                  <div className="mb-8">
                    <div className="gap-4 mb-5">
                      <RenderSvgIcon
                        svgString={starterPackData.svgContent}
                        className="w-6 h-6 text-zone-gold-lite flex-shrink-0 mt-1"
                      />
                      <TextGradient
                        text={starterPackData.title}
                        className="text-2xl mt-3"
                      />
                    </div>
                    <div className="prose prose-base prose-invert max-w-none text-gray-300 prose-li:my-1 prose-strong:text-white">
                      <MarkdownRenderer content={starterPackData.content} />
                    </div>
                  </div>
                  <div className="mt-auto pt-6 border-t border-gray-700">
                    <h4 className="text-xl font-semibold text-white mb-3">
                      Join our Server
                    </h4>
                    <p className="text-gray-400 mb-5 text-base leading-relaxed">
                      We suggest joining our Discord server so you won't miss
                      important details about the upcoming event, and to find a
                      squad or friends with whom you can enjoy this game!
                    </p>
                    <DiscordButton />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <RegistrationSection regInfo={game.regInfo} factions={game.factions} prices={game.prices} currentPrice={game.currentPrice} />
      </div>
    </div>
  );
}
