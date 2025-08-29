'use client';

import { useState } from 'react';
import SimpleMarkdown from './SimpleMarkdown';
import LoadingSpinner from './LoadingSpinner';

interface WikiArticle {
  title: string;
  content: string;
}

interface WikiPageProps {
  initialArticle: WikiArticle;
}

export default function WikiPage({ initialArticle }: WikiPageProps) {
  const [currentArticle, setCurrentArticle] = useState<WikiArticle>(initialArticle);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleWordClick = async (word: string) => {
    if (isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/wiki?word=${encodeURIComponent(word)}`);

      if (!response.ok) {
        throw new Error('Failed to fetch wiki article');
      }

      const article: WikiArticle = await response.json();
      setCurrentArticle(article);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Infinite Wiki
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Click on any word to explore deeper. Every word is a gateway to new knowledge.
          </p>
        </div>

        {/* Wiki Article */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            {isLoading ? (
              <LoadingSpinner />
            ) : error ? (
              <div className="text-center p-8">
                <div className="text-red-600 mb-4">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-lg font-semibold">Error loading article</p>
                  <p className="text-gray-600">{error}</p>
                </div>
                <button
                  onClick={() => setError(null)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b-2 border-gray-200 pb-4">
                  {currentArticle.title}
                </h2>
                <SimpleMarkdown
                  content={currentArticle.content}
                  onWordClick={handleWordClick}
                />
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
