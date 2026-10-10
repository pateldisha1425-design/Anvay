import React, { useState } from 'react';
import { TopicNode } from '../../types/knowledge';
import { LearningResource, ResourceType } from '../../types/learning';
import { getLearningResourcesForTopic } from '../../data/learningResourcesData';
import { 
  BookOpen, 
  FileText, 
  Video, 
  Sigma, 
  Sparkles, 
  ExternalLink, 
  CheckCircle2, 
  Copy, 
  Check,
  Bookmark
} from 'lucide-react';

interface ResourcesViewProps {
  topic: TopicNode;
  onNavigateTopic?: (topicId: string) => void;
}

export const ResourcesView: React.FC<ResourcesViewProps> = ({ topic }) => {
  const resources = getLearningResourcesForTopic(topic);
  const [filterType, setFilterType] = useState<ResourceType | 'all'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredResources = resources.filter(r => {
    if (filterType === 'all') return true;
    return r.type === filterType;
  });

  const handleCopyCitation = (res: LearningResource) => {
    const text = `${res.title} — ${res.authorOrSource}${res.citationOrLink ? ` (${res.citationOrLink})` : ''}`;
    navigator.clipboard.writeText(text);
    setCopiedId(res.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getIconForType = (type: ResourceType) => {
    switch (type) {
      case 'textbook':
        return <BookOpen className="w-4 h-4 text-emerald-400" />;
      case 'paper':
        return <FileText className="w-4 h-4 text-blue-400" />;
      case 'lecture':
        return <Video className="w-4 h-4 text-purple-400" />;
      case 'formula':
        return <Sigma className="w-4 h-4 text-amber-400" />;
      default:
        return <Bookmark className="w-4 h-4 text-zinc-400" />;
    }
  };

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'introductory':
        return 'text-emerald-400 bg-emerald-950/40 border-emerald-800/50';
      case 'intermediate':
        return 'text-blue-400 bg-blue-950/40 border-blue-800/50';
      case 'advanced':
        return 'text-purple-400 bg-purple-950/40 border-purple-800/50';
      default:
        return 'text-zinc-400 bg-zinc-800 border-zinc-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Overview */}
      <div className="bg-[#1a1a1e] border border-[#27272c] rounded-lg p-4">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider block mb-1">
              Curated Academic Literature & Standards
            </span>
            <h3 className="text-sm font-semibold text-zinc-100">
              Standard Learning Resources for {topic.title}
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Core university textbooks (Callister, Kittel, Odian), NPTEL / MIT OpenCourseWare references, peer-reviewed foundational papers, and governing formula sheets.
            </p>
          </div>
          <div className="shrink-0 ml-4 px-2.5 py-1 bg-[#232328] border border-[#2e2e36] rounded text-xs text-zinc-300 font-mono">
            {resources.length} {resources.length === 1 ? 'Resource' : 'Resources'}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 mt-4 pt-3 border-t border-[#26262b]">
          <span className="text-[11px] text-zinc-500 mr-1">Filter by type:</span>
          {(['all', 'textbook', 'lecture', 'paper', 'formula'] as const).map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-2.5 py-0.5 rounded text-[11px] transition-colors capitalize ${
                filterType === type
                  ? 'bg-blue-600/30 text-blue-300 border border-blue-500/50'
                  : 'bg-[#202024] text-zinc-400 hover:text-zinc-200 border border-transparent'
              }`}
            >
              {type === 'all' ? 'All Resources' : `${type}s`}
            </button>
          ))}
        </div>
      </div>

      {/* Resource Cards */}
      <div className="space-y-3">
        {filteredResources.map((res) => (
          <div
            key={res.id}
            className="bg-[#18181b] border border-[#26262a] hover:border-[#383840] transition-colors rounded-lg p-4 space-y-3"
          >
            {/* Top row */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <div className="p-2 rounded bg-[#202024] border border-[#2b2b30] shrink-0 mt-0.5">
                  {getIconForType(res.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                      {res.type}
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded border uppercase font-medium ${getDifficultyBadge(res.difficulty)}`}>
                      {res.difficulty}
                    </span>
                  </div>
                  <h4 className="text-[13px] font-semibold text-zinc-200 leading-snug">
                    {res.title}
                  </h4>
                  <p className="text-[11px] text-zinc-400 mt-0.5 font-mono">
                    {res.authorOrSource}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <button
                onClick={() => handleCopyCitation(res)}
                className="shrink-0 p-1.5 rounded hover:bg-[#25252b] text-zinc-400 hover:text-zinc-200 transition-colors"
                title="Copy citation reference"
              >
                {copiedId === res.id ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            {/* Description */}
            <p className="text-xs text-zinc-300 leading-relaxed pl-11">
              {res.description}
            </p>

            {/* Key Takeaways */}
            {res.keyTakeaways && res.keyTakeaways.length > 0 && (
              <div className="pl-11 pt-1">
                <span className="text-[11px] font-semibold text-zinc-400 block mb-1">
                  Core Syllabus Concepts Covered:
                </span>
                <ul className="space-y-1">
                  {res.keyTakeaways.map((takeaway, idx) => (
                    <li key={idx} className="text-xs text-zinc-300 flex items-start gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tags / Citation link footer */}
            <div className="pl-11 pt-2 flex items-center justify-between text-[11px] text-zinc-500 border-t border-[#222226]">
              <div className="flex items-center gap-1.5 flex-wrap">
                {res.tags?.map((t, idx) => (
                  <span key={idx} className="bg-[#202024] px-1.5 py-0.5 rounded text-[10px] text-zinc-400">
                    #{t}
                  </span>
                ))}
              </div>
              {res.citationOrLink && (
                <span className="text-blue-400 font-mono text-[10px]">
                  {res.citationOrLink}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
