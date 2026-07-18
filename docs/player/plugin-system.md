# Player Plugin System Specification
Version 1.0.0 | Extensibility Reference

The Task Player is built entirely around an isolated, decoupled, interface-driven plugin system. Layout elements are never hardcoded inside the core player frame. Instead, the frame looks up a schema category, matches it against a registered plugin, and delegates the workspace canvas to that plugin.

## 1. Plugin Interface Contract (`TaskPlayerPlugin`)
Each plugin must strictly conform to the following TypeScript contract:
```typescript
export interface TaskPlayerPlugin {
  type: string;
  name: string;
  description: string;
  renderAnswerPanel: (props: {
    task: any;
    answers: Record<string, any>;
    onChange: (answers: Record<string, any>) => void;
    disabled?: boolean;
  }) => React.ReactNode;
  validateAnswers: (task: any, answers: Record<string, any>) => { isValid: boolean; error?: string };
  defaultAnswers: (task: any) => Record<string, any>;
}
```

## 2. Supported Micro-Task Plugins
The system ships pre-loaded with high-fidelity components for all 15 core alignment types:
1. **AI Response Comparison**: Compares two LLM generated texts, allowing selection and comparative comments.
2. **Image Rating**: Renders a generated visual asset and scores sharpness, lighting, and composition using responsive sliders.
3. **Image Safety Review**: Flags violating categories (e.g., adult, violence, trademark) on policy scan candidate images.
4. **Text Classification**: Renders text snippets and allows assigning primary categories and secondary tag lists.
5. **Voice Rating**: Plays synthesized TTS tracks, allows scoring naturalness (MOS scale 1-5), and checks for static clipping.
6. **Voice Transcription**: Offers an audio interface and a high-precision transcription textbox.
7. **OCR Review**: Renders document images side-by-side with extracted text for error correction.
8. **Prompt Evaluation**: Rates prompt readability, jailbreak potential, and structural completeness.
9. **Translation Review**: Evaluates translation accuracy, fluency, and tone against original source texts.
10. **Search Relevance**: Rates a collection of search queries and web links on usefulness (Vital, Useful, Irrelevant).
11. **Website Feedback**: Offers an iframe-ready URL preview with checklist forms for responsiveness and broken CSS flags.
12. **UI Testing**: Audits mockups and wireframes for layout alignment, and assigns pass/fail status.
13. **Human Preference Ranking**: Sorts multiple model results in order of accuracy (1st to 3rd) using list controls.
14. **Audio Classification**: Multi-select tags (e.g., wind, speech, music) for raw audio segments.
15. **Video Review**: plays MP4 streams, rates playback smoothness, and captures timestamps for video glitches.

## 3. Normalization & Loader Routing
To maintain backward compatibility with old data registers, the `TaskPlayerPluginRegistry` uses fuzzy normalization strings (e.g., mapping `OCR Verification` to `OCR Review`) to ensure that mismatching category names are routed safely to the appropriate rendering engine.
