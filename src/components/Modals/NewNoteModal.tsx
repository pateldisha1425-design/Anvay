import React, { useState } from 'react';
import { TopicNode, FolderItem } from '../../types/knowledge';
import { X, FilePlus } from 'lucide-react';

interface NewNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  folders: FolderItem[];
  allTopics: TopicNode[];
  onCreateNote: (newTopic: TopicNode) => void;
}

export const NewNoteModal: React.FC<NewNoteModalProps> = ({
  isOpen,
  onClose,
  folders,
  allTopics,
  onCreateNote,
}) => {
  const [title, setTitle] = useState('');
  const [folderId, setFolderId] = useState('personal');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const baseSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    const id = `custom-${baseSlug || Date.now()}`;

    const folder = folders.find(f => f.id === folderId);
    const category = folder ? folder.name : 'Personal Notes';

    const initialContent = content.trim()
      ? content
      : `# ${title.trim()}\n\nWrite your notes here. You can connect this to other concepts using [[WikiLink]] syntax.\n\n- Example point`;

    const newTopic: TopicNode = {
      id,
      title: title.trim(),
      folderId,
      category,
      topicType: 'definition',
      description: description.trim() || `User personal note: ${title.trim()}`,
      content: initialContent,
      prerequisiteIds: [],
      relatedIds: [],
      source: 'Student Personal Notes',
      isCustom: true,
      updatedAt: new Date().toISOString(),
    };

    onCreateNote(newTopic);
    setTitle('');
    setDescription('');
    setContent('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
      <div className="w-full max-w-md bg-[#1c1c1f] border border-[#2e2e34] rounded-lg shadow-2xl overflow-hidden text-zinc-300 text-xs">
        <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-[#28282e] bg-[#18181b]">
          <span className="font-semibold text-zinc-100 text-xs">Create New Note</span>
          <button
            onClick={onClose}
            className="p-1 text-zinc-500 hover:text-zinc-200 rounded transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-3.5 space-y-3">
          <div>
            <label className="block text-zinc-400 text-[11px] mb-1">Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title..."
              className="w-full bg-[#131315] border border-[#26262a] rounded px-2.5 py-1 text-zinc-100 focus:outline-none focus:border-zinc-500 text-xs"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-zinc-400 text-[11px] mb-1">Folder</label>
            <select
              value={folderId}
              onChange={(e) => setFolderId(e.target.value)}
              className="w-full bg-[#131315] border border-[#26262a] rounded px-2 py-1 text-zinc-100 focus:outline-none focus:border-zinc-500 text-xs"
            >
              {folders.map(f => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-zinc-400 text-[11px] mb-1">Short Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary..."
              className="w-full bg-[#131315] border border-[#26262a] rounded px-2.5 py-1 text-zinc-100 focus:outline-none focus:border-zinc-500 text-xs"
            />
          </div>

          <div>
            <label className="block text-zinc-400 text-[11px] mb-1">Content (Markdown)</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Use [[Concept Name]] to link..."
              rows={4}
              className="w-full bg-[#131315] border border-[#26262a] rounded p-2 text-zinc-100 font-mono text-[12px] focus:outline-none focus:border-zinc-500 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#26262a]">
            <button
              type="button"
              onClick={onClose}
              className="px-2.5 py-1 rounded bg-[#202024] hover:bg-[#28282e] text-zinc-400 text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs flex items-center gap-1"
            >
              <FilePlus className="w-3 h-3" />
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
