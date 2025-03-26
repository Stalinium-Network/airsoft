// Меняем клиентский компонент на серверный
import { Metadata } from "next";
import { NewsItem, mapNewsData } from "@/services/newsService";
import { publicApi } from "@/utils/api";

// Компоненты
import NewsHeroClient from "./components/NewsHeroClient";
import NewsFiltersClient from "./components/NewsFiltersClient";
import NewsGridClient from "./components/NewsGridClient";

// Включаем ревалидацию каждый час (3600 секунд)
export const revalidate = 3600;

// Метаданные страницы
export const metadata: Metadata = {
  title: "News & Updates | Airsoft Events",
  description: "Latest news, events, and updates from the airsoft community.",
};

// Асинхронная функция для получения данных на сервере
export default async function NewsPage() {
  // Получаем все новости с сервера
  const allNewsResponse = await publicApi.getNews().catch(error => {
    console.error("Error fetching news:", error);
    return { data: [] };
  });
  
  // Получаем закрепленные новости отдельно
  const pinnedNewsResponse = await publicApi.getPinnedNews().catch(error => {
    console.error("Error fetching pinned news:", error);
    return { data: [] };
  });
  
  // Получаем категории новостей
  const categoriesResponse = await publicApi.getNewsCategories().catch(error => {
    console.error("Error fetching news categories:", error);
    return { data: [] };
  });
  
  // Преобразуем полученные данные в нужный формат
  const allNews = allNewsResponse.data.map(mapNewsData);
  const pinnedNews = pinnedNewsResponse.data.map(mapNewsData);
  const categories = categoriesResponse.data;
  
  return (
    <div className="min-h-screen bg-gray-900 text-white pb-12">
      {/* Header Section */}
      <section className="relative bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 py-16">
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold text-center mb-4">
            LATEST <span className="text-green-500">NEWS</span>
          </h1>
          <p className="text-xl text-gray-300 text-center max-w-2xl mx-auto">
            Stay updated with the latest events, community happenings, and announcements in the airsoft world.
          </p>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="container mx-auto px-4 py-8">
        {/* Фильтры - клиентский компонент */}
        <NewsFiltersClient 
          initialCategories={categories} 
        />

        {/* Карусель закрепленных новостей - клиентский компонент */}
        <NewsHeroClient 
          pinnedNews={pinnedNews} 
          categories={categories}
        />

        {/* Сетка новостей - клиентский компонент */}
        <NewsGridClient 
          initialNews={allNews} 
          categories={categories} 
        />
      </section>
    </div>
  );
}
