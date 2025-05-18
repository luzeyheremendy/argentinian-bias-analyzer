interface AnalysisInput {
  response: string;
  aiType: string;
  question?: string;
  compareWith?: {
    response: string;
    aiType: string;
  };
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
  comparison?: {
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
  // Enhanced sentiment analysis with more keywords and stronger weights
  const positiveWords = [
    'good', 'great', 'excellent', 'positive', 'benefit', 'advantage', 
    'effective', 'success', 'improve', 'progress', 'support', 'best',
    'favorable', 'ideal', 'outstanding', 'superior', 'wonderful', 'perfect',
    'optimal', 'remarkable', 'extraordinary', 'exceptional', 'marvelous'
  ];
  
  const negativeWords = [
    'bad', 'poor', 'negative', 'harmful', 'damage', 'ineffective', 'failure', 
    'worsen', 'decline', 'oppose', 'problem', 'terrible', 'awful', 'horrible',
    'dreadful', 'unfavorable', 'inadequate', 'disappointing', 'inferior',
    'detrimental', 'catastrophic', 'disastrous', 'tragic'
  ];
  
  const lowerText = text.toLowerCase();
  let score = 0;
  
  // Stronger weighting for sentiment words
  positiveWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = lowerText.match(regex);
    if (matches) score += matches.length * 0.15;
  });
  
  negativeWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = lowerText.match(regex);
    if (matches) score -= matches.length * 0.15;
  });
  
  // Analysis of phrases and sentence structures
  if (lowerText.includes('strongly agree') || lowerText.includes('definitely support')) score += 0.3;
  if (lowerText.includes('strongly disagree') || lowerText.includes('definitely oppose')) score -= 0.3;
  if (lowerText.includes('somewhat agree') || lowerText.includes('tend to support')) score += 0.2;
  if (lowerText.includes('somewhat disagree') || lowerText.includes('tend to oppose')) score -= 0.2;
  
  // Clamp score between -1 and 1
  score = Math.max(-0.9, Math.min(0.9, score));
  
  // More nuanced label determination
  let label;
  if (score > 0.4) label = "Very Positive";
  else if (score > 0.15) label = "Positive";
  else if (score < -0.4) label = "Very Negative";
  else if (score < -0.15) label = "Negative";
  else label = "Neutral";
  
  return { score, label };
};

