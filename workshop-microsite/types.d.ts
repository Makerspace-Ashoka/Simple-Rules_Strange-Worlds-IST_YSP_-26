// Type definitions for Conway's Game of Life Workshop components

declare module '@site/src/components/docs/AnimatedCode' {
  export interface CodeHighlight {
    line: number;
    elements?: Array<{
      start: number;
      end: number;
    }>;
    explanation?: string;
  }

  export interface AnimatedCodeProps {
    code: string;
    highlights?: CodeHighlight[];
    language?: string;
    autoPlay?: boolean;
    interval?: number;
  }

  const AnimatedCode: React.FC<AnimatedCodeProps>;
  export default AnimatedCode;
}

declare module '@site/src/components/docs/ArrayVisualizer' {
  export interface ArrayVisualizerProps {
    array: any[];
    caption?: string;
    highlightIndices?: boolean;
    highlightIndex?: number;
    showIndices?: boolean;
  }

  const ArrayVisualizer: React.FC<ArrayVisualizerProps>;
  export default ArrayVisualizer;
}

declare module '@site/src/components/docs/ChallengeBadge' {
  export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

  export interface ChallengeBadgeProps {
    level: DifficultyLevel;
    concepts?: string[];
  }

  const ChallengeBadge: React.FC<ChallengeBadgeProps>;
  export default ChallengeBadge;
}

declare module '@site/src/components/docs/CodeEditor' {
  export type EditorLanguage = 'javascript' | 'jsx' | 'typescript' | 'tsx';

  export interface CodeEditorProps {
    id: string;
    initialCode: string;
    solution?: string;
    mode?: EditorLanguage;
    scope?: Record<string, unknown>;
    noInline?: boolean;
    showPreview?: boolean;
    previewBackground?: string;
    hint?: string | React.ReactNode;
  }

  const CodeEditor: React.FC<CodeEditorProps>;
  export default CodeEditor;
}

declare module '@site/src/components/docs/ConceptCheck' {
  export interface ConceptCheckProps {
    children: React.ReactNode;
  }

  export interface AnswerProps {
    children: React.ReactNode;
  }

  export const ConceptCheck: React.FC<ConceptCheckProps>;
  export const Answer: React.FC<AnswerProps>;

  const ConceptCheckComponents: {
    ConceptCheck: React.FC<ConceptCheckProps>;
    Answer: React.FC<AnswerProps>;
  };

  export default ConceptCheckComponents;
}

declare module '@site/src/components/docs/GridVisualizer' {
  export interface GridVisualizerProps {
    grid: number[][];
    caption?: string;
    showIndices?: boolean;
    highlightCell?: [number, number];
    highlightNeighbors?: boolean;
    aliveColor?: string;
    deadColor?: string;
    borderColor?: string;
    cellSize?: number;
  }

  const GridVisualizer: React.FC<GridVisualizerProps>;
  export default GridVisualizer;
}

declare module '@site/src/components/docs/Quiz' {
  export interface QuestionProps {
    type: 'multiple-choice' | 'true-false' | 'fill-in-blank';
    children: React.ReactNode;
    answer: number | string;
    onAnswer?: (isCorrect: boolean) => void;
    answered?: boolean;
    correct?: boolean;
    explanation?: string;
  }

  export interface OptionProps {
    children: React.ReactNode;
    correct?: boolean;
    selected?: boolean;
    onClick?: () => void;
    disabled?: boolean;
  }

  export interface QuizProps {
    children: React.ReactNode;
  }

  export const Quiz: React.FC<QuizProps>;
  export const Question: React.FC<QuestionProps>;
  export const Option: React.FC<OptionProps>;

  const QuizComponents: {
    Quiz: React.FC<QuizProps>;
    Question: React.FC<QuestionProps>;
    Option: React.FC<OptionProps>;
  };

  export default QuizComponents;
}

declare module '@site/src/components/docs/PatternDemo' {
  export type PatternType = 'blinker' | 'glider' | 'pulsar' | 'checkerboard' | 'random' | string;

  export interface PatternDemoProps {
    pattern: PatternType;
    steps?: number;
    speed?: number;
    size?: number;
    cellSize?: number;
    caption?: string;
    autoPlay?: boolean;
  }

  const PatternDemo: React.FC<PatternDemoProps>;
  export default PatternDemo;
}

declare module '@site/src/components/docs/VisualDemo' {
  export type DemoType =
    | 'grid-creation'
    | 'nested-loops'
    | 'random-distribution'
    | 'array-modification'
    | 'create-2d-array'
    | 'grid-wrapping'
    | 'nested-loops-grid'
    | 'pattern'
    | 'neighbors';

  export interface GridDimensions {
    rows: number;
    cols: number;
  }

  export interface VisualDemoProps {
    type: DemoType;
    width?: number;
    height?: number;
    resolution?: number;
    pattern?: string;
    grid?: GridDimensions;
    samples?: number;
    steps?: number;
    speed?: number;
    autoPlay?: boolean;
  }

  const VisualDemo: React.FC<VisualDemoProps>;
  export default VisualDemo;
}

// Export all components from a single module
declare module '@site/src/components/docs' {
  export * from '@site/src/components/docs/AnimatedCode';
  export * from '@site/src/components/docs/ArrayVisualizer';
  export * from '@site/src/components/docs/ChallengeBadge';
  export * from '@site/src/components/docs/CodeEditor';
  export * from '@site/src/components/docs/ConceptCheck';
  export * from '@site/src/components/docs/GridVisualizer';
  export * from '@site/src/components/docs/Quiz';
  export * from '@site/src/components/docs/PatternDemo';
  export * from '@site/src/components/docs/VisualDemo';

  const components: {
    AnimatedCode: React.FC<import('@site/src/components/docs/AnimatedCode').AnimatedCodeProps>;
    ArrayVisualizer: React.FC<import('@site/src/components/docs/ArrayVisualizer').ArrayVisualizerProps>;
    ChallengeBadge: React.FC<import('@site/src/components/docs/ChallengeBadge').ChallengeBadgeProps>;
    CodeEditor: React.FC<import('@site/src/components/docs/CodeEditor').CodeEditorProps>;
    ConceptCheck: React.FC<import('@site/src/components/docs/ConceptCheck').ConceptCheckProps>;
    GridVisualizer: React.FC<import('@site/src/components/docs/GridVisualizer').GridVisualizerProps>;
    PatternDemo: React.FC<import('@site/src/components/docs/PatternDemo').PatternDemoProps>;
    Quiz: React.FC<import('@site/src/components/docs/Quiz').QuizProps>;
    Question: React.FC<import('@site/src/components/docs/Quiz').QuestionProps>;
    Option: React.FC<import('@site/src/components/docs/Quiz').OptionProps>;
    Answer: React.FC<import('@site/src/components/docs/ConceptCheck').AnswerProps>;
    VisualDemo: React.FC<import('@site/src/components/docs/VisualDemo').VisualDemoProps>;
  };

  export default components;
}

