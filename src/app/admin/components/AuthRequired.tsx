'use client'

import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

export default function AuthRequired() {
  const router = useRouter()
  
  // Состояния для эффектов глитча
  const [glitchActive, setGlitchActive] = useState(false)
  const [glitchText, setGlitchText] = useState(false)
  const [randomError, setRandomError] = useState('')
  const [terminalLines, setTerminalLines] = useState<string[]>([])
  const [errorWindows, setErrorWindows] = useState<Array<{id: number, type: string, x: number, y: number, rotation: number, scale: number}>>([])
  
  // Массив возможных сообщений об ошибках
  const errorMessages = [
    'ERR_ACCESS_DENIED',
    'PERMISSION_FAILURE',
    'AUTHENTICATION_REQUIRED',
    'SECURITY_PROTOCOL_BREACH',
    'ADMIN_VERIFICATION_FAILED',
    'UNAUTHORIZED_ATTEMPT',
    'ZONE_LOCKDOWN_ACTIVE'
  ]
  
  // Расширенный набор сообщений об ошибках для окон
  const errorWindowMessages = [
    { title: 'Error #9376', content: 'Authentication verification failed' },
    { title: 'System Warning', content: 'Unauthorized access attempt detected' },
    { title: 'Access Denied', content: 'Security protocol violated' },
    { title: 'Critical Error', content: 'Invalid security token' },
    { title: 'Warning', content: 'Administrative privileges required' },
    { title: 'System Alert', content: 'Connection insecure' },
    { title: 'Fatal Error', content: 'Authentication service unavailable' }
  ]
  
  // Массив строк для псевдо-терминала
  const terminalCommands = [
    '> checking credentials...',
    '> verifying access token...',
    '> token verification failed',
    '> security protocol initiated',
    '> access denied: authorization required',
    '> initiating security lockdown',
    '> redirecting to authentication portal'
  ]
  
  // Функция для создания случайных окон ошибок с улучшенным распределением
  const generateRandomErrorWindows = () => {
    const windows = [];
    // Создаем от 6 до 10 окон ошибок для desktop и меньше для mobile
    const isMobile = window.innerWidth < 768;
    const windowCount = isMobile ? (Math.floor(Math.random() * 3) + 3) : (Math.floor(Math.random() * 4) + 6);
    
    // Разделим экран на сегменты для лучшего распределения окон
    const segments = 4;
    const segmentWidth = 100 / segments;
    const segmentHeight = 100 / segments;
    
    // Заполняем каждый сегмент чтобы избежать скопления окон в одном месте
    for (let i = 0; i < windowCount; i++) {
      const segX = i % segments;
      const segY = Math.floor(i / segments) % segments;
      
      windows.push({
        id: i,
        type: Math.random() > 0.5 ? 'error' : (Math.random() > 0.5 ? 'warning' : 'critical'),
        x: (segX * segmentWidth) + (Math.random() * segmentWidth * 0.8) + (segmentWidth * 0.1),
        y: (segY * segmentHeight) + (Math.random() * segmentHeight * 0.8) + (segmentHeight * 0.1),
        rotation: Math.random() * 10 - 5, // от -5 до 5 градусов
        scale: Math.random() * 0.4 + 0.8 // случайный размер от 0.8 до 1.2
      });
    }
    
    return windows;
  };
  
  // Эффект для запуска периодического глитча
  useEffect(() => {
    // Проверка, запускается ли код в браузере
    if (typeof window === 'undefined') return;
    
    // Инициализируем терминал с улучшенным timing
    const terminalInterval = setInterval(() => {
      if (terminalLines.length < terminalCommands.length) {
        setTerminalLines(prev => [...prev, terminalCommands[prev.length]])
      } else {
        clearInterval(terminalInterval)
      }
    }, 400) // Ускоренное появление строк
    
    // Запускаем периодический глитч с улучшенной частотой
    const glitchInterval = setInterval(() => {
      // Небольшой глитч часто
      if (Math.random() > 0.5) {
        setGlitchActive(true)
        
        setTimeout(() => {
          setGlitchActive(false)
        }, 150)
      }
      
      // Текстовый глитч реже
      if (Math.random() > 0.65) {
        setGlitchText(true)
        
        setTimeout(() => {
          setGlitchText(false)
        }, 100)
      }
    }, 2000) // Увеличена частота глитча
    
    // Задаем случайное сообщение об ошибке
    setRandomError(errorMessages[Math.floor(Math.random() * errorMessages.length)])
    
    // Генерируем случайные окна ошибок
    setErrorWindows(generateRandomErrorWindows())
    
    // Создаем интервал для динамического обновления окон
    const errorWindowsInterval = setInterval(() => {
      if (Math.random() > 0.6) {
        // Обновляем несколько окон для большей динамики
        setErrorWindows(prev => {
          if (prev.length === 0) return prev;
          const newWindows = [...prev];
          
          // Выбираем 1-3 окна для обновления
          const updateCount = Math.floor(Math.random() * 3) + 1;
          for (let i = 0; i < updateCount; i++) {
            const indexToUpdate = Math.floor(Math.random() * newWindows.length);
            newWindows[indexToUpdate] = {
              ...newWindows[indexToUpdate],
              rotation: Math.random() * 8 - 4,
              scale: Math.random() * 0.2 + 0.9 // Размер может меняться
            };
          }
          return newWindows;
        });
        
        // Периодически добавляем новое окно ошибки
        if (Math.random() > 0.7 && errorWindows.length < 15) {
          setErrorWindows(prev => [
            ...prev, 
            {
              id: Date.now(),
              type: Math.random() > 0.5 ? 'error' : (Math.random() > 0.5 ? 'warning' : 'critical'),
              x: Math.random() * 80 + 10,
              y: Math.random() * 80 + 10,
              rotation: Math.random() * 10 - 5,
              scale: Math.random() * 0.4 + 0.8
            }
          ]);
        }
      }
    }, 3000);
    
    return () => {
      clearInterval(glitchInterval)
      clearInterval(terminalInterval)
      clearInterval(errorWindowsInterval)
    }
  }, [])
  
  const handleLoginRedirect = () => {
    router.push('/admin')
  }
  
  // Функция для определения цвета окна ошибки c улучшенными стилями
  const getErrorWindowColors = (type: string) => {
    switch (type) {
      case 'error':
        return {
          bg: 'bg-gradient-to-br from-red-950/20 to-red-900/5',
          border: 'border-red-800/40',
          title: 'bg-gradient-to-r from-red-900/30 to-red-950/20',
          titleBorder: 'border-red-800/40',
          text: 'text-red-300/90',
          glow: 'shadow-[0_0_15px_rgba(220,38,38,0.15)]'
        };
      case 'warning':
        return {
          bg: 'bg-gradient-to-br from-yellow-950/20 to-yellow-900/5',
          border: 'border-yellow-800/40',
          title: 'bg-gradient-to-r from-yellow-900/30 to-yellow-950/20',
          titleBorder: 'border-yellow-800/40',
          text: 'text-yellow-300/90',
          glow: 'shadow-[0_0_15px_rgba(202,138,4,0.15)]'
        };
      case 'critical':
        return {
          bg: 'bg-gradient-to-br from-purple-950/20 to-purple-900/5',
          border: 'border-purple-800/40',
          title: 'bg-gradient-to-r from-purple-900/30 to-purple-950/20',
          titleBorder: 'border-purple-800/40',
          text: 'text-purple-300/90',
          glow: 'shadow-[0_0_15px_rgba(147,51,234,0.15)]'
        };
      default:
        return {
          bg: 'bg-gradient-to-br from-blue-950/20 to-blue-900/5',
          border: 'border-blue-800/40',
          title: 'bg-gradient-to-r from-blue-900/30 to-blue-950/20',
          titleBorder: 'border-blue-800/40',
          text: 'text-blue-300/90',
          glow: 'shadow-[0_0_15px_rgba(37,99,235,0.15)]'
        };
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 bg-[radial-gradient(circle_at_center,rgba(37,38,44,1)_0%,rgba(17,17,23,1)_100%)] overflow-hidden relative">
      {/* Динамический фон с шумом и эффектами */}
      <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none"></div>
      
      {/* Сетка и анимированный градиент */}
      <div className="absolute inset-0 bg-grid opacity-[0.03] pointer-events-none"></div>
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        animate={{ 
          background: [
            'radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.03) 0%, transparent 70%)',
            'radial-gradient(circle at 50% 80%, rgba(59, 130, 246, 0.03) 0%, transparent 70%)',
            'radial-gradient(circle at 80% 40%, rgba(59, 130, 246, 0.03) 0%, transparent 70%)',
            'radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.03) 0%, transparent 70%)'
          ]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Добавляем анимированные сканирующие линии */}
      <div className="absolute inset-0 bg-scan-lines pointer-events-none"></div>
      <motion.div 
        className="absolute inset-0 h-full w-full pointer-events-none"
        initial={{ y: '-100%', opacity: 0.05 }}
        animate={{ y: '200%', opacity: 0.1 }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        style={{
          background: 'linear-gradient(to bottom, transparent, rgba(59, 130, 246, 0.05), transparent)',
          height: '30%'
        }}
      />
      
      {/* Случайные "окна ошибок" на фоне с улучшенной анимацией */}
      <AnimatePresence>
        {errorWindows.map((window) => {
          const colors = getErrorWindowColors(window.type);
          const errorInfo = errorWindowMessages[window.id % errorWindowMessages.length];
          
          return (
            <motion.div 
              key={window.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: [0, 0.7, 0.5, 0.6],
                y: [0, -2, 1, 0],
                x: [0, 1, -1, 0],
                scale: window.scale || 1
              }}
              exit={{ opacity: 0, scale: 0.5, y: 20 }}
              transition={{ 
                duration: 3, 
                times: [0, 0.3, 0.7, 1],
                delay: window.id * 0.1,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className={`absolute ${colors.bg} ${colors.border} border rounded-md shadow-lg overflow-hidden backdrop-blur-sm ${colors.glow}`}
              style={{
                top: `${window.y}%`,
                left: `${window.x}%`,
                width: `${Math.floor(Math.random() * 120) + 100}px`,
                height: `${Math.floor(Math.random() * 60) + 80}px`,
                transform: `rotate(${window.rotation}deg)`,
                zIndex: 10
              }}
            >
              <div className={`h-6 ${colors.title} ${colors.titleBorder} border-b flex items-center px-2 justify-between`}>
                <div className="flex items-center space-x-1.5">
                  <motion.div 
                    whileHover={{ scale: 1.2 }} 
                    className="h-2 w-2 rounded-full bg-red-500"
                  ></motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.2 }} 
                    className="h-2 w-2 rounded-full bg-yellow-500"
                  ></motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.2 }} 
                    className="h-2 w-2 rounded-full bg-green-500/50"
                  ></motion.div>
                </div>
                <span className={`${colors.text} text-[10px] font-mono truncate`}>{errorInfo.title}</span>
              </div>
              <div className="p-3">
                <div className={`text-xs ${colors.text} font-mono`}>
                  {errorInfo.content}
                </div>
                {window.type === 'critical' && (
                  <motion.div 
                    animate={{ opacity: [0.3, 0.8, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="mt-2 h-1 bg-purple-500/40 rounded"
                  ></motion.div>
                )}
                {window.type === 'error' && (
                  <div className="mt-2 flex justify-end">
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="text-[8px] bg-red-950/30 px-2 py-0.5 rounded border border-red-800/30"
                    >
                      RETRY
                    </motion.div>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Основное содержимое с улучшенным дизайном */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`relative w-full max-w-md mx-auto bg-gradient-to-b from-gray-900 to-gray-950 border-2 ${glitchActive ? 'border-red-800/60' : 'border-gray-800/80'} p-8 rounded-lg shadow-2xl ${glitchActive ? 'glitch-effect' : ''} backdrop-blur-sm md:backdrop-blur-md`}
        style={{ 
          boxShadow: '0 0 40px rgba(20, 0, 20, 0.2), 0 0 15px rgba(220, 38, 38, 0.1)',
          zIndex: 50
        }}
      >
        {/* Улучшенные декоративные сегменты в углах */}
        <div className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-red-500/30 rounded-tl-md"></div>
        <div className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 border-red-500/30 rounded-tr-md"></div>
        <div className="absolute bottom-0 left-0 w-10 h-10 border-b-2 border-l-2 border-red-500/30 rounded-bl-md"></div>
        <div className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 border-red-500/30 rounded-br-md"></div>
        
        {/* Улучшенная строка заголовка окна */}
        <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-r from-gray-900/90 to-gray-800/90 backdrop-blur-sm border-b border-gray-700/80 rounded-t-lg flex items-center px-4">
          <div className="flex space-x-2 mr-auto">
            <motion.div 
              whileHover={{ scale: 1.2 }}
              className="h-3 w-3 rounded-full bg-red-500 cursor-pointer shadow-sm shadow-red-500/30"
            ></motion.div>
            <motion.div 
              whileHover={{ scale: 1.2 }}
              className="h-3 w-3 rounded-full bg-yellow-500 cursor-pointer shadow-sm shadow-yellow-500/30"
            ></motion.div>
            <motion.div 
              whileHover={{ scale: 1.2 }}
              className="h-3 w-3 rounded-full bg-green-500/70 cursor-pointer shadow-sm shadow-green-500/30"
            ></motion.div>
          </div>
          <div className="font-mono text-xs text-gray-300 flex items-center">
            <motion.div 
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="h-1.5 w-1.5 bg-red-500 rounded-full mr-2"
            ></motion.div>
            access_control_system.exe
          </div>
        </div>
        
        {/* Улучшенные декоративные элементы "сбоя системы" */}
        <div className={`absolute top-5 left-14 text-red-400 text-xs font-mono opacity-80 ${glitchText ? 'glitch-text' : ''}`} data-text={`ERR_CODE: ${randomError}`}>
          ERR_CODE: {randomError}
        </div>
        
        <div className="absolute top-24 right-6 text-yellow-500/40 text-[10px] transform rotate-3 font-mono">
          0x0074FD21
        </div>
        
        <div className="absolute bottom-24 left-6 text-blue-500/40 text-[10px] transform -rotate-2 font-mono">
          SYS.32.AUTH.REQUIRED
        </div>
        
        <div className="mt-12 mb-7 sm:mt-14">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <motion.div
                animate={{ 
                  boxShadow: ['0 0 15px rgba(220, 38, 38, 0.7)', '0 0 25px rgba(220, 38, 38, 0.5)', '0 0 15px rgba(220, 38, 38, 0.7)'],
                  scale: [1, 1.03, 1]
                }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-red-900/30 to-red-950/20 rounded-full flex items-center justify-center border border-red-700/60"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 sm:h-12 sm:w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </motion.div>
              
              {/* Эффект пульсирующего кольца */}
              <motion.div
                animate={{ 
                  opacity: [0, 0.5, 0],
                  scale: [0.8, 1.2]
                }}
                transition={{ 
                  repeat: Infinity,
                  duration: 2,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 rounded-full border-2 border-red-500/30"
              ></motion.div>
              
              {/* Мигающие элементы с улучшенной анимацией */}
              <motion.div
                animate={{ opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 2, times: [0, 0.1, 1] }}
                className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full shadow-lg shadow-red-500/50"
              />
              <motion.div
                animate={{ opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 2, times: [0, 0.6, 1], delay: 0.5 }}
                className="absolute -bottom-1 -left-1 h-3 w-3 bg-red-500 rounded-full shadow-lg shadow-red-500/50"
              />
              
              {/* Улучшенный орбитальный элемент */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 pointer-events-none"
                style={{ transformOrigin: 'center center' }}
              >
                <motion.div 
                  className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 h-2 w-2 bg-red-400/80 rounded-full shadow-sm shadow-red-400/50"
                ></motion.div>
              </motion.div>
            </div>
          </div>
          
          <h2 
            className={`text-xl sm:text-2xl font-bold text-white mb-2 font-glitch text-center tracking-wider ${glitchText ? 'glitch-text' : ''}`}
            data-text="AUTHENTICATION REQUIRED"
          >
            AUTHENTICATION REQUIRED
          </h2>
          
          <div className="mx-auto h-0.5 w-24 sm:w-32 bg-gradient-to-r from-transparent via-red-500 to-transparent my-4"></div>
          
          <p className="text-gray-300 text-center text-sm max-w-xs mx-auto">
            Security protocols detected unauthorized access attempt. Admin verification required to continue.
          </p>
        </div>
        
        {/* Улучшенный псевдо-терминал с анимированными строками */}
        <div className="bg-gray-950 border border-gray-800 rounded-md p-3 mb-6 font-mono text-xs relative shadow-inner overflow-hidden">
          {/* Улучшенные блики на терминале */}
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/10 to-transparent pointer-events-none"></div>
          
          <div className="text-gray-500 mb-1 flex items-center">
            <span className="text-green-500 mr-1">$</span> admin_access protocol
          </div>
          
          <AnimatePresence mode="popLayout">
            {terminalLines.map((line, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="text-gray-300"
              >
                {line}
              </motion.div>
            ))}
          </AnimatePresence>
          
          <motion.div 
            animate={{ opacity: [0, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="inline-block w-2 h-4 bg-green-500 ml-1 align-middle"
          ></motion.div>
        </div>
        
        {/* Улучшенная кнопка с 3D эффектами */}
        <motion.button
          onClick={handleLoginRedirect}
          whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(34, 197, 94, 0.2), 0 0 10px rgba(34, 197, 94, 0.1)' }}
          whileTap={{ scale: 0.98, boxShadow: '0 0 5px rgba(34, 197, 94, 0.2)' }}
          className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-600 text-gray-900 font-bold py-3 px-6 rounded-md transition-all w-full flex items-center justify-center group border border-green-700/80 relative overflow-hidden shadow-lg shadow-green-500/10"
        >
          {/* Улучшенный эффект сканирования кнопки */}
          <motion.div 
            animate={{ 
              x: ['-100%', '200%'],
              opacity: [0, 0.8, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: 'loop',
              times: [0, 0.5, 1],
              ease: "easeInOut"
            }}
            className="absolute inset-0 w-1/4 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 pointer-events-none"
          ></motion.div>
          
          <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span className="group-hover:tracking-wider transition-all uppercase font-medium text-sm sm:text-base">ACCESS AUTHENTICATION PORTAL</span>
        </motion.button>
        
        {/* Улучшенные декоративные элементы */}
        <div className="absolute bottom-3 left-3 w-16 h-1 bg-gradient-to-r from-green-500/50 to-green-500/10 rounded-full"></div>
        <div className="absolute bottom-5 left-6 w-10 h-1 bg-gradient-to-r from-green-500/40 to-green-500/5 rounded-full"></div>
        <div className="absolute bottom-7 left-4 w-6 h-1 bg-gradient-to-r from-green-500/30 to-green-500/0 rounded-full"></div>
        
        {/* Футер с информацией */}
        <div className="mt-5 pt-3 border-t border-gray-800/80 flex justify-between items-center">
          <div className="text-[10px] font-mono text-gray-500">ADMIN_SYS v1.2.07</div>
          <div className="text-[10px] font-mono text-green-500/80 flex items-center">
            <motion.div 
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="h-1.5 w-1.5 bg-green-500 rounded-full mr-1 shadow-sm shadow-green-500/50"
            ></motion.div>
            SYSTEM ACTIVE
          </div>
        </div>
      </motion.div>
      
      {/* Улучшенные стили для эффектов глитча и фона */}
      <style jsx global>{`
        @keyframes glitch {
          0% { transform: translate(0) }
          20% { transform: translate(-3px, 2px) }
          40% { transform: translate(-2px, -3px) }
          60% { transform: translate(3px, 2px) }
          80% { transform: translate(2px, -2px) }
          100% { transform: translate(0) }
        }
        
        .glitch-effect {
          animation: glitch 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
        }
        
        @keyframes textGlitch {
          0% { clip-path: inset(40% 0 61% 0); transform: skew(0.5deg); }
          20% { clip-path: inset(75% 0 58% 0); transform: skew(-0.2deg); }
          40% { clip-path: inset(9% 0 40% 0); transform: skew(-0.8deg); }
          60% { clip-path: inset(33% 0 97% 0); transform: skew(0.7deg); }
          80% { clip-path: inset(23% 0 34% 0); transform: skew(0.5deg); }
          100% { clip-path: inset(74% 0 94% 0); transform: skew(-0.2deg); }
        }
        
        .glitch-text {
          position: relative;
          color: white;
          text-shadow: 0 0 2px rgba(255, 255, 255, 0.8);
        }
        
        .glitch-text::before,
        .glitch-text::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        
        .glitch-text::before {
          left: 2px;
          text-shadow: -1px 0 #ff0040;
          animation: textGlitch 0.3s infinite linear alternate-reverse;
        }
        
        .glitch-text::after {
          left: -2px;
          text-shadow: 1px 0 #3498db;
          animation: textGlitch 0.3s infinite linear alternate-reverse;
          animation-delay: 0.15s;
        }
        
        .bg-scan-lines {
          background-image: linear-gradient(transparent 50%, rgba(16, 16, 20, 0.05) 50%);
          background-size: 100% 4px;
        }
        
        .bg-noise {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }
        
        .bg-grid {
          background-image: linear-gradient(to right, rgba(255, 255, 255, 0.07) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255, 255, 255, 0.07) 1px, transparent 1px);
          background-size: 20px 20px;
        }
        
        /* Улучшенный глитч-шрифт */
        .font-glitch {
          text-shadow: 
            0.05em 0 0 rgba(255, 0, 0, 0.75),
            -0.025em -0.05em 0 rgba(0, 255, 0, 0.75),
            0.025em 0.05em 0 rgba(0, 0, 255, 0.75);
          animation: glitchText 5s infinite;
        }
        
        @keyframes glitchText {
          0%, 100% { text-shadow: 0.05em 0 0 rgba(255, 0, 0, 0.75), -0.025em -0.05em 0 rgba(0, 255, 0, 0.75), 0.025em 0.05em 0 rgba(0, 0, 255, 0.75); }
          33% { text-shadow: 0.05em 0 0 rgba(255, 0, 0, 0.85), -0.05em -0.025em 0 rgba(0, 255, 0, 0.85), 0.025em 0.05em 0 rgba(0, 0, 255, 0.85); }
          66% { text-shadow: 0.05em 0.025em 0 rgba(255, 0, 0, 0.85), -0.05em -0.05em 0 rgba(0, 255, 0, 0.85), 0 0.05em 0 rgba(0, 0, 255, 0.85); }
        }
        
        /* Медиа-запросы для лучшей адаптивности */
        @media (max-width: 480px) {
          .glitch-text::before, .glitch-text::after {
            display: none;
          }
          
          .font-glitch {
            text-shadow: 0 0 8px rgba(255, 0, 0, 0.7);
          }
        }
      `}</style>
    </div>
  )
}
