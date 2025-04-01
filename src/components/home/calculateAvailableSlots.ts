import { GameFaction } from "@/services/gameService";

// Функция для подсчета свободных мест на основе данных о фракциях
export function calculateAvailableSlots(factions: GameFaction[]): number {
  if (!factions || !Array.isArray(factions)) return 0;

  return factions.reduce((total, faction) => {
    const available = faction.capacity - faction.filled;
    return total + Math.max(0, available); // Не допускаем отрицательных значений
  }, 0);
}