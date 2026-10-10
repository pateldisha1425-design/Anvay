import React from 'react';
import { TopicNode } from '../types/knowledge';

export function resolveWikiLink(
  rawLink: string,
  topics: TopicNode[]
): { targetTopic?: TopicNode; displayText: string } {
  // Support syntax: [[Target Topic|Display Label]] or [[Target Topic]]
  let target = rawLink.trim();
  let label = target;

  if (target.includes('|')) {
    const parts = target.split('|');
    target = parts[0].trim();
    label = parts[1].trim();
  }

  const cleanTarget = target.toLowerCase();
  
  // 1. Direct ID match
  let found = topics.find(t => t.id.toLowerCase() === cleanTarget);

  // 2. Direct Title match
  if (!found) {
    found = topics.find(t => t.title.toLowerCase() === cleanTarget);
  }

  // 3. Partial title match (e.g. [[Oxides]] -> Definition and Classification of Oxides)
  if (!found) {
    found = topics.find(t => t.title.toLowerCase().includes(cleanTarget));
  }

  // 4. Word match
  if (!found) {
    found = topics.find(t => cleanTarget.includes(t.title.toLowerCase()));
  }

  return {
    targetTopic: found,
    displayText: label,
  };
}

export function extractWikiLinksFromContent(content: string): string[] {
  const matches: string[] = [];
  const regex = /\[\[(.*?)\]\]/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    matches.push(match[1]);
  }
  return matches;
}
