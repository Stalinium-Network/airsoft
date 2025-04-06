'use client';

import { useEffect, useState } from 'react';
import { Template, templates as availableTemplates } from '@/template';

interface TemplateSelectorProps {
  selectedTemplates: string[];
  onChange: (templates: string[]) => void;
  disabled?: boolean;
}

export default function TemplateSelector({ 
  selectedTemplates = [],
  onChange,
  disabled = false
}: TemplateSelectorProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const toggleTemplate = (templateId: string) => {
    if (selectedTemplates.includes(templateId)) {
      onChange(selectedTemplates.filter(id => id !== templateId));
    } else {
      onChange([...selectedTemplates, templateId]);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-medium text-amber-400">Game templates</h4>
        
        {selectedTemplates.length > 0 && (
          <div className="bg-amber-600/30 text-amber-300 text-xs font-medium px-2 py-1 rounded-full">
            Выбрано: {selectedTemplates.length}
          </div>
        )}
      </div>
      
      <div className="text-sm text-gray-300 mb-4 bg-gray-800/50 p-4 rounded border border-gray-700">
        <div className="flex items-start mb-2">
          <svg className="w-5 h-5 mr-2 text-amber-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Select templates to be associated with this game. Templates can affect the display of the page and add special features.</span>
        </div>
      </div>
      
      {loading ? (
        <div className="text-gray-400 text-center py-8">
          <svg className="animate-spin h-8 w-8 mx-auto mb-2 text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p>Загрузка шаблонов...</p>
        </div>
      ) : error ? (
        <div className="bg-red-900/30 border border-red-500/50 text-red-300 p-4 rounded-lg">
          <div className="flex items-start">
            <svg className="w-5 h-5 mr-2 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      ) : (
        <>
          {availableTemplates.length === 0 ? (
            <div className="text-gray-400 text-center py-8 bg-gray-750 border border-gray-700 rounded-lg">
              <svg className="w-12 h-12 mx-auto mb-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
              <p className="text-lg mb-2">Нет доступных шаблонов</p>
              <p className="text-sm">Шаблоны добавляются разработчиками через файл src/template/index.ts</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {availableTemplates.map(template => (
                <div
                  key={template.id}
                  className={`flex items-center p-4 rounded-lg border transition-all ${
                    selectedTemplates.includes(template.id)
                      ? 'bg-amber-900/30 border-amber-500/70 shadow-lg shadow-amber-900/10'
                      : 'bg-gray-750 border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className="mr-3 flex-shrink-0">
                    <input
                      type="checkbox"
                      id={`template-${template.id}`}
                      checked={selectedTemplates.includes(template.id)}
                      onChange={() => toggleTemplate(template.id)}
                      className="h-5 w-5 rounded bg-gray-900 border-gray-700 text-amber-500 focus:ring-amber-500 focus:ring-offset-gray-800"
                      disabled={disabled}
                    />
                  </div>
                  
                  <div className="flex-1">
                    <label
                      htmlFor={`template-${template.id}`}
                      className={`font-medium cursor-pointer ${
                        selectedTemplates.includes(template.id) ? 'text-amber-300' : 'text-gray-200'
                      }`}
                    >
                      {template.name}
                    </label>
                    <p className={`text-xs mt-1 ${
                      selectedTemplates.includes(template.id) ? 'text-amber-300/70' : 'text-gray-400'
                    }`}>
                      {template.help}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}