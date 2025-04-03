import { GameFaction } from "@/services/gameService";

// Функция для подсчета свободных мест на основе данных о фракциях
export function calculateAvailableSlots(factions: GameFaction[]): {total: number, available: number, filled: number} {
  if (!factions || !Array.isArray(factions)) return {total: 0, available: 0, filled: 0};

  let total = 0;
  let available = 0;
  let filled = 0;

  // Подсчитываем общее количество мест и количество доступных мест
  factions.forEach(faction => {
    total += faction.capacity;
    filled += faction.filled;
    available += Math.max(0, faction.capacity - faction.filled);
  });

  return {total, available, filled};
}