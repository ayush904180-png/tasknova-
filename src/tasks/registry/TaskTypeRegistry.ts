/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TaskTypeDefinition, TaskDifficulty } from '../../types/tasks';

/**
 * Registry system for dynamic human-in-the-loop task category plugin definition.
 */
class PluginTaskTypeRegistry {
  private registry: Map<string, TaskTypeDefinition> = new Map();

  constructor() {
    this.registerInitialTaskTypes();
  }

  /**
   * Registers a brand-new task type plugin.
   */
  register(definition: TaskTypeDefinition): void {
    if (this.registry.has(definition.type)) {
      console.warn(`[TaskTypeRegistry] Task type "${definition.type}" is already registered. Overwriting definition.`);
    }
    this.registry.set(definition.type, definition);
  }

  /**
   * Retrieves a task type definition by key.
   */
  get(type: string): TaskTypeDefinition | undefined {
    return this.registry.get(type);
  }

  /**
   * Returns all currently registered task types.
   */
  getAll(): TaskTypeDefinition[] {
    return Array.from(this.registry.values());
  }

  /**
   * Automatically initializes the 18 enterprise-grade task categories requested.
   */
  private registerInitialTaskTypes(): void {
    const initialTypes: TaskTypeDefinition[] = [
      {
        type: 'AI Response Comparison',
        name: 'AI Response Comparison',
        iconName: 'GitCompare',
        defaultDifficulty: TaskDifficulty.MEDIUM,
        defaultCoins: 15,
        validationRules: { requireChoice: true }
      },
      {
        type: 'Image Rating',
        name: 'Image Rating',
        iconName: 'Image',
        defaultDifficulty: TaskDifficulty.EASY,
        defaultCoins: 10,
        validationRules: { minRating: 1, maxRating: 5 }
      },
      {
        type: 'Image Safety Review',
        name: 'Image Safety Review',
        iconName: 'ShieldAlert',
        defaultDifficulty: TaskDifficulty.MEDIUM,
        defaultCoins: 12,
        validationRules: { requiresFlags: true }
      },
      {
        type: 'Text Classification',
        name: 'Text Classification',
        iconName: 'Tag',
        defaultDifficulty: TaskDifficulty.EASY,
        defaultCoins: 8,
        validationRules: { minTagsRequired: 1 }
      },
      {
        type: 'Voice Transcription',
        name: 'Voice Transcription',
        iconName: 'Mic',
        defaultDifficulty: TaskDifficulty.HARD,
        defaultCoins: 30,
        validationRules: { minLength: 5, enforceGrammar: true }
      },
      {
        type: 'Voice Quality Rating',
        name: 'Voice Quality Rating',
        iconName: 'Volume2',
        defaultDifficulty: TaskDifficulty.EASY,
        defaultCoins: 12,
        validationRules: { requireAcousticRating: true }
      },
      {
        type: 'Search Relevance',
        name: 'Search Relevance',
        iconName: 'Search',
        defaultDifficulty: TaskDifficulty.MEDIUM,
        defaultCoins: 14,
        validationRules: { scale: '4-point' }
      },
      {
        type: 'Prompt Evaluation',
        name: 'Prompt Evaluation',
        iconName: 'Sparkles',
        defaultDifficulty: TaskDifficulty.EASY,
        defaultCoins: 10,
        validationRules: { classificationRequired: true }
      },
      {
        type: 'Translation Review',
        name: 'Translation Review',
        iconName: 'Languages',
        defaultDifficulty: TaskDifficulty.HARD,
        defaultCoins: 25,
        validationRules: { matchAccuracy: 0.9 }
      },
      {
        type: 'OCR Verification',
        name: 'OCR Verification',
        iconName: 'FileText',
        defaultDifficulty: TaskDifficulty.MEDIUM,
        defaultCoins: 18,
        validationRules: { matchOriginal: true }
      },
      {
        type: 'Content Moderation',
        name: 'Content Moderation',
        iconName: 'ShieldCheck',
        defaultDifficulty: TaskDifficulty.MEDIUM,
        defaultCoins: 15,
        validationRules: { requiresExplanation: true }
      },
      {
        type: 'Data Labeling',
        name: 'Data Labeling',
        iconName: 'Database',
        defaultDifficulty: TaskDifficulty.EASY,
        defaultCoins: 12,
        validationRules: { geometryRequired: false }
      },
      {
        type: 'Human Preference Ranking',
        name: 'Human Preference Ranking',
        iconName: 'Sliders',
        defaultDifficulty: TaskDifficulty.MEDIUM,
        defaultCoins: 20,
        validationRules: { rankAllElements: true }
      },
      {
        type: 'Audio Classification',
        name: 'Audio Classification',
        iconName: 'Music',
        defaultDifficulty: TaskDifficulty.MEDIUM,
        defaultCoins: 16,
        validationRules: { checkBackgroundNoise: true }
      },
      {
        type: 'Video Quality Review',
        name: 'Video Quality Review',
        iconName: 'Video',
        defaultDifficulty: TaskDifficulty.HARD,
        defaultCoins: 35,
        validationRules: { checkResolutionAndFramerate: true }
      },
      {
        type: 'Website Feedback',
        name: 'Website Feedback',
        iconName: 'Layers',
        defaultDifficulty: TaskDifficulty.MEDIUM,
        defaultCoins: 22,
        validationRules: { minFeedbackLength: 15 }
      },
      {
        type: 'UI Testing',
        name: 'UI Testing',
        iconName: 'Smartphone',
        defaultDifficulty: TaskDifficulty.HARD,
        defaultCoins: 40,
        validationRules: { screenshotsRequired: false }
      },
      {
        type: 'Search Intent Validation',
        name: 'Search Intent Validation',
        iconName: 'Compass',
        defaultDifficulty: TaskDifficulty.EASY,
        defaultCoins: 10,
        validationRules: { categorizeIntent: true }
      }
    ];

    initialTypes.forEach(t => this.register(t));
  }
}

export const TaskTypeRegistry = new PluginTaskTypeRegistry();
