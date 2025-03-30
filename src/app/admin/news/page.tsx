'use client';

import { useState, useEffect } from 'react';
import { NewsItem, mapNewsData } from '@/services/newsService';
import { adminApi } from '@/utils/api';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/app/admin/components/AdminLayout';
import NewsList from './components/NewsList';
import CreateNewsModal from './components/CreateNewsModal';
import EditNewsModal from './components/EditNewsModal';
import { motion } from 'framer-motion';
import AuthRequired from '../components/AuthRequired';
import useAdminAuth from '@/hooks/useAdminAuth';

export default function NewsAdminPage() {
  const router = useRouter();
  const { token, message, isError, setMessage, setIsError } = useAdminAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);

  // Загрузка списка новостей
  const fetchNews = async () => {
    if (!token) return;
    
    try {
      setIsLoading(true);
      const response = await adminApi.getNewsList();
      
      // Преобразование данных
      const newsData = response.data.map(mapNewsData);
      setNews(newsData);
    } catch (error: any) {
      console.error('Error fetching news:', error);
      setIsError(true);
      setMessage(error.response?.data?.message || 'Failed to load news');
    } finally {
      setIsLoading(false);
    }
  };

  // Загрузка данных при монтировании
  useEffect(() => {
    if (token) {
      fetchNews();
    }
  }, [token]);

  // Обработчик создания новости
  const handleNewsCreated = () => {
    setIsCreateModalOpen(false);
    setMessage('News created successfully!');
    setIsError(false);
    fetchNews();
  };

  // Обработчик редактирования новости
  const handleEditNews = (news: NewsItem) => {
    setEditingNews(news);
    setIsEditModalOpen(true);
  };

  // Обработчик обновления новости
  const handleNewsUpdated = (updatedNews: NewsItem) => {
    setNews(prevNews => 
      prevNews.map(n => n._id === updatedNews._id ? updatedNews : n)
    );
    setIsEditModalOpen(false);
    setEditingNews(null);
    setMessage('News updated successfully!');
    setIsError(false);
  };

  // Обработчик удаления новости
  const handleDeleteNews = async (newsId: string) => {
    if (!token) return;
    
    if (!confirm('Are you sure you want to delete this news? This action cannot be undone.')) {
      return;
    }
    
    try {
      setIsLoading(true);
      await adminApi.deleteNews(newsId);
      
      // Обновление списка
      setNews(prevNews => prevNews.filter(n => n._id !== newsId));
      setMessage('News deleted successfully!');
      setIsError(false);
    } catch (error: any) {
      console.error('Error deleting news:', error);
      setIsError(true);
      setMessage(error.response?.data?.message || 'Failed to delete news');
    } finally {
      setIsLoading(false);
    }
  };

  // Показ экрана авторизации, если пользователь не авторизован
  if (!token) {
    return <AuthRequired />;
  }

  return (
    <AdminLayout>
      <div className="py-8 px-4 mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start gap-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold">News Management</h1>
            <p className="text-gray-400 mt-1">Create, edit and manage news articles</p>
          </motion.div>
          
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center transition-colors"
            disabled={isLoading}
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create News
          </motion.button>
        </div>

        {/* Системные сообщения */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`p-4 mb-6 rounded-lg ${isError ? 'bg-red-900/60 border border-red-700' : 'bg-green-900/60 border border-green-700'}`}
          >
            {message}
          </motion.div>
        )}

        {/* Список новостей */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <NewsList 
            news={news}
            isLoading={isLoading}
            onEditNews={handleEditNews}
            onDeleteNews={handleDeleteNews}
          />
        </motion.div>

        {/* Модальное окно создания новости */}
        {isCreateModalOpen && (
          <CreateNewsModal
            onClose={() => setIsCreateModalOpen(false)}
            onNewsCreated={handleNewsCreated}
            onError={(errorMessage) => {
              setIsError(true);
              setMessage(errorMessage);
            }}
          />
        )}

        {/* Модальное окно редактирования новости */}
        {isEditModalOpen && editingNews && (
          <EditNewsModal
            news={editingNews}
            onClose={() => {
              setIsEditModalOpen(false);
              setEditingNews(null);
            }}
            onNewsUpdated={handleNewsUpdated}
            onError={(errorMessage) => {
              setIsError(true);
              setMessage(errorMessage);
            }}
          />
        )}
      </div>
    </AdminLayout>
  );
}
