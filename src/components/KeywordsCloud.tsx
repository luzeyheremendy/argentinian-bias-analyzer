
interface KeywordsCloudProps {
  keywords: Array<{ text: string; value: number }>;
}

export const KeywordsCloud = ({ keywords }: KeywordsCloudProps) => {
  // Sort keywords by value (highest first)
  const sortedKeywords = [...keywords].sort((a, b) => b.value - a.value);
  
  // Get font size based on value (between 1-5)
  const getFontSize = (value: number) => {
    const min = Math.min(...keywords.map(k => k.value));
    const max = Math.max(...keywords.map(k => k.value));
    const normalized = (value - min) / (max - min);
    return 0.8 + normalized * 1.2; // Scale from 0.8 to 2.0
  };

  return (
    <div className="flex flex-wrap gap-2 justify-center py-4">
      {sortedKeywords.map((keyword, index) => (
        <div
          key={index}
          className="bg-blue-50 text-blue-800 px-3 py-1 rounded-full"
          style={{
            fontSize: `${getFontSize(keyword.value)}rem`,
            opacity: 0.6 + (keyword.value / Math.max(...keywords.map(k => k.value))) * 0.4
          }}
        >
          {keyword.text}
        </div>
      ))}
    </div>
  );
};
