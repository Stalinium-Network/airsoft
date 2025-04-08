import { Metadata } from "next";
import { notFound } from "next/navigation";
import { publicApi } from "@/utils/api";
import { mapNewsData, NewsItem } from "@/services/newsService";
import NewsContent from "./components/NewsContent";
import RelatedNews from "./components/RelatedNews";

// Revalidate at most every hour
export const revalidate = 3600;

// Generate metadata for the page
export async function generateMetadata({ params }: any): Promise<Metadata> {
  try {
    const newsResponse = await publicApi.getNewsItem(params.id, {
      revalidate: 3600,
    });
    const news = mapNewsData(newsResponse);

    return {
      title: `${news.title} | Airsoft Events`,
      description: news.description,
      openGraph: {
        title: news.title,
        description: news.description,
        images: news.image
          ? [
              {
                url: `${process.env.NEXT_PUBLIC_API_URL}/news/image/${news.image}`,
                width: 1200,
                height: 630,
                alt: news.title,
              },
            ]
          : [],
        type: "article",
        publishedTime: news.date.toISOString(),
      },
    };
  } catch (error) {
    return {
      title: "News Article | Airsoft Events",
      description: "Detailed information about a news article",
    };
  }
}

// Main page component
export default async function NewsPage({ params }: any) {
  // Получаем данные о новости
  try {
    const newsResponse = await publicApi.getNewsItem(params.id, {
      revalidate: 3600,
    });
    const news = mapNewsData(newsResponse);

    // Получаем категории для отображения названия категории
    const categoriesResponse = await publicApi.getNewsCategories({
      revalidate: 3600,
    });
    const categories = categoriesResponse;

    // Получаем связанные новости (другие новости в той же категории)
    const relatedNewsResponse = await publicApi.getNews(news.category, {
      revalidate: 3600,
    });
    const relatedNews = relatedNewsResponse
      .map(mapNewsData)
      .filter((item: NewsItem) => item._id !== news._id) // Исключаем текущую новость
      .slice(0, 3); // Ограничиваем до 3-х связанных новостей

    console.log(relatedNewsResponse);

    return (
      <div className="min-h-screen bg-zone-dark text-white pb-16">
        {/* Hero section */}
        <NewsContent news={news} categories={categories} />

        {/* Related news section */}
        {relatedNews.length > 0 && (
          <RelatedNews news={relatedNews} categories={categories} />
        )}
      </div>
    );
  } catch (error) {
    console.error("Error fetching news:", error);
    notFound();
  }
}
