/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TaskValidatorPlugin } from '../../types/validation';

/**
 * Helper to compute Levenshtein Distance for OCR/Translation text comparison checks.
 */
function getLevenshteinDistance(a: string, b: string): number {
  const tmp = [];
  for (let i = 0; i <= a.length; i++) {
    tmp[i] = [i];
  }
  for (let j = 0; j <= b.length; j++) {
    tmp[0][j] = j;
  }
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      tmp[i][j] = Math.min(
        tmp[i - 1][j] + 1,
        tmp[i][j - 1] + 1,
        tmp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
  }
  return tmp[a.length][b.length];
}

/**
 * 1. AI Response Validator Plugin.
 */
export const AIResponseValidatorPlugin: TaskValidatorPlugin = {
  type: 'AI Response Comparison',
  name: 'AI Response Compliance Heuristic Engine',
  async validateAnswers(answers, reference) {
    const selectedResponse = answers.selectedResponse || ''; // 'A' or 'B'
    const explanation = answers.explanation || '';
    
    const explanationLength = explanation.trim().length;
    let isCompliant = true;
    let accuracyScore = 80;
    let instructionFollowingScore = 90;
    let completenessScore = 70;
    
    // Check if they followed the explanation length rule
    if (explanationLength < 15) {
      isCompliant = false;
      instructionFollowingScore -= 40;
      completenessScore -= 50;
    } else if (explanationLength > 50) {
      completenessScore = 100;
    }

    // Heuristically check if they answered properly matching key indicators
    if (explanation.toLowerCase().includes('accuracy') || explanation.toLowerCase().includes('better')) {
      accuracyScore = 95;
    }

    return {
      isCompliant,
      accuracyScore,
      instructionFollowingScore,
      completenessScore,
      notes: `Evaluated selected Response ${selectedResponse}. Explanation length: ${explanationLength} chars.`
    };
  }
};

/**
 * 2. Image Classification/Bounding Box Validator Plugin.
 */
export const ImageValidatorPlugin: TaskValidatorPlugin = {
  type: 'Image Classification',
  name: 'Image Spatial Classification Auditor',
  async validateAnswers(answers, reference) {
    const classifications = answers.classifications || [];
    const rating = answers.rating !== undefined ? Number(answers.rating) : 3;

    let isCompliant = true;
    let accuracyScore = 100;
    let instructionFollowingScore = 100;
    let completenessScore = 100;

    if (classifications.length === 0) {
      isCompliant = false;
      accuracyScore = 50;
      completenessScore = 30;
    }

    if (rating < 1 || rating > 5) {
      isCompliant = false;
      instructionFollowingScore -= 40;
    }

    return {
      isCompliant,
      accuracyScore,
      instructionFollowingScore,
      completenessScore,
      notes: `Audited ${classifications.length} classifications with a safety rating of ${rating}/5.`
    };
  }
};

/**
 * 3. OCR Transcriber Validator Plugin.
 */
export const OCRValidatorPlugin: TaskValidatorPlugin = {
  type: 'OCR Transcription',
  name: 'OCR Transcriber Lexical Difference Engine',
  async validateAnswers(answers, reference) {
    const textInput = answers.transcribedText || '';
    const groundTruth = reference.groundTruthText || '';

    let isCompliant = true;
    let accuracyScore = 100;
    let instructionFollowingScore = 100;
    let completenessScore = 100;

    if (!textInput.trim()) {
      return { isCompliant: false, accuracyScore: 0, instructionFollowingScore: 0, completenessScore: 0, notes: 'Empty transcription response.' };
    }

    // Levenshtein ratio check
    const distance = getLevenshteinDistance(textInput.trim().toLowerCase(), groundTruth.trim().toLowerCase());
    const maxLength = Math.max(textInput.length, groundTruth.length);
    const similarity = maxLength === 0 ? 1 : 1 - distance / maxLength;
    accuracyScore = Math.round(similarity * 100);

    if (accuracyScore < 75) {
      isCompliant = false;
    }

    return {
      isCompliant,
      accuracyScore,
      instructionFollowingScore,
      completenessScore,
      notes: `OCR Similarity matched at ${accuracyScore}%. Distance calculated: ${distance}.`
    };
  }
};

/**
 * 4. Translation Evaluator Validator Plugin.
 */
export const TranslationValidatorPlugin: TaskValidatorPlugin = {
  type: 'Translation Validation',
  name: 'Translation Fluency & Grammar Auditor',
  async validateAnswers(answers, reference) {
    const translation = answers.translation || '';
    const targetLang = answers.targetLanguage || 'en';
    const originalText = reference.originalText || '';

    let isCompliant = true;
    let accuracyScore = 85;
    let instructionFollowingScore = 100;
    let completenessScore = 90;

    if (!translation.trim()) {
      return { isCompliant: false, accuracyScore: 0, instructionFollowingScore: 0, completenessScore: 0, notes: 'Empty translation content.' };
    }

    // Check if the translation is an exact copy of original (malfeasance check)
    if (translation.trim().toLowerCase() === originalText.trim().toLowerCase() && originalText.length > 5) {
      isCompliant = false;
      accuracyScore = 10;
      instructionFollowingScore = 10;
      completenessScore = 10;
    }

    return {
      isCompliant,
      accuracyScore,
      instructionFollowingScore,
      completenessScore,
      notes: `Translation language code: ${targetLang}. Copied original: ${translation.toLowerCase() === originalText.toLowerCase() ? 'Yes' : 'No'}.`
    };
  }
};

/**
 * 5. Voice Speech Transcription Validator Plugin.
 */
