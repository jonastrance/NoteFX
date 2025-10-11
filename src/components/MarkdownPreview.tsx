import DOMPurify from 'isomorphic-dompurify';
import { useMemo } from 'react';

const escapeHtml = (text: string) =>
  text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const renderMarkdown = (markdown: string): string => {
  const escaped = escapeHtml(markdown);
  return escaped
    .replace(/^######\s?(.*)$/gim, '<h6>$1</h6>')
    .replace(/^#####\s?(.*)$/gim, '<h5>$1</h5>')
    .replace(/^####\s?(.*)$/gim, '<h4>$1</h4>')
    .replace(/^###\s?(.*)$/gim, '<h3>$1</h3>')
    .replace(/^##\s?(.*)$/gim, '<h2>$1</h2>')
    .replace(/^#\s?(.*)$/gim, '<h1>$1</h1>')
    .replace(/^>\s?(.*)$/gim, '<blockquote>$1</blockquote>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/__(.*?)__/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/_(.*?)_/gim, '<em>$1</em>')
    .replace(/`([^`]+)`/gim, '<code>$1</code>')
    .replace(/\n\n/gim, '</p><p>')
    .replace(/\n/gim, '<br />')
    .replace(/^\s*\-\s+(.*)$/gim, '<ul><li>$1</li></ul>')
    .replace(/<\/ul>\s*<ul>/gim, '');
};

interface MarkdownPreviewProps {
  content: string;
}

export const MarkdownPreview = ({ content }: MarkdownPreviewProps) => {
  const rendered = useMemo(() => {
    if (!content.trim()) return '<p class="text-slate-500">Start typing to see the preview...</p>';
    const html = renderMarkdown(content);
    return DOMPurify.sanitize(`<p>${html}</p>`);
  }, [content]);

  return (
    <div
      className="prose prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: rendered }}
      aria-live="polite"
    />
  );
};
