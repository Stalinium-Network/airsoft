import Image from 'next/image';
import Link from 'next/link';
import { NewsItem, NewsCategory } from '@/services/newsService';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { ShareButton } from '@/components/RegisterButton';

interface NewsContentProps {
  news: NewsItem;
  categories: NewsCategory[];
}

export default function NewsContent({ news, categories }: NewsContentProps) {
  // Получаем название категории из ID
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : categoryId;
  };

  // Форматируем дату публикации
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };
  
  return (
    <article>
      {/* Header с изображением */}
      <div className="relative h-[50vh] min-h-[400px] w-full">
        {/* Фоновое изображение */}
        <div className="absolute inset-0 bg-gray-800">
          {news.image && (
            <Image
              src={`${process.env.NEXT_PUBLIC_API_URL}/news/image/${news.image}`}
              alt={news.title}
              fill
              priority
              className="object-cover opacity-50"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/70 via-gray-900/50 to-gray-900"></div>
        </div>
        
        {/* Навигация */}
        <div className="absolute top-0 left-0 w-full p-6">
          <div className="container mx-auto mt-10">
            <Link 
              href="/news" 
              className="flex items-center text-gray-300 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to News
            </Link>
          </div>
        </div>
        
        {/* Заголовок и метаданные */}
        <div className="absolute bottom-0 left-0 w-full p-6">
          <div className="container mx-auto max-w-4xl">
            <div className="flex items-center space-x-3 mb-3">
              <span className="bg-green-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                {getCategoryName(news.category)}
              </span>
              <span className="text-gray-400 text-sm">{formatDate(news.date)}</span>
              {news.pinned && (
                <span className="bg-yellow-600/80 text-white text-xs px-3 py-1 rounded-full font-medium">
                  Pinned
                </span>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">{news.title}</h1>
          </div>
        </div>
      </div>
      
      {/* Контент */}
      <div className="container mx-auto max-w-4xl px-6 py-10">
        {/* Краткое описание */}
        <div className="text-xl text-gray-300 mb-8 leading-relaxed border-l-4 border-green-500 pl-4 italic">
          {news.description}
        </div>
        
        {/* Основной контент с Markdown */}
        <div className="mt-8 bg-gray-800 rounded-xl border border-gray-700 p-6 md:p-8 shadow-xl">
          <div className="prose prose-invert prose-lg max-w-none">
            <MarkdownRenderer content={news.content} />
          </div>
        </div>
        
        <div className="mt-10 flex flex-wrap justify-between items-center pt-6 border-t border-gray-700">
          <ShareButton 
            title={news.title}
            text={news.description}
            url={`${process.env.NEXT_PUBLIC_APP_URL}/news/${news._id}`}
            className="bg-gray-700/70 hover:bg-gray-600 text-white px-6 py-2 rounded-lg flex items-center transition-colors"
          />
          
          <Link 
            href="/news" 
            className="bg-gray-700/70 hover:bg-gray-600 text-white px-6 py-2 rounded-lg flex items-center transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            More News
          </Link>
        </div>
      </div>
    </article>
  );
}
