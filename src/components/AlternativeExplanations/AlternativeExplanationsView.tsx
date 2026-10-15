import React, { useState } from 'react';
import { TopicNode } from '../../types/knowledge';
import { ExplanationMode } from '../../types/learning';
import { getAlternativeExplanationsForTopic } from '../../data/alternativeExplanationsData';
import { 
  Lightbulb, 
  Binary, 
  Cog, 
  GraduationCap, 
  Sparkles, 
  Quote, 
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

interface AlternativeExplanationsViewProps {
  topic: TopicNode;
  allTopics?: TopicNode[];
  onNavigateTopic?: (topicId: string) => void;
}

export const AlternativeExplanationsView: React.FC<AlternativeExplanationsViewProps> = ({
  topic,
  allTopics = [],
  onNavigateTopic,
}) => {
  const explanationsMap = getAlternativeExplanationsForTopic(topic);
  const [activeMode, setActiveMode] = useState<ExplanationMode>('intuitive');

  const currentExplanation = explanationsMap[activeMode] || explanationsMap.standard;

  const modeButtons: { mode: ExplanationMode; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      mode: 'intuitive',
      label: 'Intuitive Analogy',
      icon: <Lightbulb className="w-4 h-4 text-zinc-300" />,
      desc: 'Real-world mental models & metaphors'
    },
    {
      mode: 'rigorous',
      label: 'First-Principles & Equations',
      icon: <Binary className="w-4 h-4 text-zinc-300" />,
      desc: 'Thermodynamics & mathematical derivations'
    },
    {
      mode: 'mechanism',
      label: 'Physical Mechanism',
      icon: <Cog className="w-4 h-4 text-zinc-300" />,
      desc: 'Step-by-step physical & chemical cascade'
    },
    {
      mode: 'exam_viva',
      label: 'Exam & Viva Cheat Sheet',
      icon: <GraduationCap className="w-4 h-4 text-zinc-300" />,
      desc: 'High-yield exam traps & model viva answers'
    }
  ];

  // Simple markdown renderer for explanation content
  const renderMarkdown = (text: string) => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];

    lines.forEach((line, index) => {
      // Heading ###
      if (line.startsWith('### ')) {
        elements.push(
          <h4 key={`h3-${index}`} className="text-sm font-semibold text-zinc-100 mt-4 mb-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 inline-block" />
            {line.replace('### ', '')}
          </h4>
        );
        return;
      }

      // Heading ##
      if (line.startsWith('## ')) {
        elements.push(
          <h3 key={`h2-${index}`} className="text-base font-semibold text-zinc-100 mt-5 mb-2 pb-1 border-b border-[#28282e]">
            {line.replace('## ', '')}
          </h3>
        );
        return;
      }

      // Blockquote >
      if (line.startsWith('> ')) {
        elements.push(
          <blockquote key={`bq-${index}`} className="my-2.5 p-3 rounded bg-[#18181c] border-l-2 border-zinc-500 text-xs text-zinc-300 leading-relaxed italic">
            {line.replace('> ', '')}
          </blockquote>
        );
        return;
      }

      // Bullet list - or *
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        const itemText = line.trim().replace(/^[-*]\s+/, '');
        elements.push(
          <li key={`li-${index}`} className="text-xs text-zinc-300 ml-4 list-disc my-1 leading-relaxed">
            {formatInlineText(itemText)}
          </li>
        );
        return;
      }

      // Numbered list
      const numMatch = line.trim().match(/^(\d+)\.\s+(.*)/);
      if (numMatch) {
        elements.push(
          <li key={`num-${index}`} className="text-xs text-zinc-300 ml-4 list-decimal my-1 leading-relaxed">
            {formatInlineText(numMatch[2])}
          </li>
        );
        return;
      }

      // Math block display $$...$$
      if (line.trim().startsWith('$$') && line.trim().endsWith('$$') && line.trim().length > 3) {
        const math = line.trim().slice(2, -2).trim();
        elements.push(
          <div key={`mb-${index}`} className="my-2.5 p-2.5 rounded bg-[#18181c] border border-[#26262c] text-center font-mono text-zinc-300 text-xs overflow-x-auto">
            {cleanMath(math)}
          </div>
        );
        return;
      }

      // Empty line
      if (!line.trim()) {
        elements.push(<div key={`sp-${index}`} className="h-1.5" />);
        return;
      }

      // Normal paragraph
      elements.push(
        <p key={`p-${index}`} className="text-xs text-zinc-300 leading-relaxed my-1.5">
          {formatInlineText(line)}
        </p>
      );
    });

    return elements;
  };

  const formatInlineText = (text: string): React.ReactNode => {
    // Math $...$
    const mathParts = text.split(/(\$.*?\$)/g);
    return mathParts.map((part, pIdx) => {
      if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
        return (
          <span key={`im-${pIdx}`} className="font-mono text-zinc-200 bg-[#202026] px-1 py-0.5 rounded text-[11px] border border-zinc-700/40">
            {cleanMath(part.slice(1, -1))}
          </span>
        );
      }

      // Bold **text**
      const boldParts = part.split(/(\*\*.*?\*\*)/g);
      return boldParts.map((bPart, bIdx) => {
        if (bPart.startsWith('**') && bPart.endsWith('**')) {
          return (
            <strong key={`b-${bIdx}`} className="font-semibold text-zinc-100">
              {bPart.slice(2, -2)}
            </strong>
          );
        }
        return bPart;
      });
    });
  };

  const cleanMath = (raw: string): string => {
    return raw
      .replace(/\\rightarrow/g, ' → ')
      .replace(/\\rightleftharpoons/g, ' ⇌ ')
      .replace(/\\approx/g, ' ≈ ')
      .replace(/\\propto/g, ' ∝ ')
      .replace(/\\times/g, ' × ')
      .replace(/\\circ/g, '°')
      .replace(/\\text\{(.*?)\}/g, '$1')
      .replace(/\\frac\{(.*?)\}\{(.*?)\}/g, '($1 / $2)')
      .replace(/\\sqrt\{(.*?)\}/g, '√($1)')
      .replace(/\\mu/g, 'μ')
      .replace(/\\Delta/g, 'Δ')
      .replace(/\\pi/g, 'π')
      .replace(/\\hbar/g, 'ħ')
      .replace(/\\epsilon/g, 'ε')
      .replace(/\\alpha/g, 'α')
      .replace(/\\beta/g, 'β')
      .replace(/\\gamma/g, 'γ')
      .replace(/\\sigma/g, 'σ');
  };

  return (
    <div className="space-y-5">
      {/* Perspective Mode Switcher Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {modeButtons.map(({ mode, label, icon, desc }) => {
          const isActive = activeMode === mode;
          return (
            <button
              key={mode}
              onClick={() => setActiveMode(mode)}
              className={`p-3 rounded-lg border text-left transition-all ${
                isActive
                  ? 'bg-[#222226] border-zinc-600 shadow-sm'
                  : 'bg-[#18181b] border-[#25252a] hover:border-[#383842] hover:bg-[#1c1c20]'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                {icon}
                <span className={`text-xs font-semibold ${isActive ? 'text-white' : 'text-zinc-300'}`}>
                  {label}
                </span>
              </div>
              <p className="text-[10px] text-zinc-500 line-clamp-1">
                {desc}
              </p>
            </button>
          );
        })}
      </div>

      {/* Main Perspective Body Card */}
      <div className="bg-[#18181b] border border-[#27272c] rounded-lg p-5 space-y-4">
        {/* Title and Cognitive Anchor Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#26262a] gap-2">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block mb-0.5">
              {currentExplanation.modeLabel}
            </span>
            <h3 className="text-sm font-semibold text-zinc-100">
              {currentExplanation.title}
            </h3>
            <p className="text-[11px] text-zinc-400">
              {currentExplanation.subtitle}
            </p>
          </div>

          <div className="self-start sm:self-auto flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#202026] border border-[#2d2d34] text-[11px] text-zinc-300">
            <Sparkles className="w-3.5 h-3.5 text-zinc-300 shrink-0" />
            <span className="font-medium text-zinc-200 truncate max-w-xs">
              {currentExplanation.cognitiveAnchor}
            </span>
          </div>
        </div>

        {/* Formatted Markdown Content */}
        <div className="prose prose-invert max-w-none text-zinc-300 select-text">
          {renderMarkdown(currentExplanation.content)}
        </div>

        {/* Key Takeaway Callout */}
        <div className="mt-4 p-3 rounded bg-[#18181c] border border-zinc-700/60 flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-zinc-300 shrink-0 mt-0.5" />
          <div>
            <span className="text-[11px] font-semibold text-zinc-200 uppercase tracking-wider block mb-0.5">
              Core Cognitive Takeaway
            </span>
            <p className="text-xs text-zinc-300 leading-relaxed">
              {currentExplanation.keyInsight}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
