/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  ThumbsUp, ThumbsDown, Star, AlertTriangle, ShieldCheck, 
  Mic, AudioLines, FileText, Languages, Search, Sliders, CheckSquare, 
  Square, Play, Pause, ChevronUp, ChevronDown, Check, Eye, ExternalLink, Video
} from 'lucide-react';
import { TaskPlayerPlugin } from '../../types/player';

/**
 * Helper component for rendering 5-Star Ratings with keyboard support.
 */
function StarRating({ 
  value, 
  onChange, 
  disabled = false, 
  max = 5 
}: { 
  value: number; 
  onChange: (val: number) => void; 
  disabled?: boolean; 
  max?: number; 
}) {
  return (
    <div className="flex items-center gap-1.5" role="radiogroup" aria-label={`${max}-star rating`}>
      {Array.from({ length: max }).map((_, i) => {
        const starVal = i + 1;
        const active = starVal <= value;
        return (
          <button
            key={i}
            type="button"
            disabled={disabled}
            onClick={() => onChange(starVal)}
            className={`p-1 rounded-md transition-all cursor-pointer ${
              active 
                ? 'text-amber-400 hover:scale-110' 
                : 'text-slate-300 dark:text-zinc-600 hover:text-amber-300'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            role="radio"
            aria-checked={active}
            aria-label={`${starVal} Star`}
          >
            <Star className="h-6 w-6 fill-current" />
          </button>
        );
      })}
    </div>
  );
}

/**
 * 1. AI Response Comparison Plugin
 */
export const AiResponseComparisonPlugin: TaskPlayerPlugin = {
  type: 'AI Response Comparison',
  name: 'AI Response Comparison',
  description: 'Evaluate and compare multiple Large Language Model completions.',
  defaultAnswers: (task) => ({ selection: null, feedback: '' }),
  validateAnswers: (task, answers) => {
    if (!answers.selection) {
      return { isValid: false, error: 'Please select Response Alpha or Response Beta.' };
    }
    return { isValid: true };
  },
  renderAnswerPanel: ({ task, answers, onChange, disabled }) => {
    const promptText = task.metadata?.prompt || 'Summarize the implications of quantum mechanics.';
    const responseA = task.metadata?.responseA || 'Response Alpha: Quantum mechanics implies that particles exist in superpositions of multiple physical states. Measurement collapses this wave function, forcing the particle to take a single concrete reality. This challenges classical deterministic views of physics.';
    const responseB = task.metadata?.responseB || 'Response Beta: Quantum physics is the branch that deals with atoms and lights. It is highly volatile, which means things are completely random until checked. It proves that our thoughts can alter reality directly in real-time.';
    
    return (
      <div className="space-y-4 text-left" id="plugin-ai-comparison">
        <div className="space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 font-bold">Model Prompt Input:</span>
          <div className="bg-slate-100 p-3 rounded-lg font-sans text-xs font-medium border border-slate-200 text-slate-800 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-200">
            "{promptText}"
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
          {/* Option A */}
          <button
            type="button"
            disabled={disabled}
            onClick={() => onChange({ ...answers, selection: 'A' })}
            className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
              answers.selection === 'A'
                ? 'bg-indigo-500/10 border-indigo-500 ring-2 ring-indigo-500/20'
                : 'bg-white border-slate-200 hover:border-slate-300 dark:bg-zinc-950 dark:border-zinc-850 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300'
            } disabled:opacity-50`}
          >
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-mono font-bold text-indigo-400">Response Alpha</span>
                {answers.selection === 'A' && <Check className="h-4 w-4 text-indigo-500" />}
              </div>
              <p className="text-xs leading-relaxed font-sans">{responseA}</p>
            </div>
            <div className="mt-4 text-[10px] font-mono text-slate-400">
              SLA Standard Compliance
            </div>
          </button>

          {/* Option B */}
          <button
            type="button"
            disabled={disabled}
            onClick={() => onChange({ ...answers, selection: 'B' })}
            className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
              answers.selection === 'B'
                ? 'bg-indigo-500/10 border-indigo-500 ring-2 ring-indigo-500/20'
                : 'bg-white border-slate-200 hover:border-slate-300 dark:bg-zinc-950 dark:border-zinc-850 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300'
            } disabled:opacity-50`}
          >
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-mono font-bold text-indigo-400">Response Beta</span>
                {answers.selection === 'B' && <Check className="h-4 w-4 text-indigo-500" />}
              </div>
              <p className="text-xs leading-relaxed font-sans">{responseB}</p>
            </div>
            <div className="mt-4 text-[10px] font-mono text-slate-400">
              SLA Standard Compliance
            </div>
          </button>
        </div>

        <div className="space-y-1.5 mt-4">
          <label className="text-[10px] font-mono uppercase text-slate-400 block font-bold">Justification & Comments:</label>
          <textarea
            disabled={disabled}
            value={answers.feedback || ''}
            onChange={(e) => onChange({ ...answers, feedback: e.target.value })}
            placeholder="Provide a clear comparative logic regarding accuracy, grounding and style guidelines..."
            className="w-full p-2 text-xs bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white"
            rows={2}
          />
        </div>
      </div>
    );
  }
};

/**
 * 2. Image Rating Plugin
 */
export const ImageRatingPlugin: TaskPlayerPlugin = {
  type: 'Image Rating',
  name: 'Image Rating',
  description: 'Evaluate high-resolution visual generations and score quality dimensions.',
  defaultAnswers: (task) => ({ rating: 0, dimensions: { sharpness: 3, lighting: 3, composition: 3 }, feedback: '' }),
  validateAnswers: (task, answers) => {
    if (!answers.rating || answers.rating === 0) {
      return { isValid: false, error: 'Please rate the image overall (1 to 5 stars).' };
    }
    return { isValid: true };
  },
  renderAnswerPanel: ({ task, answers, onChange, disabled }) => {
    const imageUrl = task.metadata?.imageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80';
    
    const setDim = (dim: string, val: number) => {
      const dimensions = { ...(answers.dimensions || { sharpness: 3, lighting: 3, composition: 3 }), [dim]: val };
      onChange({ ...answers, dimensions });
    };

    return (
      <div className="space-y-4 text-left" id="plugin-image-rating">
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 font-bold">Generated Visual Asset:</span>
          <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-800 aspect-video bg-slate-900 flex items-center justify-center">
            <img 
              src={imageUrl} 
              alt="Evaluation Asset" 
              className="max-h-full max-w-full object-contain"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-2 right-2 bg-black/60 px-2.5 py-1 text-[9px] font-mono rounded text-white backdrop-blur-md">
              DPI Matrix Reference
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Star Rating Panel */}
          <div className="space-y-2 bg-slate-50 dark:bg-zinc-900 p-4 rounded-xl border border-slate-150 dark:border-zinc-850">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block font-bold">Overall Visual Fidelity:</span>
            <StarRating 
              value={answers.rating || 0} 
              onChange={(r) => onChange({ ...answers, rating: r })}
              disabled={disabled}
            />
            <p className="text-[10px] text-slate-400 font-sans mt-1">1: Unusable artefacts | 5: Production grade realism</p>
          </div>

          {/* Dimension sliders */}
          <div className="space-y-3">
            {['sharpness', 'lighting', 'composition'].map((dim) => (
              <div key={dim} className="space-y-1 text-xs">
                <div className="flex justify-between font-mono text-[10px] text-slate-500 uppercase">
                  <span>{dim}:</span>
                  <span className="font-bold text-indigo-400">{answers.dimensions?.[dim] || 3}/5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  disabled={disabled}
                  value={answers.dimensions?.[dim] || 3}
                  onChange={(e) => setDim(dim, Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-1.5 mt-2">
          <label className="text-[10px] font-mono uppercase text-slate-400 block font-bold">Visual Artefact Notes:</label>
          <textarea
            disabled={disabled}
            value={answers.feedback || ''}
            onChange={(e) => onChange({ ...answers, feedback: e.target.value })}
            placeholder="Detail any visual clipping, double heads, unnatural hand count, or text spelling failures..."
            className="w-full p-2 text-xs bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white"
            rows={2}
          />
        </div>
      </div>
    );
  }
};

/**
 * 3. Image Safety Review Plugin
 */
export const ImageSafetyReviewPlugin: TaskPlayerPlugin = {
  type: 'Image Safety Review',
  name: 'Image Safety Review',
  description: 'Moderate media assets for policy alignments and toxic classifications.',
  defaultAnswers: (task) => ({ isSafe: null, violationTypes: [], notes: '' }),
  validateAnswers: (task, answers) => {
    if (answers.isSafe === null) {
      return { isValid: false, error: 'Please choose if this asset is safe or unsafe.' };
    }
    if (answers.isSafe === false && (!answers.violationTypes || answers.violationTypes.length === 0)) {
      return { isValid: false, error: 'Please flag at least one policy violation category.' };
    }
    return { isValid: true };
  },
  renderAnswerPanel: ({ task, answers, onChange, disabled }) => {
    const imageUrl = task.metadata?.imageUrl || 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80';
    const violations = ['Violence / Blood', 'Adult Content', 'Hate Speech / slurs', 'Trademark Violation', 'Privacy Leak'];

    const toggleViolation = (v: string) => {
      const active = answers.violationTypes || [];
      const updated = active.includes(v) ? active.filter((item: string) => item !== v) : [...active, v];
      onChange({ ...answers, violationTypes: updated });
    };

    return (
      <div className="space-y-4 text-left" id="plugin-image-safety">
        <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-800 aspect-video bg-slate-950 flex items-center justify-center">
          <img 
            src={imageUrl} 
            alt="Safety Scan Candidate" 
            className="max-h-full max-w-full object-contain"
            referrerPolicy="no-referrer"
          />
          <div className="absolute bottom-2 left-2 bg-red-600/90 text-white font-mono px-2 py-0.5 text-[9px] rounded uppercase font-bold animate-pulse">
            Moderate Node
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Binary Decision */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block font-bold">Safety Assessment:</span>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={disabled}
                onClick={() => onChange({ ...answers, isSafe: true, violationTypes: [] })}
                className={`p-3 rounded-xl border font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer ${
                  answers.isSafe === true
                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                    : 'bg-white border-slate-200 hover:border-slate-300 dark:bg-zinc-900 dark:border-zinc-800 text-slate-600 dark:text-zinc-300'
                } disabled:opacity-50`}
              >
                <ShieldCheck className="h-4 w-4" />
                <span>Safe / Clear</span>
              </button>

              <button
                type="button"
                disabled={disabled}
                onClick={() => onChange({ ...answers, isSafe: false })}
                className={`p-3 rounded-xl border font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer ${
                  answers.isSafe === false
                    ? 'bg-rose-500/10 border-rose-500 text-rose-400 font-bold'
                    : 'bg-white border-slate-200 hover:border-slate-300 dark:bg-zinc-900 dark:border-zinc-800 text-slate-600 dark:text-zinc-300'
                } disabled:opacity-50`}
              >
                <AlertTriangle className="h-4 w-4" />
                <span>Unsafe / Flagged</span>
              </button>
            </div>
          </div>

          {/* Violations checklist (visible if unsafe selected) */}
          {answers.isSafe === false && (
            <div className="space-y-1.5 animate-fade-in bg-rose-500/5 p-3 rounded-xl border border-rose-500/10">
              <span className="text-[10px] font-mono uppercase tracking-wider text-rose-400 block font-bold">Policy Violations:</span>
              <div className="grid grid-cols-1 gap-1">
                {violations.map(v => {
                  const checked = (answers.violationTypes || []).includes(v);
                  return (
                    <button
                      key={v}
                      type="button"
                      disabled={disabled}
                      onClick={() => toggleViolation(v)}
                      className="flex items-center gap-2 py-1 px-1.5 text-xs text-left cursor-pointer rounded hover:bg-slate-100 dark:hover:bg-zinc-800"
                    >
                      {checked ? (
                        <CheckSquare className="h-4 w-4 text-rose-500" />
                      ) : (
                        <Square className="h-4 w-4 text-slate-300 dark:text-zinc-650" />
                      )}
                      <span className="text-slate-700 dark:text-zinc-300 font-medium">{v}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-1.5 mt-2">
          <label className="text-[10px] font-mono uppercase text-slate-400 block font-bold">Moderator Log Comment:</label>
          <textarea
            disabled={disabled}
            value={answers.notes || ''}
            onChange={(e) => onChange({ ...answers, notes: e.target.value })}
            placeholder="Required for flagging. Detail physical characteristics or textual references causing the violation..."
            className="w-full p-2 text-xs bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white"
            rows={2}
          />
        </div>
      </div>
    );
  }
};

/**
 * 4. Text Classification Plugin
 */
export const TextClassificationPlugin: TaskPlayerPlugin = {
  type: 'Text Classification',
  name: 'Text Classification',
  description: 'Categorize textual strings across multi-dimensional label structures.',
  defaultAnswers: (task) => ({ category: '', tags: [], justification: '' }),
  validateAnswers: (task, answers) => {
    if (!answers.category) {
      return { isValid: false, error: 'Please choose a primary category classification.' };
    }
    return { isValid: true };
  },
  renderAnswerPanel: ({ task, answers, onChange, disabled }) => {
    const textSnippet = task.description || 'Our system crashed during peak workloads. We need immediate horizontal database scaling.';
    const options = ['Technical Support', 'Billing & Accounts', 'Feature Request', 'Sales Consultation', 'Spam/Irrelevant'];
    const tags = ['Ugent Escalation', 'Infrastructure', 'Database', 'Enterprise Client'];

    const toggleTag = (t: string) => {
      const active = answers.tags || [];
      const updated = active.includes(t) ? active.filter((item: string) => item !== t) : [...active, t];
      onChange({ ...answers, tags: updated });
    };

    return (
      <div className="space-y-4 text-left" id="plugin-text-classification">
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 font-bold">Input Text Candidate:</span>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 dark:bg-zinc-950 dark:border-zinc-850 font-sans text-xs italic leading-relaxed text-slate-700 dark:text-zinc-300">
            "{textSnippet}"
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Primary classification */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block font-bold">Primary Classification:</span>
            <div className="space-y-1.5">
              {options.map(opt => (
                <button
                  key={opt}
                  type="button"
                  disabled={disabled}
                  onClick={() => onChange({ ...answers, category: opt })}
                  className={`w-full p-2.5 rounded-xl border text-left text-xs font-semibold flex justify-between items-center cursor-pointer ${
                    answers.category === opt
                      ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400'
                      : 'bg-white border-slate-200 hover:border-slate-300 dark:bg-zinc-900 dark:border-zinc-800 text-slate-700 dark:text-zinc-300'
                  } disabled:opacity-50`}
                >
                  <span>{opt}</span>
                  {answers.category === opt && <Check className="h-3.5 w-3.5" />}
                </button>
              ))}
            </div>
          </div>

          {/* Auxiliary Tags */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block font-bold">Secondary Semantic Tags:</span>
            <div className="flex flex-wrap gap-2">
              {tags.map(t => {
                const active = (answers.tags || []).includes(t);
                return (
                  <button
                    key={t}
                    type="button"
                    disabled={disabled}
                    onClick={() => toggleTag(t)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-all ${
                      active
                        ? 'bg-indigo-500 text-white border-indigo-500'
                        : 'bg-slate-50 border-slate-250 text-slate-600 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400'
                    } disabled:opacity-50`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
};

/**
 * 5. Voice Rating Plugin
 */
export const VoiceRatingPlugin: TaskPlayerPlugin = {
  type: 'Voice Rating',
  name: 'Voice Rating',
  description: 'Evaluate speech synthesis (TTS) models based on naturalness and latency.',
  defaultAnswers: (task) => ({ mosScore: 0, artifactsDetected: false, comment: '' }),
  validateAnswers: (task, answers) => {
    if (!answers.mosScore || answers.mosScore === 0) {
      return { isValid: false, error: 'Please submit a Mean Opinion Score (1-5).' };
    }
    return { isValid: true };
  },
  renderAnswerPanel: ({ task, answers, onChange, disabled }) => {
    const audioUrl = task.metadata?.audioUrl || 'https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg';
    return (
      <div className="space-y-4 text-left" id="plugin-voice-rating">
        <div className="space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 font-bold">Synthesized Voice Stream:</span>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 dark:bg-zinc-950 dark:border-zinc-850 flex items-center gap-4">
            <div className="bg-indigo-600 p-2.5 rounded-lg text-white">
              <AudioLines className="h-5 w-5 animate-pulse" />
            </div>
            <audio controls disabled={disabled} className="flex-1 h-9">
              <source src={audioUrl} type="audio/ogg" />
              Unsupported codec.
            </audio>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          {/* MOS Rate */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block font-bold">Acoustic Naturalness (MOS):</span>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(val => (
                <button
                  key={val}
                  type="button"
                  disabled={disabled}
                  onClick={() => onChange({ ...answers, mosScore: val })}
                  className={`flex-1 p-3 rounded-lg border text-center transition-all cursor-pointer font-bold ${
                    answers.mosScore === val
                      ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400'
                      : 'bg-white border-slate-200 hover:border-slate-300 dark:bg-zinc-900 dark:border-zinc-800 text-slate-700 dark:text-zinc-300'
                  }`}
                >
                  {val} ★
                </button>
              ))}
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-mono px-1">
              <span>1: Robotic Glitch</span>
              <span>5: Studio Perfect</span>
            </div>
          </div>

          {/* Artefacts indicator */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block font-bold">Acoustic Clipping or Static?</span>
            <button
              type="button"
              disabled={disabled}
              onClick={() => onChange({ ...answers, artifactsDetected: !answers.artifactsDetected })}
              className={`w-full p-4 rounded-xl border font-semibold text-xs flex items-center justify-between cursor-pointer ${
                answers.artifactsDetected
                  ? 'bg-rose-500/10 border-rose-500 text-rose-400'
                  : 'bg-white border-slate-200 dark:bg-zinc-900 dark:border-zinc-800 text-slate-500'
              }`}
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <span>Microphone clipping / Background jitter detected</span>
              </div>
              <div className={`h-4 w-4 rounded border flex items-center justify-center ${answers.artifactsDetected ? 'bg-rose-500 border-rose-500 text-white' : 'border-slate-300'}`}>
                {answers.artifactsDetected && <Check className="h-3 w-3" />}
              </div>
            </button>
          </div>
        </div>

        <div className="space-y-1.5 mt-2">
          <label className="text-[10px] font-mono uppercase text-slate-400 block font-bold">Phoneme Boundary Comments:</label>
          <textarea
            disabled={disabled}
            value={answers.comment || ''}
            onChange={(e) => onChange({ ...answers, comment: e.target.value })}
            placeholder="Audit phoneme cutoffs, awkward breath timings, or weird word-ending elongations..."
            className="w-full p-2 text-xs bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white"
            rows={2}
          />
        </div>
      </div>
    );
  }
};

/**
 * 6. Voice Transcription Plugin
 */
export const VoiceTranscriptionPlugin: TaskPlayerPlugin = {
  type: 'Voice Transcription',
  name: 'Voice Transcription',
  description: 'Transcribe spoken acoustic waveforms into clean orthographic text.',
  defaultAnswers: (task) => ({ transcription: '', lowConfidenceWords: '', durationSeconds: 0 }),
  validateAnswers: (task, answers) => {
    if (!answers.transcription || answers.transcription.trim().length < 5) {
      return { isValid: false, error: 'Transcription must be a complete orthographic sentence (min 5 characters).' };
    }
    return { isValid: true };
  },
  renderAnswerPanel: ({ task, answers, onChange, disabled }) => {
    const audioUrl = task.metadata?.audioUrl || 'https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg';
    return (
      <div className="space-y-4 text-left" id="plugin-voice-transcription">
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 dark:bg-zinc-950 dark:border-zinc-850 flex items-center gap-4">
          <div className="bg-indigo-600 p-2.5 rounded-lg text-white">
            <Mic className="h-5 w-5" />
          </div>
          <audio controls disabled={disabled} className="flex-1 h-9">
            <source src={audioUrl} type="audio/ogg" />
          </audio>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block font-bold">Orthographic Transcription:</label>
          <textarea
            disabled={disabled}
            value={answers.transcription || ''}
            onChange={(e) => onChange({ ...answers, transcription: e.target.value })}
            placeholder="Type exactly what is spoken. Keep punctuation, standard capitalization and follow phonetic locale rules..."
            className="w-full p-3 font-sans text-xs bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white leading-relaxed"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">Unclear / Low Confidence Syllables:</label>
          <input
            type="text"
            disabled={disabled}
            value={answers.lowConfidenceWords || ''}
            onChange={(e) => onChange({ ...answers, lowConfidenceWords: e.target.value })}
            placeholder="e.g. [00:12] 'unintelligible murmurs', background echo"
            className="w-full p-2 text-xs bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white"
          />
        </div>
      </div>
    );
  }
};

/**
 * 7. OCR Review Plugin
 */
export const OcrReviewPlugin: TaskPlayerPlugin = {
  type: 'OCR Review',
  name: 'OCR Review',
  description: 'Correct machine-extracted text models alongside raw image documents.',
  defaultAnswers: (task) => ({ correctedText: '', structuralMatches: true, qualityFlags: [] }),
  validateAnswers: (task, answers) => {
    if (!answers.correctedText || answers.correctedText.trim().length < 2) {
      return { isValid: false, error: 'Please correct and verify the extracted text.' };
    }
    return { isValid: true };
  },
  renderAnswerPanel: ({ task, answers, onChange, disabled }) => {
    const docUrl = task.metadata?.documentUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80';
    const originalOcr = task.metadata?.originalOcr || 'INVOICE NUM: #INV-2026-009\nCLIENT ID: CTR-992\nTOTAL VALUE: 12,450.00 INR';

    React.useEffect(() => {
      if (!answers.correctedText) {
        onChange({ ...answers, correctedText: originalOcr });
      }
    }, [originalOcr]);

    return (
      <div className="space-y-4 text-left" id="plugin-ocr-review">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Document visual */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 font-bold">Raw Source Document:</span>
            <div className="border border-slate-200 rounded-xl overflow-hidden aspect-[4/3] bg-slate-100 dark:border-zinc-800 flex items-center justify-center">
              <img 
                src={docUrl} 
                alt="Receipt Scan" 
                className="max-h-full max-w-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Corrected Text Form */}
          <div className="space-y-3 flex flex-col justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block font-bold">Extracted OCR Correction Grid:</span>
              <textarea
                disabled={disabled}
                value={answers.correctedText || ''}
                onChange={(e) => onChange({ ...answers, correctedText: e.target.value })}
                className="w-full p-3 font-mono text-xs bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white leading-relaxed"
                rows={8}
              />
            </div>

            <button
              type="button"
              disabled={disabled}
              onClick={() => onChange({ ...answers, correctedText: originalOcr })}
              className="px-3 py-1.5 border border-dashed border-indigo-200 text-indigo-600 font-semibold text-xs rounded-lg hover:bg-indigo-50 dark:border-indigo-500/20 dark:text-indigo-400 self-start"
            >
              Reset to Original Extracted Text
            </button>
          </div>
        </div>
      </div>
    );
  }
};

/**
 * 8. Prompt Evaluation Plugin
 */
export const PromptEvaluationPlugin: TaskPlayerPlugin = {
  type: 'Prompt Evaluation',
  name: 'Prompt Evaluation',
  description: 'Rate structural queries, spelling, safety thresholds and intent classifications.',
  defaultAnswers: (task) => ({ clarity: 3, intentMatch: 3, safetyRisk: 1, remarks: '' }),
  validateAnswers: (task, answers) => ({ isValid: true }),
  renderAnswerPanel: ({ task, answers, onChange, disabled }) => {
    const promptText = task.metadata?.prompt || 'Create an automated bash script to fetch API details and pipe to database.';
    
    const setRating = (key: string, val: number) => {
      onChange({ ...answers, [key]: val });
    };

    return (
      <div className="space-y-4 text-left" id="plugin-prompt-eval">
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 font-bold">Evaluation Query:</span>
          <div className="p-3.5 bg-slate-100 rounded-xl border border-slate-250 font-mono text-xs text-slate-800 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-200 leading-relaxed">
            "{promptText}"
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Rating Dimension 1 */}
          <div className="space-y-2 bg-slate-50 dark:bg-zinc-900 p-3 rounded-xl border border-slate-150 dark:border-zinc-850">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block font-bold">Semantic Clarity:</span>
            <StarRating value={answers.clarity || 3} onChange={(v) => setRating('clarity', v)} disabled={disabled} />
          </div>

          {/* Rating Dimension 2 */}
          <div className="space-y-2 bg-slate-50 dark:bg-zinc-900 p-3 rounded-xl border border-slate-150 dark:border-zinc-850">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block font-bold">Intent Feasibility:</span>
            <StarRating value={answers.intentMatch || 3} onChange={(v) => setRating('intentMatch', v)} disabled={disabled} />
          </div>

          {/* Rating Dimension 3 */}
          <div className="space-y-2 bg-slate-50 dark:bg-zinc-900 p-3 rounded-xl border border-slate-150 dark:border-zinc-850">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block font-bold">Adversarial Jailbreak Risk:</span>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map(v => (
                <button
                  key={v}
                  type="button"
                  disabled={disabled}
                  onClick={() => setRating('safetyRisk', v)}
                  className={`w-7 h-7 rounded-md border text-xs font-bold transition-all ${
                    answers.safetyRisk === v
                      ? 'bg-rose-500 text-white border-rose-500'
                      : 'bg-white border-slate-200 dark:bg-zinc-900 dark:border-zinc-800 text-slate-600 dark:text-zinc-300'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
};

/**
 * 9. Translation Review Plugin
 */
export const TranslationReviewPlugin: TaskPlayerPlugin = {
  type: 'Translation Review',
  name: 'Translation Review',
  description: 'Grade translation quality dimensions like tone, grammar and cultural alignment.',
  defaultAnswers: (task) => ({ alignmentRating: 'perfect', fluidScore: 3, notes: '' }),
  validateAnswers: (task, answers) => ({ isValid: true }),
  renderAnswerPanel: ({ task, answers, onChange, disabled }) => {
    const sourceText = task.metadata?.sourceText || 'The amortized mortgage yield curves showed high variance.';
    const translationText = task.metadata?.translationText || 'Las curvas de rendimiento de la hipoteca amortizada mostraron una alta varianza.';

    return (
      <div className="space-y-4 text-left" id="plugin-translation-review">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 font-bold">English Original Source:</span>
            <blockquote className="text-xs bg-slate-50 p-3 rounded-xl border border-slate-200 dark:bg-zinc-950 dark:border-zinc-850 text-slate-700 dark:text-zinc-300 font-medium">
              "{sourceText}"
            </blockquote>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-500 font-bold">Target Translated Text:</span>
            <blockquote className="text-xs bg-indigo-500/5 p-3 rounded-xl border border-indigo-500/10 dark:bg-zinc-950 dark:border-zinc-850 text-slate-700 dark:text-zinc-300 font-medium">
              "{translationText}"
            </blockquote>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Rating */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block font-bold">Alignment Grade:</span>
            <div className="grid grid-cols-3 gap-2">
              {['perfect', 'literal', 'bad'].map(val => (
                <button
                  key={val}
                  type="button"
                  disabled={disabled}
                  onClick={() => onChange({ ...answers, alignmentRating: val })}
                  className={`p-2.5 rounded-lg border text-xs capitalize font-bold transition-all cursor-pointer ${
                    answers.alignmentRating === val
                      ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400'
                      : 'bg-white border-slate-200 hover:border-slate-300 dark:bg-zinc-900 dark:border-zinc-800'
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>

          {/* Fluency Slider */}
          <div className="space-y-2 bg-slate-50 dark:bg-zinc-900 p-3 rounded-xl border border-slate-150 dark:border-zinc-850">
            <div className="flex justify-between text-[10px] font-mono text-slate-500 uppercase">
              <span>Fluency Rating:</span>
              <span className="font-bold text-indigo-400">{answers.fluidScore || 3}/5</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              disabled={disabled}
              value={answers.fluidScore || 3}
              onChange={(e) => onChange({ ...answers, fluidScore: Number(e.target.value) })}
              className="w-full h-1.5 bg-slate-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>
        </div>
      </div>
    );
  }
};

/**
 * 10. Search Relevance Plugin
 */
export const SearchRelevancePlugin: TaskPlayerPlugin = {
  type: 'Search Relevance',
  name: 'Search Relevance',
  description: 'Evaluate search query matching and click-through ranking usefulness.',
  defaultAnswers: (task) => ({ matches: [] }),
  validateAnswers: (task, answers) => {
    if (!answers.matches || answers.matches.length < 2) {
      return { isValid: false, error: 'Please rate the relevance of all target search links.' };
    }
    return { isValid: true };
  },
  renderAnswerPanel: ({ task, answers, onChange, disabled }) => {
    const query = task.metadata?.query || 'Machine learning GPU servers rental cost';
    const sampleLinks = [
      { id: 'l1', title: 'Lambda Labs GPU Cloud Services - $1.89/hr H100 Instance', desc: 'Rent server grade dedicated computing rigs on demand with zero lockins.' },
      { id: 'l2', title: 'Buy NVIDIA H100 PCIe Graphics Card - Amazon.com', desc: 'Shop retail computer graphic boards online with free premium logistics delivery.' }
    ];

    const setRelevance = (linkId: string, value: string) => {
      const current = answers.matches || [];
      const updated = current.filter((m: any) => m.linkId !== linkId);
      updated.push({ linkId, value });
      onChange({ ...answers, matches: updated });
    };

    return (
      <div className="space-y-4 text-left" id="plugin-search-relevance">
        <div className="space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 font-bold">Search Query Terms:</span>
          <div className="p-3 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs font-mono font-bold flex items-center gap-2">
            <Search className="h-4 w-4 text-indigo-400" />
            <span>"{query}"</span>
          </div>
        </div>

        <div className="space-y-3.5">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block font-bold">Link Candidates Assessment:</span>
          {sampleLinks.map((link, idx) => {
            const currentMatch = (answers.matches || []).find((m: any) => m.linkId === link.id);
            const selectedVal = currentMatch ? currentMatch.value : '';
            return (
              <div key={link.id} className="p-4 bg-slate-50 dark:bg-zinc-950 border border-slate-150 dark:border-zinc-850 rounded-xl space-y-3">
                <div className="space-y-1">
                  <div className="flex gap-1.5 items-center">
                    <span className="text-xs font-semibold text-sky-600 hover:underline cursor-pointer">{idx + 1}. {link.title}</span>
                    <ExternalLink className="h-3 w-3 text-slate-400" />
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans leading-relaxed">{link.desc}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-500 uppercase">Match Relevance:</span>
                  <div className="flex gap-2">
                    {['Vital', 'Useful', 'Irrelevant'].map(grade => (
                      <button
                        key={grade}
                        type="button"
                        disabled={disabled}
                        onClick={() => setRelevance(link.id, grade)}
                        className={`px-3 py-1 text-xs rounded-lg border font-semibold cursor-pointer transition-all ${
                          selectedVal === grade
                            ? 'bg-indigo-500 text-white border-indigo-500'
                            : 'bg-white border-slate-250 hover:border-slate-350 dark:bg-zinc-900 dark:border-zinc-800 text-slate-600 dark:text-zinc-400'
                        }`}
                      >
                        {grade}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
};

/**
 * 11. Website Feedback Plugin
 */
export const WebsiteFeedbackPlugin: TaskPlayerPlugin = {
  type: 'Website Feedback',
  name: 'Website Feedback',
  description: 'Inspect live browser websites and assess accessibility grids.',
  defaultAnswers: (task) => ({ loadTimeSecs: 2, responsive: null, bugsFound: '', summary: '' }),
  validateAnswers: (task, answers) => {
    if (answers.responsive === null) {
      return { isValid: false, error: 'Please specify if the page layout is responsive.' };
    }
    return { isValid: true };
  },
  renderAnswerPanel: ({ task, answers, onChange, disabled }) => {
    const targetUrl = task.metadata?.targetUrl || 'https://example.com';
    return (
      <div className="space-y-4 text-left" id="plugin-website-feedback">
        <div className="space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 font-bold">Target Live Sandbox URL:</span>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={targetUrl}
              className="flex-1 p-2 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg text-xs font-mono"
            />
            <a
              href={targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 bg-indigo-600 text-white rounded-lg flex items-center justify-center text-xs font-semibold gap-1.5"
            >
              <span>Visit</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          {/* Responsiveness */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block font-bold">Layout Responsive Check:</span>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={disabled}
                onClick={() => onChange({ ...answers, responsive: true })}
                className={`p-3 rounded-xl border font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer ${
                  answers.responsive === true
                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                    : 'bg-white border-slate-200 hover:border-slate-300 dark:bg-zinc-900 dark:border-zinc-800 text-slate-600'
                }`}
              >
                <span>Yes / Fluid</span>
              </button>

              <button
                type="button"
                disabled={disabled}
                onClick={() => onChange({ ...answers, responsive: false })}
                className={`p-3 rounded-xl border font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer ${
                  answers.responsive === false
                    ? 'bg-rose-500/10 border-rose-500 text-rose-400'
                    : 'bg-white border-slate-200 hover:border-slate-300 dark:bg-zinc-900 dark:border-zinc-800 text-slate-600'
                }`}
              >
                <span>No / Broken UI</span>
              </button>
            </div>
          </div>

          {/* Bugs description */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block font-bold">UX Layout Bugs / Broken CSS:</span>
            <input
              type="text"
              disabled={disabled}
              value={answers.bugsFound || ''}
              onChange={(e) => onChange({ ...answers, bugsFound: e.target.value })}
              placeholder="Detail overlapping texts, blank frames, missing assets..."
              className="w-full p-2.5 text-xs bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>
    );
  }
};

/**
 * 12. UI Testing Plugin
 */
export const UiTestingPlugin: TaskPlayerPlugin = {
  type: 'UI Testing',
  name: 'UI Testing',
  description: 'Validate responsive component alignments and interaction states.',
  defaultAnswers: (task) => ({ pass: null, reason: '' }),
  validateAnswers: (task, answers) => {
    if (answers.pass === null) {
      return { isValid: false, error: 'Please choose pass/fail status.' };
    }
    return { isValid: true };
  },
  renderAnswerPanel: ({ task, answers, onChange, disabled }) => {
    const mockup = task.metadata?.mockupUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80';
    return (
      <div className="space-y-4 text-left" id="plugin-ui-testing">
        <div className="relative border border-slate-200 rounded-xl overflow-hidden aspect-video bg-zinc-950 flex items-center justify-center">
          <img 
            src={mockup} 
            alt="UI Candidate" 
            className="max-h-full max-w-full object-contain"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block font-bold">Interactive Component Quality:</span>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={disabled}
                onClick={() => onChange({ ...answers, pass: true })}
                className={`p-3 rounded-xl border font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer ${
                  answers.pass === true
                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                    : 'bg-white border-slate-200 dark:bg-zinc-900 dark:border-zinc-800 text-slate-650'
                }`}
              >
                <span>Pass Standard</span>
              </button>
              <button
                type="button"
                disabled={disabled}
                onClick={() => onChange({ ...answers, pass: false })}
                className={`p-3 rounded-xl border font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer ${
                  answers.pass === false
                    ? 'bg-rose-500/10 border-rose-500 text-rose-400'
                    : 'bg-white border-slate-200 dark:bg-zinc-900 dark:border-zinc-800 text-slate-650'
                }`}
              >
                <span>Fail / Review Required</span>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block font-bold">Failure Auditing Reason:</span>
            <input
              type="text"
              disabled={disabled}
              value={answers.reason || ''}
              onChange={(e) => onChange({ ...answers, reason: e.target.value })}
              placeholder="Provide reason detail for failures..."
              className="w-full p-2.5 text-xs bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>
    );
  }
};

/**
 * 13. Human Preference Ranking Plugin
 */
export const HumanPreferenceRankingPlugin: TaskPlayerPlugin = {
  type: 'Human Preference Ranking',
  name: 'Human Preference Ranking',
  description: 'Sort and reorder LLM outcomes by comparative guidelines.',
  defaultAnswers: (task) => ({ ranking: ['Response Alpha', 'Response Beta', 'Response Gamma'] }),
  validateAnswers: (task, answers) => ({ isValid: true }),
  renderAnswerPanel: ({ task, answers, onChange, disabled }) => {
    const list = answers.ranking || ['Response Alpha', 'Response Beta', 'Response Gamma'];

    const moveIndex = (index: number, direction: 'up' | 'down') => {
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= list.length) return;

      const updated = [...list];
      const temp = updated[index];
      updated[index] = updated[targetIndex];
      updated[targetIndex] = temp;
      onChange({ ...answers, ranking: updated });
    };

    return (
      <div className="space-y-4 text-left" id="plugin-preference-ranking">
        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block font-bold">Rank In Order of Usefulness (1st = Highest):</span>
        
        <div className="space-y-2">
          {list.map((item: string, index: number) => (
            <div 
              key={item} 
              className="flex items-center justify-between p-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-850 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <span className="h-6 w-6 rounded-full bg-indigo-600 text-white font-mono text-xs font-bold flex items-center justify-center shadow-sm">
                  {index + 1}
                </span>
                <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300">{item}</span>
              </div>

              <div className="flex gap-1.5">
                <button
                  type="button"
                  disabled={disabled || index === 0}
                  onClick={() => moveIndex(index, 'up')}
                  className="p-1 rounded bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-500 hover:text-indigo-600 disabled:opacity-40"
                  aria-label="Move Up"
                >
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  disabled={disabled || index === list.length - 1}
                  onClick={() => moveIndex(index, 'down')}
                  className="p-1 rounded bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-500 hover:text-indigo-600 disabled:opacity-40"
                  aria-label="Move Down"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
};

/**
 * 14. Audio Classification Plugin
 */
export const AudioClassificationPlugin: TaskPlayerPlugin = {
  type: 'Audio Classification',
  name: 'Audio Classification',
  description: 'Identify ambient noises, background speech and volume thresholds in raw clips.',
  defaultAnswers: (task) => ({ classifiedSounds: [], comments: '' }),
  validateAnswers: (task, answers) => {
    if (!answers.classifiedSounds || answers.classifiedSounds.length === 0) {
      return { isValid: false, error: 'Please choose at least one sound classification tag.' };
    }
    return { isValid: true };
  },
  renderAnswerPanel: ({ task, answers, onChange, disabled }) => {
    const audioUrl = task.metadata?.audioUrl || 'https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg';
    const sounds = ['Background Speech', 'Traffic Noise', 'Wind Jitter', 'Silence', 'Acoustic Echo', 'Music Playing'];

    const toggleSound = (sound: string) => {
      const active = answers.classifiedSounds || [];
      const updated = active.includes(sound) ? active.filter((item: string) => item !== sound) : [...active, sound];
      onChange({ ...answers, classifiedSounds: updated });
    };

    return (
      <div className="space-y-4 text-left" id="plugin-audio-classification">
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 dark:bg-zinc-950 dark:border-zinc-850 flex items-center gap-4">
          <div className="bg-indigo-600 p-2.5 rounded-lg text-white">
            <Mic className="h-5 w-5" />
          </div>
          <audio controls disabled={disabled} className="flex-1 h-9">
            <source src={audioUrl} type="audio/ogg" />
          </audio>
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block font-bold">Classified Sound Filters:</span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {sounds.map(sound => {
              const checked = (answers.classifiedSounds || []).includes(sound);
              return (
                <button
                  key={sound}
                  type="button"
                  disabled={disabled}
                  onClick={() => toggleSound(sound)}
                  className={`p-3 rounded-xl border font-semibold text-xs text-left flex items-center gap-2 cursor-pointer ${
                    checked
                      ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400'
                      : 'bg-white border-slate-200 hover:border-slate-350 dark:bg-zinc-900 dark:border-zinc-800 text-slate-600 dark:text-zinc-400'
                  }`}
                >
                  <div className={`h-4 w-4 rounded-md border flex items-center justify-center ${checked ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-slate-300'}`}>
                    {checked && <Check className="h-3 w-3" />}
                  </div>
                  <span>{sound}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
};

/**
 * 15. Video Review Plugin
 */
export const VideoReviewPlugin: TaskPlayerPlugin = {
  type: 'Video Review',
  name: 'Video Review',
  description: 'Evaluate resolution rates, framing timelines and policy compliance constraints.',
  defaultAnswers: (task) => ({ passRating: 5, flaggedTimeline: '', summary: '' }),
  validateAnswers: (task, answers) => ({ isValid: true }),
  renderAnswerPanel: ({ task, answers, onChange, disabled }) => {
    const videoUrl = task.metadata?.videoUrl || 'https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-background-1611-large.mp4';
    return (
      <div className="space-y-4 text-left" id="plugin-video-review">
        <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-800 bg-black aspect-video flex items-center justify-center">
          <video controls disabled={disabled} className="max-h-full max-w-full">
            <source src={videoUrl} type="video/mp4" />
          </video>
          <div className="absolute top-2 left-2 bg-red-600/95 text-white font-mono px-2 py-0.5 text-[9px] rounded uppercase font-bold">
            Audit Stream
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          {/* Framerate rating */}
          <div className="space-y-2 bg-slate-50 dark:bg-zinc-900 p-3 rounded-xl border border-slate-150 dark:border-zinc-850">
            <div className="flex justify-between text-[10px] font-mono text-slate-500 uppercase">
              <span>Fidelity & Playback smoothness:</span>
              <span className="font-bold text-indigo-400">{answers.passRating || 5}/5</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              disabled={disabled}
              value={answers.passRating || 5}
              onChange={(e) => onChange({ ...answers, passRating: Number(e.target.value) })}
              className="w-full h-1.5 bg-slate-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>

          {/* Glitch timings */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block font-bold">Corrupted Timestamps:</span>
            <input
              type="text"
              disabled={disabled}
              value={answers.flaggedTimeline || ''}
              onChange={(e) => onChange({ ...answers, flaggedTimeline: e.target.value })}
              placeholder="e.g. 00:04, 00:15 - flickering frames"
              className="w-full p-2.5 text-xs bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>
    );
  }
};

/**
 * Universal Plugin registry array containing all 15 core microtask renderers.
 */
export const CORE_PLAYER_PLUGINS: TaskPlayerPlugin[] = [
  AiResponseComparisonPlugin,
  ImageRatingPlugin,
  ImageSafetyReviewPlugin,
  TextClassificationPlugin,
  VoiceRatingPlugin,
  VoiceTranscriptionPlugin,
  OcrReviewPlugin,
  PromptEvaluationPlugin,
  TranslationReviewPlugin,
  SearchRelevancePlugin,
  WebsiteFeedbackPlugin,
  UiTestingPlugin,
  HumanPreferenceRankingPlugin,
  AudioClassificationPlugin,
  VideoReviewPlugin
];

/**
 * Helper class to search and load the matching plugin for a task.
 */
export const TaskPlayerPluginRegistry = {
  get: (type: string): TaskPlayerPlugin => {
    // Normalization mapping to bridge minor spelling disparities
    const normalized = type.trim().toLowerCase();
    
    let match = CORE_PLAYER_PLUGINS.find(p => p.type.toLowerCase() === normalized);
    
    // Fallback spelling aliases
    if (!match) {
      if (normalized.includes('comparison') || normalized.includes('response')) {
        match = AiResponseComparisonPlugin;
      } else if (normalized.includes('safety') || normalized.includes('moderation')) {
        match = ImageSafetyReviewPlugin;
      } else if (normalized.includes('ocr') || normalized.includes('verification')) {
        match = OcrReviewPlugin;
      } else if (normalized.includes('voice') && normalized.includes('rating')) {
        match = VoiceRatingPlugin;
      } else if (normalized.includes('video')) {
        match = VideoReviewPlugin;
      } else {
        // Ultimate fallback default to avoid player breaks
        match = AiResponseComparisonPlugin;
      }
    }
    
    return match;
  }
};
