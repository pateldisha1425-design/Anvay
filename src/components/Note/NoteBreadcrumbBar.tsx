import React, { useMemo } from 'react';
import { TopicNode, FolderItem } from '../../types/knowledge';

interface NoteBreadcrumbBarProps {
  topic: TopicNode;
  folders?: FolderItem[];
  onSelectFolder?: (folderId: string) => void;
  className?: string;
}

interface PathSegment {
  id: string;
  name: string;
}

export const NoteBreadcrumbBar: React.FC<NoteBreadcrumbBarProps> = ({
  topic,
  folders = [],
  onSelectFolder,
  className = '',
}) => {
  // Resolve ancestor hierarchy from folders array
  const pathSegments = useMemo<PathSegment[]>(() => {
    if (!folders || folders.length === 0) {
      return topic.category ? [{ id: 'category', name: topic.category }] : [];
    }

    const segments: PathSegment[] = [];
    let currentFolder = folders.find(f => f.id === topic.folderId);

    // Guard against circular references
    const visited = new Set<string>();

    while (currentFolder && !visited.has(currentFolder.id)) {
      visited.add(currentFolder.id);
      segments.unshift({ id: currentFolder.id, name: currentFolder.name });

      if (currentFolder.parentId) {
        currentFolder = folders.find(f => f.id === currentFolder?.parentId);
      } else {
        break;
      }
    }

    if (segments.length === 0 && topic.category) {
      segments.push({ id: 'category', name: topic.category });
    }

    return segments;
  }, [topic.folderId, topic.category, folders]);

  return (
    <nav 
      aria-label="Breadcrumb hierarchy" 
      className={`flex items-center text-xs text-zinc-400 select-none overflow-x-auto no-scrollbar ${className}`}
    >
      <ol className="flex items-center flex-wrap gap-0.5 leading-none">
        {pathSegments.map((segment, index) => (
          <li key={segment.id} className="flex items-center">
            {index > 0 && (
              <span className="text-zinc-600 mx-1 select-none" aria-hidden="true">/</span>
            )}
            <button
              type="button"
              onClick={() => onSelectFolder?.(segment.id)}
              className="text-zinc-400 hover:text-zinc-100 hover:underline underline-offset-2 transition-colors cursor-pointer truncate max-w-[180px] sm:max-w-[240px] text-left py-0.5"
              title={`Reveal "${segment.name}" in File Explorer`}
            >
              {segment.name}
            </button>
          </li>
        ))}

        {/* Terminal Leaf: Current Topic Title */}
        <li className="flex items-center">
          {pathSegments.length > 0 && (
            <span className="text-zinc-600 mx-1 select-none" aria-hidden="true">/</span>
          )}
          <span
            className="text-zinc-500 font-normal truncate max-w-[200px] sm:max-w-xs py-0.5"
            aria-current="page"
            title={topic.title}
          >
            {topic.title}
          </span>
        </li>
      </ol>
    </nav>
  );
};
