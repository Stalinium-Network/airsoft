import { useState, useEffect } from "react";
import { Game, GameFaction, Card } from "@/services/gameService";
import { adminApi } from "@/utils/api";
import { createImagePreview } from "@/utils/imageUtils";
import { isPastGame } from "@/services/adminService";

// Define the mixed event type
export type MixedChangeEvent =
  | React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  | { target: { name: string; value: any } };

export interface UseGameFormProps {
  initialGame: Partial<Game>;
  onError: (message: string) => void;
}

export interface GameFormState {
  game: Partial<Game>;
  imageFile: File | null;
  imagePreview: string | null;
  uploadProgress: number;
  imageChanged: boolean;
  isYoutubeUrl: boolean;
  youtubeUrl: string;
  cardTypes: string[];
  cards: Array<Card & { type: string }>;
  isLoading: boolean;
}

export default function useGameForm({
  initialGame,
  onError,
}: UseGameFormProps) {
  // Game state and form fields
  const [game, setGame] = useState<Partial<Game>>(initialGame);

  // Image/preview related state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageChanged, setImageChanged] = useState(false);

  // YouTube related state
  const [isYoutubeUrl, setIsYoutubeUrl] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState("");

  // Cards related state
  const [cardTypes, setCardTypes] = useState<string[]>([]);
  const [cards, setCards] = useState<Array<Card & { type: string }>>([]);

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // Initialize the form
  useEffect(() => {
    // Check if the preview is a YouTube URL
    if (initialGame.preview) {
      const isVideo =
        typeof initialGame.preview === "string" &&
        (initialGame.preview.includes("youtube.com") ||
          initialGame.preview.includes("youtu.be"));

      setIsYoutubeUrl(isVideo);

      if (isVideo && typeof initialGame.preview === "string") {
        setYoutubeUrl(initialGame.preview);
      } else if (initialGame.preview) {
        // If it's an image URL
        if (typeof initialGame.preview === "string" && !isVideo) {
          setImagePreview(
            `${process.env.NEXT_PUBLIC_IMAGES_URL}${initialGame.preview}`
          );
        }
      }
    }

    // Initialize cards if available
    if (initialGame.cards) {
      const cardsArray = Object.entries(initialGame.cards).map(
        ([type, cardData]) => ({
          type,
          ...cardData,
        })
      );
      setCards(cardsArray);
    }

    // Fetch card types
    const fetchCardTypes = async () => {
      try {
        const data = await adminApi.getCardTypes();
        setCardTypes(data.types || []);
      } catch (error) {
        console.error("Failed to fetch card types:", error);
        onError(
          "Failed to load card types. Some features might be unavailable."
        );
      }
    };
    fetchCardTypes();
  }, [initialGame, onError]);

  // Handle form input changes
  const handleInputChange = (e: MixedChangeEvent) => {
    const { name, value } = e.target;

    if (name === "price") {
      setGame((prev) => ({
        ...prev,
        price: parseInt(value, 10) || 0,
      }));
    } else if (name === "date") {
      setGame((prev) => ({
        ...prev,
        date: value, // Keep as string
        isPast: isPastGame(value),
      }));
    } else if (name === "isPast") {
      setGame((prev) => ({
        ...prev,
        isPast: value === "true",
      }));
    } else if (name === "regInfo") {
      // Handle regInfo object changes
      setGame((prev) => ({
        ...prev,
        regInfo: {
          ...prev.regInfo,
          ...value,
        },
      }));
    } else if (name === "youtubeUrl") {
      // Handle YouTube URL input
      setYoutubeUrl(value);
      if (value.trim() !== "") {
        setGame((prev) => ({
          ...prev,
          preview: value.trim(),
        }));
        setImageChanged(true);
      }
    } else {
      setGame((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Toggle between image upload and YouTube URL
  const togglePreviewType = () => {
    setIsYoutubeUrl(!isYoutubeUrl);
    setImageChanged(true);

    // Reset preview values when switching
    if (!isYoutubeUrl) {
      setImageFile(null);
      setImagePreview(null);
      if (youtubeUrl) {
        setGame((prev) => ({
          ...prev,
          preview: youtubeUrl,
        }));
      }
    } else {
      setYoutubeUrl("");
      setGame((prev) => ({
        ...prev,
        preview: "",
      }));
    }
  };

  // Handle image selection
  const handleImageSelected = async (file: File) => {
    try {
      // Generate preview immediately for better UX
      const preview = await createImagePreview(file);
      setImagePreview(preview);
      setImageFile(file);
      setImageChanged(true);

      // Update the game state to indicate we have an image
      setGame((prev) => ({
        ...prev,
        preview: "file_upload", // Marker that will be replaced by the server
      }));
    } catch (error) {
      console.error("Error handling image:", error);
      onError("Failed to process image. Please try another file.");
    }
  };

  // Remove selected image
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setImageChanged(true);

    setGame((prev) => ({
      ...prev,
      preview: "",
    }));
  };

  // Handle location selection
  const handleLocationSelect = (locationId: string) => {
    setGame((prev) => ({
      ...prev,
      location: locationId,
    }));
  };

  // Handle factions update
  const handleFactionsChange = (updatedFactions: GameFaction[]) => {
    setGame((prev) => ({
      ...prev,
      factions: updatedFactions,
    }));
  };

  // Extract YouTube video ID if it's a YouTube URL
  const getYoutubeVideoId = (url: string): string | null => {
    try {
      const regex =
        /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
      const match = url.match(regex);
      return match ? match[1] : null;
    } catch (error) {
      return null;
    }
  };

  // Add a new card
  const handleAddCard = () => {
    setCards((prev) => [
      ...prev,
      { type: cardTypes[0] || "", title: "", svgContent: "", content: "" },
    ]);
  };

  // Remove a card by index
  const handleRemoveCard = (index: number) => {
    setCards((prev) => prev.filter((_, i) => i !== index));
  };

  // Change card data by index
  const handleCardChange = (
    index: number,
    field: keyof (Card & { type: string }),
    value: string
  ) => {
    setCards((prev) =>
      prev.map((card, i) => (i === index ? { ...card, [field]: value } : card))
    );
  };

  // Prepare FormData for submission
  const prepareFormData = (gameId?: string) => {
    const formData = new FormData();

    // Append individual form fields directly
    formData.append("name", game.name || "");
    formData.append("date", game.date || new Date().toISOString());
    formData.append("duration", game.duration?.toString() || "3");
    formData.append(
      "location",
      typeof game.location === "string"
        ? game.location
        : (game.location as any)?._id || ""
    );
    formData.append("description", game.description || "");
    formData.append("price", game.price?.toString() || "0");
    formData.append("isPast", (game.isPast || false).toString());

    if (game.detailedDescription) {
      formData.append("detailedDescription", game.detailedDescription);
    }

    // Add registration info as JSON string
    if (game.regInfo) {
      // Ensure proper processing of regInfo - create a clean object for JSON serialization
      const cleanRegInfo = {
        link: game.regInfo.link || null,
        opens: game.regInfo.opens || null,
        closes: game.regInfo.closes || null,
        details: game.regInfo.details || "",
        status: game.regInfo.status || "not-open",
      };
      formData.append("regInfoJson", JSON.stringify(cleanRegInfo));
    }

    // Add factions as JSON string
    if (game.factions && game.factions.length > 0) {
      formData.append("factions", JSON.stringify(game.factions));
    }

    // Add cards data
    if (cards.length > 0) {
      const cardsObject = cards.reduce((acc, card) => {
        if (card.type) {
          acc[card.type] = {
            title: card.title,
            svgContent: card.svgContent,
            content: card.content,
          };
        }
        return acc;
      }, {} as Record<string, Card>);

      if (Object.keys(cardsObject).length > 0) {
        formData.append("cardsJson", JSON.stringify(cardsObject));
      }
    }

    // Handle preview content (either file, YouTube URL or existing)
    if (imageChanged) {
      if (isYoutubeUrl && youtubeUrl) {
        formData.append("preview", youtubeUrl);
        formData.append("isYoutubeUrl", "true");
      } else if (imageFile) {
        formData.append("file", imageFile);
      } else {
        formData.append("preview", "");
      }
      formData.append("previewChanged", "true");
    } else if (game.preview) {
      formData.append("preview", game.preview.toString());
    }

    // Add the game ID for identification if editing
    if (gameId) {
      formData.append("gameId", gameId);
    }

    return formData;
  };

  // Start the progress bar animation
  const startProgressAnimation = () => {
    setUploadProgress(0);
    return setInterval(() => {
      setUploadProgress((prev) => {
        const newProgress = prev + 10;
        if (newProgress >= 90) {
          return 90;
        }
        return newProgress;
      });
    }, 300);
  };

  return {
    state: {
      game,
      imageFile,
      imagePreview,
      uploadProgress,
      imageChanged,
      isYoutubeUrl,
      youtubeUrl,
      cardTypes,
      cards,
      isLoading,
    },
    setGame,
    setIsLoading,
    setUploadProgress,
    handleInputChange,
    togglePreviewType,
    handleImageSelected,
    handleRemoveImage,
    handleLocationSelect,
    handleFactionsChange,
    getYoutubeVideoId,
    handleAddCard,
    handleRemoveCard,
    handleCardChange,
    prepareFormData,
    startProgressAnimation,
  };
}
