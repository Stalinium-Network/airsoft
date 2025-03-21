"use client";
import { useState } from "react";

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center text-white mb-6">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-green-600">
            STALKER AIRSOFT
          </span>
        </h1>
        <p className="text-center text-gray-400 mb-16 max-w-2xl mx-auto">
          Погрузись в атмосферу Зоны через реалистичные страйкбольные сценарии
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card 
            title="Realistic Scenarios" 
            description="Experience meticulously crafted missions based on the STALKER universe, complete with artifacts, anomalies, and faction warfare."
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.75 1.94a.75.75 0 00-1.5 0v8.31c0 .414.336.75.75.75h8.31a.75.75 0 000-1.5H13.5V1.94zM12 2.5a9.5 9.5 0 100 19 9.5 9.5 0 000-19z" />
              </svg>
            }
          />
          
          <Card 
            title="Atmospheric Locations" 
            description="Play in carefully selected venues that recreate the post-apocalyptic feel of the Zone, from abandoned facilities to dense forests."
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" />
              </svg>
            }
          />
          
          <Card 
            title="Immersive Prop Design" 
            description="Encounter anomalies, artifacts, and specialized equipment that bring the STALKER universe to life in our meticulously designed games."
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.378 1.602a.75.75 0 00-.756 0L3 6.632l9 5.25 9-5.25-8.622-5.03zM21.75 7.93l-9 5.25v9l8.628-5.032a.75.75 0 00.372-.648V7.93zM11.25 22.18v-9l-9-5.25v8.57a.75.75 0 00.372.648l8.628 5.033z" />
              </svg>
            }
          />
        </div>
      </div>
    </div>
  );
}

interface CardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

function Card({ title, description, icon }: CardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="relative group overflow-hidden rounded-xl transition-all duration-500 backdrop-filter transform-gpu hover:translate-y-[-2px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Базовый фон карточки */}
      <div className="absolute inset-0 bg-gray-800/60 backdrop-blur-sm transition-colors duration-500 group-hover:bg-gray-800/80"></div>
      
      {/* Тонкий диагональный паттерн, который появляется при наведении */}
      <div className={`absolute inset-0 transition-opacity duration-700 ${isHovered ? 'opacity-10' : 'opacity-0'}`}>
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,64,60,0.8)_25%,rgba(68,64,60,0.8)_50%,transparent_50%,transparent_75%,rgba(68,64,60,0.8)_75%)] bg-[length:8px_8px]"></div>
      </div>
      
      {/* Тонкая цветная линия сверху, которая расширяется при наведении */}
      <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400/70 to-transparent transition-transform duration-700 ease-out ${isHovered ? 'scale-x-100' : 'scale-x-0'}`}></div>
      
      {/* Геометрические акценты в углах */}
      <div className={`absolute top-0 left-0 w-8 h-8 transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute top-0 left-0 w-[2px] h-6 bg-emerald-400/50 transition-all duration-500 group-hover:h-10"></div>
        <div className="absolute top-0 left-0 h-[2px] w-6 bg-emerald-400/50 transition-all duration-500 group-hover:w-10"></div>
      </div>
      
      <div className={`absolute bottom-0 right-0 w-8 h-8 transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute bottom-0 right-0 w-[2px] h-6 bg-emerald-400/50 transition-all duration-500 group-hover:h-10"></div>
        <div className="absolute bottom-0 right-0 h-[2px] w-6 bg-emerald-400/50 transition-all duration-500 group-hover:w-10"></div>
      </div>
      
      {/* Цифровой шум в углах, который появляется при наведении */}
      <div className={`absolute top-3 right-3 w-10 h-10 transition-opacity duration-700 delay-100 ${isHovered ? 'opacity-20' : 'opacity-0'}`}>
        <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuOCIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNub2lzZSkiLz48L3N2Zz4=')] opacity-40"></div>
      </div>
      
      <div className={`absolute bottom-3 left-3 w-10 h-10 transition-opacity duration-700 delay-100 ${isHovered ? 'opacity-20' : 'opacity-0'}`}>
        <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuOCIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNub2lzZSkiLz48L3N2Zz4=')] opacity-40"></div>
      </div>
      
      {/* Тонкая вертикальная сканирующая линия, которая перемещается при наведении */}
      <div 
        className={`absolute inset-y-0 w-[1px] bg-gradient-to-b from-transparent via-emerald-400/40 to-transparent transition-all duration-1200 ease-in-out ${isHovered ? 'opacity-100' : 'opacity-0'}`}
        style={{
          left: isHovered ? '100%' : '0%',
          transitionProperty: 'left, opacity',
        }}
      ></div>
      
      {/* Основное содержимое */}
      <div className="relative p-6 flex flex-col h-[350px] z-10">
        {/* Иконка с эффектом смещения при наведении */}
        <div className="text-emerald-400 mb-5 p-3 rounded-lg w-14 h-14 flex items-center justify-center transition-all duration-500 group-hover:text-emerald-300 group-hover:translate-y-[-4px]">
          {icon}
        </div>
        
        {/* Заголовок с более тонким эффектом изменения цвета */}
        <h3 className="text-xl font-semibold tracking-wide text-white mb-4 transition-all duration-500 group-hover:text-emerald-300">
          {title}
        </h3>
        
        {/* Динамическая линия под заголовком */}
        <div className="relative h-[2px] mb-5 overflow-hidden">
          <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-emerald-400/70 to-emerald-400/0 transition-transform duration-500 origin-left group-hover:scale-x-150"></div>
          <div className={`absolute inset-y-0 left-0 w-3 bg-emerald-300/90 transition-all duration-700 ${isHovered ? 'translate-x-16 opacity-100' : '-translate-x-3 opacity-0'}`}></div>
        </div>
        
        {/* Описание с улучшенным эффектом изменения цвета */}
        <p className="text-gray-300 leading-relaxed mt-1 transition-all duration-500 group-hover:text-gray-200">
          {description}
        </p>
        
        {/* Декоративный элемент в нижней части */}
        <div className="mt-auto pt-4">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-emerald-500/50 transition-all duration-300 group-hover:bg-emerald-400/70"></div>
            <div className="h-[1px] flex-grow bg-gradient-to-r from-emerald-500/40 to-transparent"></div>
          </div>
        </div>
      </div>
      
      {/* Тончайшая рамка для четкого обозначения границ карточки */}
      <div className="absolute inset-0 rounded-xl border border-white/5 pointer-events-none"></div>
    </div>
  );
}