import React, { useState, useEffect, useRef } from 'react';
import { FolderItem } from '../../types/knowledge';
import { FolderPlus, X } from 'lucide-react';

interface NewFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  folders: FolderItem[];
  onCreateFolder: (name: string, parentId?: string) => void;
}

export const NewFolderModal: React.FC<NewFolderModalProps> = ({
  isOpen,
  onClose,
  folders,
  onCreateFolder,
}) => {
  const [folderName, setFolderName] = useState('');
  const [parentId, setParentId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setFolderName('');
      setParentId('');
      setError(null);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = folderName.trim();
    if (!trimmed) {
      setError('Please enter a folder name');
      return;
    }

    if (folders.some(f => f.name.toLowerCase() === trimmed.toLowerCase())) {
      setError('A folder with this name already exists');
      return;
    }

    onCreateFolder(trimmed, parentId || undefined);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 select-none animate-in fade-in duration-100"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-sm bg-[#18181b] border border-[#2b2b32] rounded-xl shadow-2xl p-5 text-xs text-zinc-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#25252a]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#222228] border border-zinc-700/60 text-zinc-200">
              <FolderPlus className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-zinc-100 text-sm">
              New Folder
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-zinc-200 hover:bg-[#222227] rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-[11px] text-zinc-400 mb-1 font-medium">
              Folder Name:
            </label>
            <input
              ref={inputRef}
              type="text"
              placeholder="e.g. 07 2D Materials & Graphene"
              value={folderName}
              onChange={(e) => {
                setFolderName(e.target.value);
                if (error) setError(null);
              }}
              className="w-full bg-[#121215] border border-[#27272e] rounded-lg px-3 py-1.5 text-zinc-100 text-xs placeholder-zinc-500 focus:outline-none focus:border-zinc-400"
            />
            {error && (
              <span className="text-[11px] text-red-400 mt-1 block">
                {error}
              </span>
            )}
          </div>

          <div>
            <label className="block text-[11px] text-zinc-400 mb-1 font-medium">
              Parent Folder (Optional):
            </label>
            <select
              value={parentId}
              onChange={(e) => setParentId(e.target.value)}
              className="w-full bg-[#121215] border border-[#27272e] rounded-lg px-2.5 py-1.5 text-zinc-200 text-xs focus:outline-none focus:border-zinc-400"
            >
              <option value="">Root (No Parent)</option>
              {folders.map(f => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#25252a]">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-[#202026] hover:bg-[#282830] text-zinc-300 text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3.5 py-1.5 rounded-lg bg-zinc-200 hover:bg-white text-zinc-950 font-medium text-xs shadow-sm transition-colors"
            >
              Create Folder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