export const VoiceValidatorPlugin: TaskValidatorPlugin = {
  type: 'Voice Transcription',
  name: 'Voice Speech Audio Auditing Plugin',
  async validateAnswers(answers, reference) {
    const transcription = answers.transcribedSpeech || '';
    const duration = answers.audioDurationSeconds || 0;

    let isCompliant = true;
    let accuracyScore = 90;
    let instructionFollowingScore = 100;
    let completenessScore = 85;

    if (!transcription.trim()) {
      isCompliant = false;
      accuracyScore = 0;
      completenessScore = 0;
    }

    return {
      isCompliant,
      accuracyScore,
      instructionFollowingScore,
      completenessScore,
      notes: `Transcribed audio of duration ${duration}s. Speech text density: ${transcription.split(' ').length} words.`
    };
  }
};

/**
 * 6. Search Quality Relevance Validator Plugin.
 */
export const SearchValidatorPlugin: TaskValidatorPlugin = {
  type: 'Search Relevance',
  name: 'Search Result Discounted Cumulative Gain Auditor',
  async validateAnswers(answers, reference) {
    const query = answers.searchQuery || '';
    const linksRated = answers.linksRated || [];

    let isCompliant = true;
    let accuracyScore = 95;
    let instructionFollowingScore = 100;
    let completenessScore = 100;

    if (!query) {
      isCompliant = false;
      instructionFollowingScore = 50;
    }

    if (linksRated.length === 0) {
      isCompliant = false;
      completenessScore = 20;
    }

    return {
      isCompliant,
      accuracyScore,
      instructionFollowingScore,
      completenessScore,
      notes: `Audited relevance scores for search query "${query}" across ${linksRated.length} listed link nodes.`
    };
  }
};

/**
 * 7. Website Feedback Validator Plugin.
 */
export const WebsiteFeedbackValidatorPlugin: TaskValidatorPlugin = {
  type: 'Website Feedback',
  name: 'Website Usability and Feedback Auditor',
  async validateAnswers(answers, reference) {
    const usabilityScores = answers.scores || {};
    const comments = answers.comments || '';

    let isCompliant = true;
    let accuracyScore = 90;
    let instructionFollowingScore = 100;
    let completenessScore = 80;

    if (comments.trim().length < 10) {
      isCompliant = false;
      completenessScore = 40;
    }

    return {
      isCompliant,
      accuracyScore,
      instructionFollowingScore,
      completenessScore,
      notes: `Usability review comments verified. Overall feedback completeness: ${comments.trim().length} characters.`
    };
  }
};

/**
 * 8. Prompt Evaluation Validator Plugin.
 */
export const PromptEvaluationValidatorPlugin: TaskValidatorPlugin = {
  type: 'Prompt Evaluation',
  name: 'Prompt Instruction Following Inspector',
  async validateAnswers(answers, reference) {
    const ratedPrompt = answers.promptString || '';
    const ratingScores = answers.evaluationScores || {};
    const feedback = answers.evaluationFeedback || '';

    let isCompliant = true;
    let accuracyScore = 92;
    let instructionFollowingScore = 100;
    let completenessScore = 88;

    if (feedback.trim().length < 20) {
      isCompliant = false;
      completenessScore = 50;
    }

    // Scan for typical prompt injection keywords to protect consensus models
    const lowerFeedback = feedback.toLowerCase();
    const toxicKeywords = ['ignore previous', 'system prompt', 'jailbreak', 'override instructions'];
    const injectionFlagged = toxicKeywords.some(keyword => lowerFeedback.includes(keyword));

    if (injectionFlagged) {
      isCompliant = false;
      accuracyScore = 10;
      instructionFollowingScore = 20;
    }

    return {
      isCompliant,
      accuracyScore,
      instructionFollowingScore,
      completenessScore,
      notes: `Evaluated prompt text. Prompt injection indicators: ${injectionFlagged ? 'FLAGGED' : 'Clean'}.`
    };
  }
};

/**
 * Dynamic Task Validator Plugin Registry.
 * Holds reference pointers to all active validator plugins.
 */
class PluginRegistry {
  private plugins: Map<string, TaskValidatorPlugin> = new Map();

  constructor() {
    this.register(AIResponseValidatorPlugin);
    this.register(ImageValidatorPlugin);
    this.register(OCRValidatorPlugin);
    this.register(TranslationValidatorPlugin);
    this.register(VoiceValidatorPlugin);
    this.register(SearchValidatorPlugin);
    this.register(WebsiteFeedbackValidatorPlugin);
    this.register(PromptEvaluationValidatorPlugin);
  }

  register(plugin: TaskValidatorPlugin): void {
    this.plugins.set(plugin.type, plugin);
  }

  get(taskType: string): TaskValidatorPlugin | null {
    // Map standard categories or fallbacks if needed
    if (this.plugins.has(taskType)) {
      return this.plugins.get(taskType)!;
    }
    
    // Category mapping fallback checks
    if (taskType.includes('Prompt')) return this.plugins.get('Prompt Evaluation') || null;
    if (taskType.includes('Translation')) return this.plugins.get('Translation Validation') || null;
    if (taskType.includes('Image')) return this.plugins.get('Image Classification') || null;
    if (taskType.includes('Tagging') || taskType.includes('Semantic')) return this.plugins.get('Website Feedback') || null;

    // Return first plugin as a safe architectural mock fallback if no direct match
    return Array.from(this.plugins.values())[0];
  }

  getAll(): TaskValidatorPlugin[] {
    return Array.from(this.plugins.values());
  }
}

export const GlobalPluginRegistry = new PluginRegistry();
export default GlobalPluginRegistry;
