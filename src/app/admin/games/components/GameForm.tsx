"use client";

import { useState, useEffect } from "react";
import {
  Game,
  GameFaction,
  Cards,
  RegistrationInfo,
  PricePeriod,
} from "@/services/gameService";
import { adminApi } from "@/utils/api";
import { Location } from "@/services/locationService";
import LoadingSpinner from "@/components/LoadingSpinner";
import Image from "next/image";
import {
  isPreviewUrl,
  getYoutubeVideoId,
  getYoutubeThumbnail,
} from "@/services/gameService";
import FactionEditor from "./FactionEditor";
import RegistrationInfoEditor from "./RegistrationInfoEditor";
import CardEditor from "./CardEditor";
import PricingManager from "@/app/admin/console/components/game-form/PricingManager";
import TemplateSelector from "@/app/admin/console/components/game-form/TemplateSelector";

interface GameFormProps {
  game: Game | null;
  isCreating: boolean;
  onBack: () => void;
  onSave: () => void;
  // New props for pre-loaded data
  locations: Location[];
  availableFactions: any[];
  availableCardTypes: string[];
  isLoading?: boolean;
}

export default function GameForm({
  game,
  isCreating,
  onBack,
  onSave,
  locations,
  availableFactions,
  availableCardTypes,
  isLoading = false,
}: GameFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form field states
  const [name, setName] = useState("");
  const [locationId, setLocationId] = useState("");
  const [description, setDescription] = useState("");
  const [detailedDescription, setDetailedDescription] = useState("");
  const [date, setDate] = useState("");
  const [duration, setDuration] = useState(4);
  const [isPast, setIsPast] = useState(false);
  const [previewType, setPreviewType] = useState<"file" | "youtube">("file");
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [previewFileUrl, setPreviewFileUrl] = useState<string>("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [factions, setFactions] = useState<GameFaction[]>([]);
  const [regInfo, setRegInfo] = useState<RegistrationInfo>({
    link: null,
    details: "",
    status: "not-open",
  });
  const [cards, setCards] = useState<Cards>({});

  // New state for dynamic pricing and templates
  const [pricePeriods, setPricePeriods] = useState<PricePeriod[]>([]);
  const [templates, setTemplates] = useState<string[]>([]);

  // Fill form with game data when editing
  useEffect(() => {
    if (game) {
      setName(game.name || "");

      // Check location type and set value
      if (typeof game.location === "string") {
        setLocationId(game.location);
      } else if (typeof game.location === "object" && game.location?._id) {
        setLocationId(game.location._id);
      }

      setDescription(game.description || "");
      setDetailedDescription(game.detailedDescription || "");

      // Format date for input field
      if (game.date) {
        const date = new Date(game.date);
        const formattedDate = date.toISOString().substring(0, 16);
        setDate(formattedDate);
      }

      setDuration(game.duration || 4);
      setIsPast(game.isPast || false);

      // Determine preview type and set
      if (game.preview) {
        if (isPreviewUrl(game.preview)) {
          setPreviewType("youtube");
          setYoutubeUrl(game.preview);
        } else {
          setPreviewType("file");
          setPreviewFileUrl(
            `${process.env.NEXT_PUBLIC_API_URL}/games/image/${game.preview}`
          );
        }
      }

      // Copy factions
      if (game.factions && game.factions.length > 0) {
        setFactions([...game.factions]);
      }

      // Set registration info
      if (game.regInfo) {
        setRegInfo(game.regInfo);
      }

      // Set cards
      if (game.cards) {
        setCards({ ...game.cards });
      }

      // Set price periods or create a default one from legacy price
      if (game.prices && game.prices.length > 0) {
        setPricePeriods([...game.prices]);
      }
      // TODO: Delete this block when legacy price is removed

      // else if (game.currentPrice) {
      //   // Convert legacy price to a price period
      //   const now = new Date();
      //   const twoWeeksLater = new Date(now);
      //   twoWeeksLater.setDate(now.getDate() + 14);

      //   setPricePeriods([{
      //     starts: now.toISOString(),
      //     ends: twoWeeksLater.toISOString(),
      //     price: game.currentPrice
      //   }]);
      // }
      else {
        // Default empty state
        setPricePeriods([]);
      }

      // Set templates if available
      if (game.templates && game.templates.length > 0) {
        setTemplates([...game.templates]);
      }
    } else if (isCreating) {
      // For new games, create a default price period
      const now = new Date();
      const twoWeeksLater = new Date(now);
      twoWeeksLater.setDate(now.getDate() + 14);

      setPricePeriods([
        {
          starts: now.toISOString(),
          ends: twoWeeksLater.toISOString(),
          price: 1500,
        },
      ]);
    }
  }, [game, isCreating]);

  // Prepare form data for submission
  const prepareFormData = () => {
    const data = new FormData();

    // Basic fields
    data.append("name", name);
    data.append("location", locationId);
    data.append("description", description);
    data.append("detailedDescription", detailedDescription);
    data.append("date", new Date(date).toISOString());
    data.append("duration", duration.toString());
    data.append("isPast", isPast.toString());

    // Preview (file or YouTube URL)
    if (previewType === "file" && previewFile) {
      data.append("file", previewFile);
    } else if (previewType === "youtube") {
      data.append("preview", youtubeUrl);
    }

    // Factions
    if (factions.length > 0) {
      data.append("factions", JSON.stringify(factions));
    }

    // Registration info - убираем opens и closes из regInfoJson
    const cleanRegInfo = {
      link: regInfo.link,
      details: regInfo.details,
      status: regInfo.status,
    };
    data.append("regInfoJson", JSON.stringify(cleanRegInfo));

    // Cards
    if (Object.keys(cards).length > 0) {
      data.append("cardsJson", JSON.stringify(cards));
    }

    // Dynamic pricing
    if (pricePeriods.length > 0) {
      data.append("pricesJson", JSON.stringify(pricePeriods));
    }

    // Templates
    if (templates.length > 0) {
      data.append("templatesJson", JSON.stringify(templates));
    }

    return data;
  };

  // Form submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      const formData = prepareFormData();

      if (isCreating) {
        await adminApi.createGameWithImage(formData);
      } else if (game?._id) {
        await adminApi.updateGameWithImage(game._id, formData);
      }

      onSave();
    } catch (err) {
      console.error("Error saving game:", err);
      setError("Failed to save game. Please check all required fields.");
    } finally {
      setLoading(false);
    }
  };

  // Preview file change handler
  const handlePreviewFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setPreviewFile(file);
      setPreviewFileUrl(URL.createObjectURL(file));
    }
  };

  // Registration info update handler
  const handleRegistrationInfoChange = (updatedRegInfo: RegistrationInfo) => {
    setRegInfo(updatedRegInfo);
  };

  // Cards update handler
  const handleCardsChange = (updatedCards: Cards) => {
    setCards(updatedCards);
  };

  // Price periods update handler
  const handlePricePeriodsChange = (updatedPeriods: PricePeriod[]) => {
    setPricePeriods(updatedPeriods);
  };

  // Templates update handler
  const handleTemplatesChange = (updatedTemplates: string[]) => {
    setTemplates(updatedTemplates);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
          {isCreating ? "Create New Game" : "Edit Game"}
        </h2>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 transition-colors"
        >
          Back to Games List
        </button>
      </div>

      {error && (
        <div className="bg-red-900/50 border-l-4 border-red-500 text-red-300 p-4 mb-4">
          <p>{error}</p>
        </div>
      )}

      {loading || isLoading ? (
        <div className="flex justify-center my-12">
          <LoadingSpinner />
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 border border-gray-700 rounded-lg shadow-md p-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-amber-400">
                  Basic Information
                </h3>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-gray-200">
                    Game Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-gray-200 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-gray-200">
                    Location
                  </label>
                  <select
                    value={locationId}
                    onChange={(e) => setLocationId(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-gray-200 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select a location</option>
                    {locations.map((location) => (
                      <option key={location._id} value={location._id}>
                        {location._id}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-gray-200">
                    Short Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-gray-200 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    rows={2}
                    required
                  ></textarea>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-gray-200">
                    Full Description (supports Markdown)
                  </label>
                  <textarea
                    value={detailedDescription}
                    onChange={(e) => setDetailedDescription(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-gray-200 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    rows={10}
                    required
                  ></textarea>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-amber-400">
                  Event Details
                </h3>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-gray-200">
                    Date and Start Time
                  </label>
                  <input
                    type="datetime-local"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-gray-200 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-gray-200">
                    Duration (hours)
                  </label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-gray-200 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    min="1"
                    required
                  />
                </div>
              </div>

              {/* Dynamic Pricing Section */}
              <div>
                <PricingManager
                  pricePeriods={pricePeriods}
                  onChange={handlePricePeriodsChange}
                  disabled={loading}
                />
              </div>

              {/* Templates Section */}
              <div>
                <TemplateSelector
                  selectedTemplates={templates}
                  onChange={handleTemplatesChange}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Preview and Factions */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-amber-400">
                  Game Preview
                </h3>

                <div className="mb-4">
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="previewType"
                        checked={previewType === "file"}
                        onChange={() => setPreviewType("file")}
                        className="h-4 w-4 bg-gray-700 border-gray-600 text-amber-500 rounded-full focus:ring-amber-500 focus:ring-offset-gray-800"
                      />
                      <span className="ml-2 text-sm text-gray-200">
                        Upload Image
                      </span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="previewType"
                        checked={previewType === "youtube"}
                        onChange={() => setPreviewType("youtube")}
                        className="h-4 w-4 bg-gray-700 border-gray-600 text-amber-500 rounded-full focus:ring-amber-500 focus:ring-offset-gray-800"
                      />
                      <span className="ml-2 text-sm text-gray-200">
                        YouTube Link
                      </span>
                    </label>
                  </div>
                </div>

                {previewType === "file" && (
                  <div className="mb-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePreviewFileChange}
                      className="w-full py-2 text-gray-200"
                      required={
                        isCreating && previewType === "file" && !previewFileUrl
                      }
                    />

                    {(previewFileUrl ||
                      (game?.preview && !isPreviewUrl(game.preview))) && (
                      <div className="mt-2 relative w-full h-48 rounded-md overflow-hidden">
                        <Image
                          src={
                            previewFileUrl ||
                            `${process.env.NEXT_PUBLIC_API_URL}/games/image/${game?.preview}`
                          }
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>
                )}

                {previewType === "youtube" && (
                  <div className="mb-4">
                    <input
                      type="url"
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-gray-200 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      required={isCreating && previewType === "youtube"}
                    />

                    {youtubeUrl && getYoutubeVideoId(youtubeUrl) && (
                      <div className="mt-2 aspect-video w-full">
                        <iframe
                          width="100%"
                          height="200"
                          src={`https://www.youtube.com/embed/${getYoutubeVideoId(
                            youtubeUrl
                          )}`}
                          title="YouTube video player"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Faction editor */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-amber-400">
                  Factions
                </h3>
                <FactionEditor
                  factions={factions}
                  onFactionsChange={setFactions}
                  availableFactions={availableFactions}
                />
              </div>

              {/* Registration info editor */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-amber-400">
                  Registration
                </h3>
                <RegistrationInfoEditor
                  regInfo={regInfo}
                  onChange={handleRegistrationInfoChange}
                />
              </div>

              {/* Card editor */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-amber-400">
                  Information Cards
                </h3>
                <CardEditor
                  cards={cards}
                  availableCardTypes={availableCardTypes}
                  onChange={handleCardsChange}
                />
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-amber-500 text-gray-900 rounded-md hover:bg-amber-600 transition-colors font-medium"
              disabled={loading}
            >
              {isCreating ? "Create Game" : "Save Changes"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
