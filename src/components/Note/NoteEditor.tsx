import React, { useState } from 'react';
import { TopicNode } from '../../types/knowledge';
import { 
  Bold, 
  Heading, 
  List, 
  Link, 
  Code, 
  Save, 
  Check, 
  RotateCcw
} from 'lucide-react';

interface NoteEditorProps {
  topic: TopicNode;
  allTopics: TopicNode[];
  onSaveContent: (topicId: string, newContent: string) => void;
  onResetToDefault?: (topicId: string) => void;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({
  topic,
  allTopics,
  onSaveContent,
  onResetToDefault,
}) => {
  const [content, setContent] = useState(topic.content);
  const [savedNotification, setSavedNotification] = useState(false);

  const handleSave = () => {
    onSaveContent(topic.id, content);
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 2000);
  };

  const insertText = (before: string, after: string = '') => {
    const textarea = document.getElementById('note-editor-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.substring(start, end);

    const replacement = before + (selected || 'text') + after;
    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + (selected.length || 4));
    }, 10);
  };

  return (
    <div className="flex flex-col h-full bg-[#161618] text-zinc-200">
      {/* Editor Compact Toolbar */}
      <div className="flex items-center justify-between px-6 py-1.5 bg-[#141416] border-b border-[#232326] text-xs">
        <div className="flex items-center space-x-0.5">
          <button
            onClick={() => insertText('**', '**')}
            className="p-1 text-zinc-400 hover:text-zinc-100 hover:bg-[#202024] rounded transition-colors"
            title="Bold (**text**)"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => insertText('\n## ', '')}
            className="p-1 text-zinc-400 hover:text-zinc-100 hover:bg-[#202024] rounded transition-colors"
            title="Heading 2 (## Heading)"
          >
            <Heading className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => insertText('\n- ', '')}
            className="p-1 text-zinc-400 hover:text-zinc-100 hover:bg-[#202024] rounded transition-colors"
            title="Bullet list (- item)"
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => insertText('[[', ']]')}
            className="px-1.5 py-0.5 text-blue-400 hover:text-blue-300 hover:bg-[#202024] rounded text-[11px] font-mono transition-colors"
            title="Insert internal Wiki-Link [[Topic]]"
          >
            [[link]]
          </button>
          <button
            onClick={() => insertText('$', '$')}
            className="px-1.5 py-0.5 text-zinc-400 hover:text-zinc-200 hover:bg-[#202024] rounded text-[11px] font-mono"
            title="Formula ($...$)"
          >
            $fx$
          </button>
          <button
            onClick={() => insertText('\n```\n', '\n```\n')}
            className="p-1 text-zinc-400 hover:text-zinc-100 hover:bg-[#202024] rounded transition-colors"
            title="Code Block"
          >
            <Code className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center space-x-2">
          {onResetToDefault && !topic.isCustom && (
            <button
              onClick={() => onResetToDefault(topic.id)}
              className="text-zinc-500 hover:text-zinc-300 px-2 py-0.5 rounded text-[11px] flex items-center gap-1"
              title="Reset note back to original syllabus text"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          )}

          <button
            onClick={handleSave}
            className={`flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] transition-colors ${
              savedNotification
                ? 'bg-emerald-900/60 text-emerald-300'
                : 'bg-[#25252b] hover:bg-[#2e2e36] text-zinc-200'
            }`}
          >
            {savedNotification ? (
              <>
                <Check className="w-3 h-3" />
                Saved
              </>
            ) : (
              <>
                <Save className="w-3 h-3" />
                Save
              </>
            )}
          </button>
        </div>
      </div>

      {/* Editor Textarea */}
      <div className="flex-1 p-6 sm:p-10 overflow-y-auto">
        <textarea
          id="note-editor-textarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write note in Markdown. Use [[Topic Title]] to link concepts..."
          className="w-full h-full min-h-[500px] bg-transparent text-zinc-200 font-mono text-[13px] leading-relaxed resize-none focus:outline-none selection:bg-blue-600/30"
          spellCheck={false}
        />
      </div>
    </div>
  );
};
