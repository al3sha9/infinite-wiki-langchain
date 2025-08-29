'use client';

interface SimpleMarkdownProps {
  content: string;
  onWordClick: (word: string) => void;
}

export default function SimpleMarkdown({ content, onWordClick }: SimpleMarkdownProps) {

  const makeWordClickable = (text: string, extraClasses = '') => {
    return text.split(/(\s+)/).map((segment, index) => {
      // If it's just whitespace, return as is
      if (/^\s+$/.test(segment)) {
        return segment;
      }

      // Extract word and punctuation
      const match = segment.match(/^(.*?)([.,;:!?]*)$/);
      if (!match) return segment;

      const [, wordPart, punctuation] = match;

      // If there's a meaningful word (not just punctuation or numbers)
      if (wordPart && wordPart.length > 2 && /[a-zA-Z]/.test(wordPart)) {
        return (
          <span key={`${index}-${wordPart}`}>
            <span
              className={`cursor-pointer hover:underline hover:text-blue-600 transition-colors ${extraClasses}`}
              onClick={() => onWordClick(wordPart.toLowerCase())}
            >
              {wordPart}
            </span>
            {punctuation}
          </span>
        );
      }

      return <span key={index}>{segment}</span>;
    });
  };

  const renderLine = (line: string, lineIndex: number) => {
    // Handle different markdown elements
    if (line.startsWith('## ')) {
      const text = line.slice(3);
      return (
        <h2 key={lineIndex} className="text-2xl font-bold text-gray-900 mb-4 mt-6 first:mt-0">
          {makeWordClickable(text)}
        </h2>
      );
    }

    if (line.startsWith('# ')) {
      const text = line.slice(2);
      return (
        <h1 key={lineIndex} className="text-3xl font-bold text-gray-900 mb-6 mt-8 first:mt-0">
          {makeWordClickable(text)}
        </h1>
      );
    }

    if (line.startsWith('- ')) {
      const text = line.slice(2);
      return (
        <li key={lineIndex} className="text-gray-800 ml-4">
          • {processInlineMarkdown(text)}
        </li>
      );
    }

    if (line.trim() === '') {
      return <br key={lineIndex} />;
    }

    // Regular paragraph
    return (
      <p key={lineIndex} className="text-gray-800 leading-relaxed mb-4">
        {processInlineMarkdown(line)}
      </p>
    );
  };

  const processInlineMarkdown = (text: string) => {
    const parts = [];
    let currentIndex = 0;

    // Process **bold** text
    const boldRegex = /\*\*(.*?)\*\*/g;
    let match;

    while ((match = boldRegex.exec(text)) !== null) {
      // Add text before the match
      if (match.index > currentIndex) {
        const beforeText = text.slice(currentIndex, match.index);
        parts.push(...makeWordClickable(beforeText));
      }

      // Add the bold text
      const boldText = match[1];
      parts.push(
        <strong key={`bold-${match.index}`} className="font-bold text-gray-900">
          {makeWordClickable(boldText)}
        </strong>
      );

      currentIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (currentIndex < text.length) {
      const remainingText = text.slice(currentIndex);
      // Process *italic* in remaining text
      const italicRegex = /\*(.*?)\*/g;
      let italicCurrentIndex = 0;

      while ((match = italicRegex.exec(remainingText)) !== null) {
        // Add text before the match
        if (match.index > italicCurrentIndex) {
          const beforeText = remainingText.slice(italicCurrentIndex, match.index);
          parts.push(...makeWordClickable(beforeText));
        }

        // Add the italic text
        const italicText = match[1];
        parts.push(
          <em key={`italic-${currentIndex + match.index}`} className="italic">
            {makeWordClickable(italicText)}
          </em>
        );

        italicCurrentIndex = match.index + match[0].length;
      }

      // Add final remaining text
      if (italicCurrentIndex < remainingText.length) {
        const finalText = remainingText.slice(italicCurrentIndex);
        parts.push(...makeWordClickable(finalText));
      } else if (italicCurrentIndex === 0) {
        // No italic text found, add all remaining text
        parts.push(...makeWordClickable(remainingText));
      }
    }

    return parts.length > 0 ? parts : makeWordClickable(text);
  };

  const lines = content.split('\n');

  return (
    <div className="prose prose-lg max-w-none">
      {lines.map((line, index) => renderLine(line, index))}
    </div>
  );
}