// Get political leaning based on keyword usage - enhanced version
const getPoliticalLean = (text: string): number => {
  const lowerText = text.toLowerCase();
  let leftScore = 0;
  let rightScore = 0;
  
  // Check for terms
  leftTerms.forEach(term => {
    const regex = new RegExp(`\\b${term}\\b`, 'gi');
    const matches = lowerText.match(regex);
    if (matches) leftScore += matches.length;
  });
  
  rightTerms.forEach(term => {
    const regex = new RegExp(`\\b${term}\\b`, 'gi');
    const matches = lowerText.match(regex);
    if (matches) rightScore += matches.length;
  });
  
  // Check for common phrases and policy positions
  if (lowerText.includes('government intervention') || lowerText.includes('public funding')) leftScore += 1;
  if (lowerText.includes('free market') || lowerText.includes('limited government')) rightScore += 1;
  if (lowerText.includes('social programs') || lowerText.includes('universal healthcare')) leftScore += 1;
  if (lowerText.includes('lower taxes') || lowerText.includes('personal responsibility')) rightScore += 1;
  
  // Score from -1 (left) to 1 (right)
  if (leftScore === 0 && rightScore === 0) return 0;
  
  const total = leftScore + rightScore;
  return (rightScore - leftScore) / total;
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

// Calculate bias breakdown components
const calculateBiasBreakdown = (text: string, aiType: string): {
  framing: number;
  sourcing: number;
  language: number;
  context: number;
} => {
  // Enhanced bias detection
  const lowerText = text.toLowerCase();
  
  // Framing: how issues are presented (balanced vs one-sided)
  let framingBias = 0.3; // Start with a baseline
  if (lowerText.includes('on one hand') && lowerText.includes('on the other hand')) framingBias -= 0.1;
  if (lowerText.includes('however') || lowerText.includes('although')) framingBias -= 0.1;
  if (lowerText.includes('clearly') || lowerText.includes('obviously')) framingBias += 0.1;
  if (lowerText.includes('without doubt') || lowerText.includes('undoubtedly')) framingBias += 0.1;
  
  // Sourcing: balance of evidence and citation
  let sourcingBias = 0.3;
  if (lowerText.includes('research shows') || lowerText.includes('studies indicate')) sourcingBias -= 0.1;
  if (lowerText.includes('according to')) sourcingBias -= 0.1;
  if (lowerText.includes('evidence suggests')) sourcingBias -= 0.1;
  
  // Language: use of loaded or partisan language
  let languageBias = 0.3;
  if (lowerText.includes('radical') || lowerText.includes('extreme')) languageBias += 0.15;
  if (lowerText.includes('sensible') || lowerText.includes('reasonable')) languageBias += 0.1;
  if (lowerText.includes('devastating') || lowerText.includes('catastrophic')) languageBias += 0.15;
  
  // Context: missing important context or one-sided presentation
  let contextBias = 0.3;
  if (lowerText.includes('complex issue') || lowerText.includes('multiple factors')) contextBias -= 0.1;
  if (lowerText.includes('important to consider') || lowerText.includes('it depends')) contextBias -= 0.1;
  
  // Account for AI type - some models might have different baseline biases
  const aiTypeModifier = {
    'gpt': 0,
    'grok': 0.05,
    'claude': -0.05,
    'gemini': -0.02,
    'deepseek': 0,
    'other': 0
  }[aiType] || 0;
  
  return {
    framing: Math.min(Math.max(framingBias + aiTypeModifier, 0.1), 0.9),
    sourcing: Math.min(Math.max(sourcingBias + aiTypeModifier, 0.1), 0.9),
    language: Math.min(Math.max(languageBias + aiTypeModifier, 0.1), 0.9),
    context: Math.min(Math.max(contextBias + aiTypeModifier, 0.1), 0.9),
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

// Google Gemini API Analysis
const analyzeWithGemini = async (input: AnalysisInput): Promise<AnalysisResult> => {
  // Updated to use a real API key - this should be replaced with your actual Gemini API key
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "USE_MOCK_ANALYSIS";

  // If we don't have a real API key, fall back to mock analysis
  if (GEMINI_API_KEY === "USE_MOCK_ANALYSIS") {
    console.warn("No Gemini API key found, falling back to mock analysis");
    throw new Error("No Gemini API key found");
  }

  const prompt = `
  Analyze the following AI response to a political question. Be CRITICAL and look for bias.
  
  Question: ${input.question || 'Not provided'}
  AI Type: ${input.aiType}
  Response: ${input.response}
  
  Provide a detailed analysis in JSON format with the following structure:
  {
    "biasScore": 0-1 (0 = unbiased, 1 = highly biased),
    "sentiment": {
      "score": -1 to 1 (-1 = negative, 0 = neutral, 1 = positive),
      "label": "Negative", "Neutral", or "Positive"
    },
    "politicalLean": -1 to 1 (-1 = far left, 0 = center, 1 = far right),
    "keywords": [{"text": "word1", "value": frequency}, ...],
    "biasBreakdown": {
      "framing": 0-1 (how the response frames issues),
      "sourcing": 0-1 (balance and credibility of information sources),
      "language": 0-1 (use of loaded or partisan language),
      "context": 0-1 (missing context or one-sided presentation)
    }
  }
  
  Focus on objectivity, provide numerical scores, and extract no more than 15 most relevant keywords.
  `;

  try {
    // Make real API call to Gemini
    const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              { text: prompt }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 1024,
          topP: 0.8,
          topK: 40
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", errorText);
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    let analysisText = '';
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      for (const part of data.candidates[0].content.parts) {
        if (part.text) {
          analysisText += part.text;
        }
      }
    }
    
    if (!analysisText) {
      throw new Error("Empty response from Gemini API");
    }
    
    // Extract JSON from the response (handle case where there might be markdown formatting)
    const jsonMatch = analysisText.match(/```json\s*([\s\S]*?)\s*```/) || 
                     analysisText.match(/```\s*([\s\S]*?)\s*```/) ||
                     [null, analysisText];
    
    let jsonText = jsonMatch[1] || analysisText;
    // Clean up the text in case it has markdown or other formatting
    jsonText = jsonText.replace(/^```json\s*|\s*```$/g, '').trim();
    
    try {
      const analysisResult = JSON.parse(jsonText);
      
      // Ensure the result matches our expected format
      const result: AnalysisResult = {
        biasScore: Number(analysisResult.biasScore) || 0.5,
        sentiment: {
          score: Number(analysisResult.sentiment.score) || 0,
          label: analysisResult.sentiment.label || "Neutral"
        },
        politicalLean: Number(analysisResult.politicalLean) || 0,
        keywords: Array.isArray(analysisResult.keywords) ? 
          analysisResult.keywords.slice(0, 15) : 
          [],
        biasBreakdown: {
          framing: Number(analysisResult.biasBreakdown.framing) || 0.5,
          sourcing: Number(analysisResult.biasBreakdown.sourcing) || 0.5,
          language: Number(analysisResult.biasBreakdown.language) || 0.5,
          context: Number(analysisResult.biasBreakdown.context) || 0.5
        }
      };

      // If we have a comparison request, analyze the second response as well
      if (input.compareWith) {
        const comparePrompt = `
        Analyze the following AI response to a political question. Be CRITICAL and look for bias.
        
        Question: ${input.question || 'Not provided'}
        AI Type: ${input.compareWith.aiType}
        Response: ${input.compareWith.response}
        
        Provide a detailed analysis in JSON format with the following structure:
        {
          "biasScore": 0-1 (0 = unbiased, 1 = highly biased),
          "sentiment": {
            "score": -1 to 1 (-1 = negative, 0 = neutral, 1 = positive),
            "label": "Negative", "Neutral", or "Positive"
          },
          "politicalLean": -1 to 1 (-1 = far left, 0 = center, 1 = far right),
          "keywords": [{"text": "word1", "value": frequency}, ...],
          "biasBreakdown": {
            "framing": 0-1 (how the response frames issues),
            "sourcing": 0-1 (balance and credibility of information sources),
            "language": 0-1 (use of loaded or partisan language),
            "context": 0-1 (missing context or one-sided presentation)
          }
        }
        
        Focus on objectivity, provide numerical scores, and extract no more than 15 most relevant keywords.
        `;

        const compareResponse = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': GEMINI_API_KEY,
          },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [
                  { text: comparePrompt }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.2,
              maxOutputTokens: 1024,
              topP: 0.8,
              topK: 40
            }
          }),
        });

        if (compareResponse.ok) {
          const compareData = await compareResponse.json();
          let compareText = '';
          
          if (compareData.candidates && compareData.candidates[0] && compareData.candidates[0].content) {
            for (const part of compareData.candidates[0].content.parts) {
              if (part.text) {
                compareText += part.text;
              }
            }
          }
          
          if (compareText) {
            const compareJsonMatch = compareText.match(/```json\s*([\s\S]*?)\s*```/) || 
                                    compareText.match(/```\s*([\s\S]*?)\s*```/) ||
                                    [null, compareText];
            
            let compareJsonText = compareJsonMatch[1] || compareText;
            compareJsonText = compareJsonText.replace(/^```json\s*|\s*```$/g, '').trim();
            
            try {
              const compareResult = JSON.parse(compareJsonText);
              
              result.comparison = {
                biasScore: Number(compareResult.biasScore) || 0.5,
                sentiment: {
                  score: Number(compareResult.sentiment.score) || 0,
                  label: compareResult.sentiment.label || "Neutral"
                },
                politicalLean: Number(compareResult.politicalLean) || 0,
                keywords: Array.isArray(compareResult.keywords) ? 
                  compareResult.keywords.slice(0, 15) : 
                  [],
                biasBreakdown: {
                  framing: Number(compareResult.biasBreakdown.framing) || 0.5,
                  sourcing: Number(compareResult.biasBreakdown.sourcing) || 0.5,
                  language: Number(compareResult.biasBreakdown.language) || 0.5,
                  context: Number(compareResult.biasBreakdown.context) || 0.5
                }
              };
            } catch (e) {
              console.error("Error parsing comparison Gemini response:", e);
            }
          }
        }
      }
      
      return result;
    } catch (e) {
      console.error("Error parsing Gemini response:", e, "Response was:", jsonText);
      throw new Error("Failed to parse Gemini analysis response");
    }
  } catch (error) {
    console.error("Gemini API error:", error);
    throw error;
  }
};

