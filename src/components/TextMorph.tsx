import React, { useState, useEffect } from 'react';

interface TextMorphProps {
  texts: string[];
  delay: number;
  random?: boolean;
}

/**
 * TextMorph компонент для анимированного переключения текста
 * @param texts - массив строк для отображения
 * @param delay - время задержки между переключениями в миллисекундах
 * @param random - если true, тексты будут выбираться в случайном порядке
 */
const TextMorph: React.FC<TextMorphProps> = ({ texts, delay, random = false }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [currentText, setCurrentText] = useState<string>(texts[0] || '');

  useEffect(() => {
    if (!texts.length) return;

    const intervalId = setInterval(() => {
      if (random) {
        // Генерация случайного индекса, отличного от текущего
        let newIndex: number;
        do {
          newIndex = Math.floor(Math.random() * texts.length);
        } while (newIndex === currentIndex && texts.length > 1);
        
        setCurrentIndex(newIndex);
        setCurrentText(texts[newIndex]);
      } else {
        // Последовательное переключение
        const nextIndex = (currentIndex + 1) % texts.length;
        setCurrentIndex(nextIndex);
        setCurrentText(texts[nextIndex]);
      }
    }, delay);

    // Очистка интервала при размонтировании компонента
    return () => clearInterval(intervalId);
  }, [texts, delay, random, currentIndex]);

  // Перезапуск компонента при изменении входных параметров
  useEffect(() => {
    if (texts.length) {
      setCurrentIndex(0);
      setCurrentText(texts[0]);
    }
  }, [texts]);

  return <div className="text-morph">{currentText}</div>;
};

export default TextMorph;