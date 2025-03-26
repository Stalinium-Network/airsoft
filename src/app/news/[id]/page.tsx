import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { publicApi } from '@/utils/api';
import { mapNewsData } from '@/services/newsService';
import NewsContent from './components/NewsContent';
import RelatedNews from './components/RelatedNews';

// Включаем revalidate каждый час
export const revalidate = 3600;

// Генерация метаданных для страницы
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const newsResponse = await publicApi.getNewsItem(params.id);
    const news = mapNewsData(newsResponse.data);
    
    return {
      title: `${news.title} | Airsoft Events`,
      description: news.description,
      openGraph: {
        title: news.title,
        description: news.description,
        images: [{
          url: `${process.env.NEXT_PUBLIC_API_URL}/news/image/${news.image}`,
          width: 1200,
          height: 630,
          alt: news.title
        }],
        type: 'article',
        publishedTime: news.date.toISOString(),
      }
    };
  } catch (error) {
    return {
      title: 'News Article | Airsoft Events',
      description: 'Detailed information about a news article'
    };
  }
}

export default async function NewsPage({ params }: { params: { id: string } }) {
  // Получаем данные о новости
  try {
    const newsResponse = await publicApi.getNewsItem(params.id);
    const news = mapNewsData(newsResponse.data);

    // Получаем категории для отображения названия категории
    const categoriesResponse = await publicApi.getNewsCategories();
    const categories = categoriesResponse.data;
    
    // Получаем связанные новости (другие новости в той же категории)
    const relatedNewsResponse = await publicApi.getNews(news.category);
    const relatedNews = relatedNewsResponse.data
      .map(mapNewsData)
      .filter(item => item._id !== news._id) // Исключаем текущую новость
      .slice(0, 3); // Ограничиваем до 3-х связанных новостей
    
    return (
      <div className="min-h-screen bg-gray-900 text-white pb-16">
        {/* Hero section */}
        <NewsContent news={news} categories={categories} />
        
        {/* Related news section */}
        {relatedNews.length > 0 && (
          <RelatedNews news={relatedNews} categories={categories} />
        )}
      </div>
    );
  } catch (error) {
    console.error('Error fetching news:', error);
    notFound();
  }
}