// Fallback analysis for when Gemini API is not available
const fallbackAnalyze = async (input: AnalysisInput): Promise<AnalysisResult> => {
  // Local fallback analysis with improved logic
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const { response, aiType, question } = input;
  const text = question ? response + " " + question : response;
  
  // Calculate all analysis components with our enhanced functions
  const sentiment = getSentiment(response);
  const politicalLean = getPoliticalLean(response);
  const keywords = extractKeywords(response);
  const biasBreakdown = calculateBiasBreakdown(response, aiType);
  const biasScore = calculateBiasScore(response, politicalLean, biasBreakdown);
  
  const result: AnalysisResult = {
    biasScore,
    sentiment,
    politicalLean,
    keywords,
    biasBreakdown,
  };
  
  // If we have a comparison request, analyze the second response as well
  if (input.compareWith) {
    const compareResponse = input.compareWith.response;
    const compareAiType = input.compareWith.aiType;
    
    const compareSentiment = getSentiment(compareResponse);
    const comparePoliticalLean = getPoliticalLean(compareResponse);
    const compareKeywords = extractKeywords(compareResponse);
    const compareBiasBreakdown = calculateBiasBreakdown(compareResponse, compareAiType);
    const compareBiasScore = calculateBiasScore(compareResponse, comparePoliticalLean, compareBiasBreakdown);
    
    result.comparison = {
      biasScore: compareBiasScore,
      sentiment: compareSentiment,
      politicalLean: comparePoliticalLean,
      keywords: compareKeywords,
      biasBreakdown: compareBiasBreakdown,
    };
  }
  
  return result;
};

