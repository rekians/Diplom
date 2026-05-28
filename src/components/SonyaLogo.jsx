// ====== ЛОГОТИП ФАБРИКИ «СОНЯ» (векторная версия) ======
// SVG-реконструкция логотипа фабрики детской мебели «Соня».
// Используется в хедере приложения; идеально масштабируется на любой размер.
export function SonyaLogo({ height = 48 }) {
  // Соотношение сторон оригинала 236×98 ≈ 2.41:1
  const width = Math.round(height * 2.41);
  return (
    <svg
      viewBox="0 0 240 100"
      width={width}
      height={height}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', borderRadius: 6 }}
      aria-label="Фабрика детской мебели «Соня»"
    >
      <defs>
        <linearGradient id="sonyaBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E4F2FA" />
          <stop offset="100%" stopColor="#D9ECF6" />
        </linearGradient>
      </defs>

      {/* Фон */}
      <rect x="0" y="0" width="240" height="100" rx="6" fill="url(#sonyaBg)" />

      {/* Основной текст «СОНЯ» */}
      <text
        x="120"
        y="58"
        textAnchor="middle"
        fontFamily="'Trebuchet MS', 'Verdana', sans-serif"
        fontSize="44"
        fontWeight="800"
        fill="#6D7C8F"
        letterSpacing="2"
      >
        СОНЯ
      </text>

      {/* Декоративные тонкие линии по бокам подписи */}
      <line x1="22" y1="80" x2="58" y2="80" stroke="#B2BCC5" strokeWidth="0.6" />
      <line x1="182" y1="80" x2="218" y2="80" stroke="#B2BCC5" strokeWidth="0.6" />

      {/* Подпись «ФАБРИКА ДЕТСКОЙ МЕБЕЛИ» */}
      <text
        x="120"
        y="83"
        textAnchor="middle"
        fontFamily="'Trebuchet MS', 'Verdana', sans-serif"
        fontSize="9"
        fontWeight="500"
        fill="#B2BCC5"
        letterSpacing="1.4"
      >
        ФАБРИКА ДЕТСКОЙ МЕБЕЛИ
      </text>
    </svg>
  );
}
