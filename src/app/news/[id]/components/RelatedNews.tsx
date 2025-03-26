import Link from 'next/link';
import Image from 'next/image';
import { NewsItem, NewsCategory } from '@/services/newsService';

interface RelatedNewsProps {
  news: NewsItem[];
  categories: NewsCategory[];
}

export default function RelatedNews({ news, categories }: RelatedNewsProps) {
  // Получаем название категории из ID
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : categoryId;
  };

  // Форматируем дату публикации
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };
  
  return (
    <section className="container mx-auto max-w-6xl px-6 pt-12">
      <div className="border-t border-gray-700 pt-10">
        <h2 className="text-2xl font-bold mb-8">Related Articles</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {news.map(article => (
            <Link 
              href={`/news/${article._id}`} 
              key={article._id}
              className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-green-500 transition-all duration-300 shadow-lg hover:shadow-green-500/10 group"
            >
              <div className="relative h-48 overflow-hidden">
                {article.image && (
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL}/news/image/${article.image}`}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
                
                <div className="absolute top-3 left-3 z-10">
                  <span className="bg-green-600/80 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full font-medium">
                    {getCategoryName(article.category)}
                  </span>
                </div>
              </div>
              
              <div className="p-5">
                <div className="text-gray-400 text-sm mb-2">{formatDate(article.date)}</div>
                <h3 className="text-lg font-bold mb-2 group-hover:text-green-400 transition-colors">
                  {article.title}
                </h3>
                <p className="text-gray-300 text-sm line-clamp-2">{article.description}</p>
                
                <div className="mt-4 flex justify-end">
                  <span className="text-green-400 font-medium text-sm flex items-center group-hover:translate-x-1 transition-transform">
                    Read more
                    <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
