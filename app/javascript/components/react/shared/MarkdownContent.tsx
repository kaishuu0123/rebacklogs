import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';

interface Props {
  content: string | null | undefined;
}

export default function MarkdownContent({ content }: Props) {
  const { t } = useTranslation();

  if (!content) {
    return (
      <p className="text-sm text-muted-foreground">
        {t('message.noDescription')}
      </p>
    );
  }

  return (
    <div className="prose prose-sm max-w-none text-sm">
      <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
