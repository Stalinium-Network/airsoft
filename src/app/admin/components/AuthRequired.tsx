'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

export default function AuthRequired() {
  const router = useRouter()
  
  // Состояния для эффектов глитча
  const [glitchActive, setGlitchActive] = useState(false)
  const [glitchText, setGlitchText] = useState(false)
  const [randomError, setRandomError] = useState('')
  const [terminalLines, setTerminalLines] = useState<string[]>([])
  
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
  
  // Эффект для запуска периодического глитча
  useEffect(() => {
    // Инициализируем терминал
    const terminalInterval = setInterval(() => {
      if (terminalLines.length < terminalCommands.length) {
        setTerminalLines(prev => [...prev, terminalCommands[prev.length]])
      } else {
        clearInterval(terminalInterval)
      }
    }, 500)
    
    // Запускаем периодический глитч
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.6) {
        setGlitchActive(true)
        
        setTimeout(() => {
          setGlitchActive(false)
        }, 150)
      }
      
      if (Math.random() > 0.7) {
        setGlitchText(true)
        
        setTimeout(() => {
          setGlitchText(false)
        }, 100)
      }
    }, 3000)
    
    // Задаем случайное сообщение об ошибке
    setRandomError(errorMessages[Math.floor(Math.random() * errorMessages.length)])
    
    return () => {
      clearInterval(glitchInterval)
      clearInterval(terminalInterval)
    }
  }, [])
  
  const handleLoginRedirect = () => {
    router.push('/admin')
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 overflow-hidden relative">
      {/* Фоновые декоративные элементы */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Сканирующие линии */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/20 bg-scan-lines pointer-events-none"></div>
        
        {/* Случайные "окна ошибок" на фоне */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          className="absolute top-20 left-[10%] w-48 h-32 bg-red-900/10 border border-red-800/30 rounded-md transform rotate-3"
        >
          <div className="h-5 bg-red-900/20 border-b border-red-800/30 flex items-center px-2">
            <div className="h-2 w-2 rounded-full bg-red-500 mr-1.5"></div>
            <div className="h-2 w-2 rounded-full bg-yellow-500 mr-1.5"></div>
            <div className="h-2 w-2 rounded-full bg-green-500/50 mr-auto"></div>
            <span className="text-red-200/80 text-[10px] font-mono">Error #9376</span>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 0.5 }}
          className="absolute top-[60%] right-[15%] w-40 h-24 bg-blue-900/10 border border-blue-800/30 rounded-md transform -rotate-2"
        >
          <div className="h-5 bg-blue-900/20 border-b border-blue-800/30 flex items-center px-2">
            <div className="h-2 w-2 rounded-full bg-red-500/50 mr-1.5"></div>
            <div className="h-2 w-2 rounded-full bg-yellow-500/50 mr-1.5"></div>
            <div className="h-2 w-2 rounded-full bg-green-500 mr-auto"></div>
            <span className="text-blue-200/80 text-[10px] font-mono">System Warning</span>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 0.8 }}
          className="absolute top-[25%] right-[25%] w-32 h-20 bg-green-900/10 border border-green-800/30 rounded-md transform rotate-[5deg]"
        >
          <div className="h-5 bg-green-900/20 border-b border-green-800/30 flex items-center px-2">
            <div className="h-2 w-2 rounded-full bg-red-500/50 mr-1.5"></div>
            <div className="h-2 w-2 rounded-full bg-yellow-500/50 mr-1.5"></div>
            <div className="h-2 w-2 rounded-full bg-green-500/50 mr-auto"></div>
            <span className="text-green-200/80 text-[10px] font-mono">Auth Failed</span>
          </div>
        </motion.div>
      </div>
      
      {/* Основное содержимое */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`bg-gray-900 border-2 border-gray-800 p-8 rounded-lg shadow-2xl max-w-md w-full relative ${glitchActive ? 'glitch-effect' : ''}`}
        style={{ boxShadow: '0 0 30px rgba(20, 83, 45, 0.3)' }}
      >
        {/* Строка заголовка окна */}
        <div className="absolute top-0 left-0 right-0 h-10 bg-gray-800 border-b border-gray-700 rounded-t-lg flex items-center px-4">
          <div className="flex space-x-2 mr-auto">
            <div className="h-3 w-3 rounded-full bg-red-500"></div>
            <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
            <div className="h-3 w-3 rounded-full bg-green-500/40"></div>
          </div>
          <div className="font-mono text-xs text-gray-400">access_control_system.exe</div>
        </div>
        
        {/* Декоративные элементы "сбоя системы" */}
        <div className={`absolute top-5 left-12 text-red-400 text-xs font-mono opacity-80 ${glitchText ? 'glitch-text' : ''}`}>
          ERR_CODE: {randomError}
        </div>
        
        <div className="absolute top-20 right-5 text-yellow-500/40 text-[10px] transform rotate-3 font-mono">
          0x0074FD21
        </div>
        
        <div className="mt-10 mb-7">
          <div className="flex items-center justify-center mb-5">
            <div className="relative">
              <motion.div
                animate={{ 
                  boxShadow: ['0 0 10px rgba(220, 38, 38, 0.7)', '0 0 20px rgba(220, 38, 38, 0.5)', '0 0 10px rgba(220, 38, 38, 0.7)'] 
                }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-20 h-20 bg-red-900/20 rounded-full flex items-center justify-center border border-red-700/50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </motion.div>
              
              <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <div className="w-full h-full bg-red-500/10 rounded-full animate-ping"></div>
              </div>
              
              {/* Мигающие точки */}
              <motion.div
                animate={{ opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 2, times: [0, 0.1, 1] }}
                className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"
              />
              <motion.div
                animate={{ opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 2, times: [0, 0.6, 1], delay: 0.5 }}
                className="absolute -bottom-1 -left-1 h-3 w-3 bg-red-500 rounded-full"
              />
            </div>
          </div>
          
          <h2 className={`text-2xl font-bold text-white mb-2 font-glitch text-center ${glitchText ? 'glitch-text' : ''}`}>
            AUTHENTICATION REQUIRED
          </h2>
          
          <div className="mx-auto h-0.5 w-20 bg-gradient-to-r from-transparent via-red-500 to-transparent my-4"></div>
          
          <p className="text-gray-400 text-center text-sm">
            Security protocols detected unauthorized access attempt. Admin verification required to continue.
          </p>
        </div>
        
        {/* Псевдо-терминал с анимированными строками */}
        <div className="bg-gray-950 border border-gray-800 rounded-md p-3 mb-6 font-mono text-xs">
          <div className="text-gray-500 mb-1">$ admin_access protocol</div>
          
          {terminalLines.map((line, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-gray-300"
            >
              {line}
            </motion.div>
          ))}
          
          <motion.div 
            animate={{ opacity: [0, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="inline-block w-2 h-4 bg-green-500 ml-1 align-middle"
          ></motion.div>
        </div>
        
        <motion.button
          onClick={handleLoginRedirect}
          whileHover={{ scale: 1.02, boxShadow: '0 0 15px rgba(34, 197, 94, 0.5)' }}
          whileTap={{ scale: 0.98 }}
          className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-600 text-gray-900 font-bold py-3 px-6 rounded transition-all w-full flex items-center justify-center group border border-green-700"
        >
          <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span className="group-hover:tracking-wider transition-all">ACCESS AUTHENTICATION PORTAL</span>
        </motion.button>
        
        {/* Декоративные линии */}
        <div className="absolute bottom-3 left-3 w-16 h-1 bg-green-500/30 rounded-full"></div>
        <div className="absolute bottom-5 left-6 w-10 h-1 bg-green-500/20 rounded-full"></div>
        <div className="absolute bottom-7 left-4 w-6 h-1 bg-green-500/10 rounded-full"></div>
        
        {/* Футер с информацией */}
        <div className="mt-5 pt-3 border-t border-gray-800 flex justify-between items-center">
          <div className="text-[10px] font-mono text-gray-500">ADMIN_SYS v1.2.07</div>
          <div className="text-[10px] font-mono text-green-500/80 flex items-center">
            <motion.div 
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="h-1.5 w-1.5 bg-green-500 rounded-full mr-1"
            ></motion.div>
            SYSTEM ACTIVE
          </div>
        </div>
      </motion.div>
      
      {/* Стили для эффектов глитча */}
      <style jsx global>{`
        @keyframes glitch {
          0% { transform: translate(0) }
          20% { transform: translate(-2px, 2px) }
          40% { transform: translate(-2px, -2px) }
          60% { transform: translate(2px, 2px) }
          80% { transform: translate(2px, -2px) }
          100% { transform: translate(0) }
        }
        
        .glitch-effect {
          animation: glitch 0.3s linear;
        }
        
        @keyframes textGlitch {
          0% { clip-path: inset(40% 0 61% 0); transform: skew(0.5deg); }
          20% { clip-path: inset(75% 0 58% 0); transform: skew(-0.1deg); }
          40% { clip-path: inset(9% 0 40% 0); transform: skew(-0.8deg); }
          60% { clip-path: inset(33% 0 97% 0); transform: skew(0.7deg); }
          80% { clip-path: inset(23% 0 34% 0); transform: skew(0.5deg); }
          100% { clip-path: inset(74% 0 94% 0); transform: skew(-0.2deg); }
        }
        
        .glitch-text {
          position: relative;
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
          text-shadow: -1px 0 red;
          animation: textGlitch 0.3s infinite linear alternate-reverse;
        }
        
        .glitch-text::after {
          left: -2px;
          text-shadow: 1px 0 blue;
          animation: textGlitch 0.3s infinite linear alternate-reverse;
        }
        
        .bg-scan-lines {
          background-image: linear-gradient(transparent 50%, rgba(0, 0, 0, 0.05) 50%);
          background-size: 100% 4px;
        }
        
        /* Определение шрифта с эффектом глитча */
        .font-glitch {
          text-shadow: 
            0.05em 0 0 rgba(255, 0, 0, 0.75),
            -0.025em -0.05em 0 rgba(0, 255, 0, 0.75),
            0.025em 0.05em 0 rgba(0, 0, 255, 0.75);
        }
      `}</style>
    </div>
  )
}
