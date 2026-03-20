import ReactMarkdown from 'react-markdown';

interface Props {
  content: string | null | undefined;
}

export default function MarkdownContent({ content }: Props) {
  if (!content) {
    return <p className="text-xs text-muted-foreground">No description.</p>;
  }

  return (
    <div className="prose prose-sm max-w-none text-sm">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
