'use client';

interface ClickableTextProps {
  text: string;
  onWordClick: (word: string) => void;
}

export default function ClickableText({ text, onWordClick }: ClickableTextProps) {
  // Split text into words while preserving punctuation
  const splitTextIntoWords = (text: string) => {
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
          <span key={index}>
            <span
              className="cursor-pointer hover:underline hover:text-blue-600 transition-colors"
              onClick={() => onWordClick(wordPart.toLowerCase())}
            >
              {wordPart}
            </span>
            {punctuation}
          </span>
        );
      }

      return segment;
    });
  };

  return (
    <div className="prose prose-lg max-w-none">
      <p className="text-gray-800 leading-relaxed">
        {splitTextIntoWords(text)}
      </p>
    </div>
  );
}
