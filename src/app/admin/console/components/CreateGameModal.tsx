"use client";
import { Game } from "@/services/gameService";
import { adminApi } from "@/utils/api";

// Компоненты
import GameFormFields from "./game-form/GameFormFields";
import ProgressBar from "./game-form/ProgressBar";
import ModalHeader from "./modal/ModalHeader";
import ModalFooter from "./modal/ModalFooter";
import FactionsManager from "./FactionsManager";
import RegistrationInfoFields from "./game-form/RegistrationInfoFields";
import PreviewSection from "./game-form/PreviewSection";
import CardsManager from "./game-form/CardsManager";

// Хуки и утилиты
import useGameForm from "./game-form/useGameForm";
import { createIcon, loadingIcon, formStyles } from "./game-form/formStyles";

const defaultGameData: Omit<Game, "_id"> = {
  name: "",
  date: new Date().toISOString(),
  duration: 3,
  location: "",
  description: "",
  detailedDescription: "",
  preview: "",
  factions: [],
  price: 25,
  isPast: false,
  regInfo: {
    link: "",
    opens: "", 
    closes: "", 
    status: "not-open",
    details: "",
  }
};

interface CreateGameModalProps {
  onClose: () => void;
  onGameCreated: () => void;
  onError: (message: string) => void;
}

export default function CreateGameModal({
  onClose,
  onGameCreated,
  onError,
}: CreateGameModalProps) {
  // Используем общий хук для управления формой
  const gameForm = useGameForm({
    initialGame: defaultGameData,
    onError
  });
  
  const { state, setIsLoading, setUploadProgress, handleInputChange, 
    togglePreviewType, handleImageSelected, handleRemoveImage, 
    handleLocationSelect, handleFactionsChange, getYoutubeVideoId, 
    handleAddCard, handleRemoveCard, handleCardChange, 
    prepareFormData, startProgressAnimation } = gameForm;

  // Обработка ввода YouTube URL
  const handleYoutubeUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const syntheticEvent = {
      target: {
        name: "youtubeUrl",
        value: e.target.value
      }
    };
    handleInputChange(syntheticEvent);
  };

  // Создание новой игры
  const handleCreateGame = async () => {
    setIsLoading(true);
    
    // Валидация формы
    if (
      !state.game.name ||
      !state.game.date ||
      !state.game.duration ||
      !state.game.location ||
      !state.game.description ||
      ((!state.imageFile && !state.isYoutubeUrl) || (state.isYoutubeUrl && !state.youtubeUrl))
    ) {
      onError("Please fill in all required fields and provide an image or YouTube URL");
      setIsLoading(false);
      return;
    }
    
    try {
      // Запуск анимации прогресса
      const progressInterval = startProgressAnimation();
      
      // Подготовка FormData для отправки на сервер
      const formData = prepareFormData();
      
      // Отправка данных на сервер
      await adminApi.createGameWithImage(formData);
      
      // Очистка интервала и установка 100% прогресса
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Вызов коллбэка после создания игры
      onGameCreated();
    } catch (error: any) {
      console.error("Error creating game:", error);
      
      // Извлечение сообщения об ошибке из axios error
      const errorMessage = error.response?.data?.message || error.message || "Unknown error";
      onError(`Failed to create game: ${errorMessage}`);
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center p-2 z-50">
      <div className="bg-gray-800 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl border border-gray-700">
        {/* Header */}
        <ModalHeader 
          title="Create New Game"
          icon={createIcon}
          onClose={onClose}
          isLoading={state.isLoading}
          color="text-green-500"
        />

        <div className="p-4 sm:p-6">
          {/* Уведомление о загрузке */}
          {state.isLoading && (
            <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-gray-800 p-6 rounded-lg shadow-xl flex flex-col items-center border border-gray-700">
                <div className="w-12 h-12 border-4 border-t-green-500 border-gray-700 rounded-full animate-spin mb-4"></div>
                <p className="text-white">Creating game...</p>
                {state.uploadProgress > 0 && <ProgressBar progress={state.uploadProgress} show={true} />}
              </div>
            </div>
          )}

          {/* Основная форма с улучшенной разметкой */}
          <div className="space-y-6">
            {/* Секция: Основные поля игры */}
            <div className="bg-gray-750 p-4 rounded-lg border border-gray-700">
              <GameFormFields
                game={state.game}
                onChange={handleInputChange}
                isLoading={state.isLoading}
                onLocationSelect={handleLocationSelect}
              />
            </div>

            {/* Секция: Регистрационная информация */}
            <div className="bg-gray-750 p-4 rounded-lg border border-gray-700">
              <RegistrationInfoFields
                regInfo={state.game.regInfo || {
                  link: "",
                  opens: "",
                  closes: "",
                  status: "not-open",
                  details: ""
                }}
                onChange={handleInputChange}
                isLoading={state.isLoading}
              />
            </div>

            {/* Секция: Фракции */}
            <div className="bg-gray-750 p-4 rounded-lg border border-gray-700">
              <h3 className="text-lg font-medium text-green-500 mb-3 flex items-center">
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                Game Factions
              </h3>
              
              <div className="bg-gray-800/50 p-4 mb-4 rounded border border-gray-700/50">
                <p className="text-sm text-gray-300">
                  Add factions to this game and specify their capacities. Players will be able to choose which faction to join.
                </p>
              </div>
              
              <FactionsManager 
                factions={state.game.factions || []}
                onChange={handleFactionsChange}
                isLoading={state.isLoading}
              />
            </div>

            {/* Game Cards Section */}
            <div className="bg-gray-750 p-4 rounded-lg border border-gray-700">
              <h3 className="text-lg font-medium text-green-500 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Game Cards
              </h3>
              <div className="bg-gray-800/50 p-4 mb-4 rounded border border-gray-700/50">
                <p className="text-sm text-gray-300">
                  Add informational cards for the game, like timelines or starter packs.
                </p>
              </div>

              <CardsManager 
                cards={state.cards}
                cardTypes={state.cardTypes}
                onChange={setCards => state.cards = setCards}
                onAddCard={handleAddCard}
                isLoading={state.isLoading}
              />
            </div>

            {/* Preview section (Image or YouTube) */}
            <div className="bg-gray-750 p-4 rounded-lg border border-gray-700">
              <PreviewSection
                imagePreview={state.imagePreview}
                youtubeUrl={state.youtubeUrl}
                isYoutubeUrl={state.isYoutubeUrl}
                onImageChange={handleImageSelected}
                onImageRemove={handleRemoveImage}
                onYoutubeChange={handleYoutubeUrlChange}
                onTogglePreviewType={togglePreviewType}
                getYoutubeVideoId={getYoutubeVideoId}
                isLoading={state.isLoading}
              />
            </div>
          </div>

          {/* Footer с кнопками */}
          <ModalFooter
            onCancel={onClose}
            onConfirm={handleCreateGame}
            isLoading={state.isLoading}
            confirmLabel="Create Game"
            confirmIcon={<span className="w-5 h-5 mr-1">{createIcon}</span>}
            loadingLabel="Creating..."
            loadingIcon={loadingIcon}
            confirmColor="bg-green-600 hover:bg-green-700"
          />
        </div>
      </div>
      
      {/* Добавим глобальные стили для полей ввода */}
      <style jsx global>{formStyles}</style>
    </div>
  );
}
