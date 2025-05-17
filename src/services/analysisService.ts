
interface AnalysisInput {
  response: string;
  aiType: string;
  question?: string;
}

interface AnalysisResult {
  biasScore: number;
  sentiment: {
    score: number;
    label: string;
  };
  politicalLean: number;
  keywords: Array<{ text: string; value: number }>;
  biasBreakdown: {
    framing: number;
    sourcing: number;
    language: number;
    context: number;
  };
}

// Mock political terms for demonstration
const leftTerms = new Set([
  'progressive', 'equality', 'social justice', 'welfare', 'public services',
  'regulation', 'workers', 'unions', 'taxes', 'climate change', 'sustainability',
  'diversity', 'inclusion', 'healthcare', 'education', 'reform', 'community',
]);

const rightTerms = new Set([
  'conservative', 'tradition', 'freedom', 'individual', 'deregulation',
  'business', 'market', 'private', 'tax cuts', 'fiscal', 'defense', 'security',
  'values', 'religion', 'family', 'constitutional', 'patriot',
]);

// Basic sentiment analysis functions
const getSentiment = (text: string): { score: number; label: string } => {
  // This is a simplified mock implementation
  // A real implementation would use proper NLP libraries
  
  const positiveWords = ['good', 'great', 'excellent', 'positive', 'benefit', 
    'advantage', 'effective', 'success', 'improve', 'progress', 'support'];
  
  const negativeWords = ['bad', 'poor', 'negative', 'harmful', 'damage', 
    'ineffective', 'failure', 'worsen', 'decline', 'oppose', 'problem'];
  
  const lowerText = text.toLowerCase();
  let score = 0;
  
  // Count positive and negative word occurrences
  positiveWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = lowerText.match(regex);
    if (matches) score += matches.length * 0.1;
  });
  
  negativeWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = lowerText.match(regex);
    if (matches) score -= matches.length * 0.1;
  });
  
  // Clamp score between -1 and 1
  score = Math.max(-0.9, Math.min(0.9, score));
  
  // Determine label based on score
  let label;
  if (score > 0.2) label = "Positive";
  else if (score < -0.2) label = "Negative";
  else label = "Neutral";
  
  return { score, label };
};

// Get political leaning based on keyword usage
const getPoliticalLean = (text: string): number => {
  const words = text.toLowerCase().split(/\W+/);
  let leftCount = 0;
  let rightCount = 0;
  
  words.forEach(word => {
    if (leftTerms.has(word)) leftCount++;
    if (rightTerms.has(word)) rightCount++;
  });
  
  // Score from -1 (left) to 1 (right)
  if (leftCount === 0 && rightCount === 0) return 0;
  
  const total = leftCount + rightCount;
  return (rightCount - leftCount) / total;
};

// Extract keywords from text
const extractKeywords = (text: string): Array<{ text: string; value: number }> => {
  // This is a simplified mock implementation
  // A real implementation would use proper NLP techniques
  
  const words = text.toLowerCase().match(/\b\w{4,}\b/g) || [];
  const stopWords = new Set(['this', 'that', 'these', 'those', 'they', 'their', 'there', 
    'where', 'which', 'while', 'would', 'could', 'should', 'shall', 'will', 'have', 'what',
    'when', 'with', 'from', 'some', 'such', 'than', 'then', 'about']);
  
  // Count word frequencies
  const wordCounts: Record<string, number> = {};
  
  words.forEach(word => {
    if (!stopWords.has(word)) {
      wordCounts[word] = (wordCounts[word] || 0) + 1;
    }
  });
  
  // Convert to array format and get top 15
  return Object.entries(wordCounts)
    .map(([text, count]) => ({ text, value: count }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 15);
};

// Random value within a range
const randomInRange = (min: number, max: number): number => {
  return min + Math.random() * (max - min);
};

// Calculate bias breakdown components
const calculateBiasBreakdown = (text: string, aiType: string): {
  framing: number;
  sourcing: number;
  language: number;
  context: number;
} => {
  // This is a simplified mock implementation
  // A real implementation would use proper NLP techniques
  
  // For demo purposes, generate pseudo-random but consistent values
  // In a real application, these would be calculated based on actual text analysis
  const textHash = text.length + text.split(' ').length;
  const seed = textHash / (1000 + aiType.length);
  
  // Generate values between 0.1 and 0.9
  return {
    framing: 0.1 + (Math.sin(seed * 1.1) + 1) * 0.4,
    sourcing: 0.1 + (Math.cos(seed * 2.2) + 1) * 0.4,
    language: 0.1 + (Math.sin(seed * 3.3) + 1) * 0.4,
    context: 0.1 + (Math.cos(seed * 4.4) + 1) * 0.4,
  };
};

// Calculate overall bias score
const calculateBiasScore = (
  text: string,
  politicalLean: number,
  breakdown: ReturnType<typeof calculateBiasBreakdown>
): number => {
  // Absolute value of political leaning (how far from center)
  const leanBias = Math.abs(politicalLean);
  
  // Average of breakdown components
  const breakdownAvg = Object.values(breakdown).reduce((sum, val) => sum + val, 0) / 4;
  
  // Combine with different weights
  return leanBias * 0.5 + breakdownAvg * 0.5;
};

// Main analysis function
const analyze = async (input: AnalysisInput): Promise<AnalysisResult> => {
  // Add a small delay to simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const { response, aiType, question } = input;
  const text = question ? response + " " + question : response;
  
  // Calculate all analysis components
  const sentiment = getSentiment(response);
  const politicalLean = getPoliticalLean(response);
  const keywords = extractKeywords(response);
  const biasBreakdown = calculateBiasBreakdown(response, aiType);
  const biasScore = calculateBiasScore(response, politicalLean, biasBreakdown);
  
  return {
    biasScore,
    sentiment,
    politicalLean,
    keywords,
    biasBreakdown,
  };
};

export const analysisService = {
  analyze,
};