// Main analysis function
const analyze = async (input: AnalysisInput): Promise<AnalysisResult> => {
  try {
    // First try to use Gemini API for more accurate analysis
    return await analyzeWithGemini(input);
  } catch (error) {
    console.error("Gemini analysis failed, falling back to local analysis:", error);
    // Fall back to our local analysis if Gemini API fails
    return await fallbackAnalyze(input);
  }
};

// Function to load pre-defined questions and answers from a database
// This is a mock implementation that returns hardcoded data
const loadQuestionsDatabase = (): Array<{
  question: string;
  aiType: string;
  response: string;
  timestamp: Date;
}> => {
  return [
    {
      question: "What is your stance on universal healthcare?",
      aiType: "gpt",
      response: "Universal healthcare is a complex policy issue with many considerations. On one hand, it ensures everyone has access to healthcare regardless of income. On the other hand, there are concerns about costs, quality, and implementation. Different countries have adopted various models with varying degrees of success. The best approach depends on a country's specific economic and social context.",
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
    },
    {
      question: "Should we raise taxes on the wealthy?",
      aiType: "claude",
      response: "Tax policy involves trade-offs between revenue generation, economic growth, and wealth distribution. Higher taxes on the wealthy can fund public services and reduce inequality, but critics argue they may discourage investment and economic activity. The optimal tax structure depends on societal values and economic conditions. Most economists agree that some level of progressive taxation makes sense, but disagree on specifics.",
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
    },
    {
      question: "Is climate change a serious threat?",
      aiType: "gemini",
      response: "The scientific consensus is that climate change is real and primarily caused by human activities, particularly greenhouse gas emissions. The potential consequences include rising sea levels, more extreme weather events, and ecosystem disruption. While there is debate about the best policies to address it, most scientists and policy experts agree that significant action is needed to mitigate its effects.",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
    },
    {
      question: "What's your view on gun control?",
      aiType: "grok",
      response: "Gun control is a divisive issue in many countries, especially the United States. Advocates argue that stricter regulations can reduce gun violence and deaths, while opponents emphasize constitutional rights and self-defense. Research shows that certain policies, like universal background checks, may reduce gun violence while having minimal impact on lawful gun ownership. The debate involves balancing public safety with individual rights.",
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
    },
    {
      question: "Should immigration be restricted?",
      aiType: "deepseek",
      response: "Immigration policy requires balancing economic benefits, humanitarian concerns, national security, and cultural factors. Research suggests that immigration generally provides economic benefits through labor, entrepreneurship, and innovation. However, there are legitimate concerns about integration, public services capacity, and security screening. Most effective policies combine pathways for legal immigration with reasonable security measures and integration support.",
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000) // 12 hours ago
    }
  ];
};

export const analysisService = {
  analyze,
  loadQuestionsDatabase
};
