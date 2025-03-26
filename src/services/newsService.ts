export interface NewsItem {
  _id: string;       // Уникальный идентификатор новости
  title: string;     // Заголовок новости
  category: string;  // Категория новости (события, обновления и т.д.)
  date: Date;        // Дата публикации в формате объекта Date
  image: string;     // Путь к изображению новости
  description: string; // Краткое описание или анонс новости
  content: string;   // Полное содержимое статьи в формате Markdown
  pinned: boolean;   // Флаг, указывающий является ли новость главной/рекомендуемой
}

export interface NewsCategory {
  id: string;
  name: string;
}

// Функция для преобразования сырых данных API в объекты NewsItem
export function mapNewsData(data: any): NewsItem {
  return {
    ...data,
    date: new Date(data.date)
  };
}
