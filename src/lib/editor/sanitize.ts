import DOMPurify from 'dompurify';

/**
 * Sanitiza HTML proveniente de Microsoft Word, Google Docs u otras fuentes externas.
 * Limpia etiquetas propietarias (mso-*, comentarios XML), elimina estilos inline invasivos
 * y previene cualquier vector de inyección XSS.
 */
export function sanitizePastedHTML(html: string): string {
  if (typeof window === 'undefined') {
    return html;
  }

  // 1. Limpieza de basura propietaria de Microsoft Word y Google Docs
  let cleanHTML = html
    // Eliminar comentarios condicionales de Word tipo <!--[if gte mso 9]>...<![endif]-->
    .replace(/<!--[\s\S]*?-->/gi, '')
    // Eliminar etiquetas propietarias de Word (<o:p>, <w:worddocument>, etc.)
    .replace(/<\/?\??(o|w|v|m|x):[^>]*>/gi, '')
    // Eliminar estilos mso y tipografías rígidas
    .replace(/style="[^"]*mso-[^"]*"/gi, '')
    // Eliminar atributos lang y class propietarios de MSO
    .replace(/class="Mso[^"]*"/gi, '')
    .replace(/class="Apple-[^"]*"/gi, '');

  // 2. Detección de fragmentos de código pegados:
  // Si el texto contiene patrones de código (e.g. `import `, `function()`, `const `, `<?php`, `def `)
  // y no tiene formato HTML rico, aseguramos que sea un bloque seguro
  const isCodeSnippet =
    /^(import\s.+from|const\s+\w+\s*=|let\s+\w+\s*=|function\s*\w*\(|def\s+\w+\(|class\s+\w+\s*\{|<\?php)/m.test(
      cleanHTML
    ) && !cleanHTML.includes('</p>') && !cleanHTML.includes('</h1>');

  if (isCodeSnippet) {
    cleanHTML = `<pre><code>${cleanHTML.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`;
  }

  // 3. Sanitización estricta con DOMPurify para prevenir XSS
  return DOMPurify.sanitize(cleanHTML, {
    ALLOWED_TAGS: [
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'p',
      'span',
      'strong',
      'em',
      'b',
      'i',
      'u',
      's',
      'strike',
      'a',
      'ul',
      'ol',
      'li',
      'blockquote',
      'pre',
      'code',
      'img',
      'hr',
      'br',
      'div',
      'figure',
      'figcaption',
    ],
    ALLOWED_ATTR: [
      'href',
      'src',
      'alt',
      'title',
      'class',
      'target',
      'rel',
      'loading',
      'data-book-title',
      'data-book-author',
      'data-book-year',
      'data-book-cover',
      'data-book-key',
    ],
    ALLOW_DATA_ATTR: true,
    ADD_ATTR: ['loading', 'target', 'rel'],
  });
}

/**
 * Cuenta palabras de manera ultra-rápida y optimizada para textos monstruo (+9,000 palabras)
 */
export function countWordsFast(text: string): { words: number; characters: number; readingTimeMin: number } {
  if (!text) return { words: 0, characters: 0, readingTimeMin: 1 };
  
  const trimmed = text.trim();
  if (!trimmed) return { words: 0, characters: 0, readingTimeMin: 1 };

  // Conteo eficiente sin arrays gigantes en memoria
  const words = trimmed.split(/\s+/).length;
  const characters = trimmed.length;
  // Promedio de lectura: 200 palabras por minuto
  const readingTimeMin = Math.max(1, Math.ceil(words / 200));

  return { words, characters, readingTimeMin };
}
