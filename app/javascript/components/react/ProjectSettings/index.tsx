import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Toaster } from 'sonner';
import GeneralSettings from './GeneralSettings';
import GroupManagements from './GroupManagements';
import TicketCategories from './TicketCategories';
import TicketStatuses from './TicketStatuses';

type Tab = 'general' | 'groups' | 'categories' | 'statuses';

interface Props {
  projectId: string;
  activeTab?: string;
}

const queryClient = new QueryClient();

export default function ProjectSettings({
  projectId,
  activeTab = 'general',
}: Props) {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-right" />
      <ProjectSettingsInner
        projectId={projectId}
        activeTab={activeTab as Tab}
      />
    </QueryClientProvider>
  );
}

function ProjectSettingsInner({
  projectId,
  activeTab,
}: {
  projectId: string;
  activeTab: Tab;
}) {
  const { t } = useTranslation();

  const tabs: { id: Tab; label: string }[] = [
    { id: 'general', label: t('settings.generalSettings') },
    { id: 'groups', label: t('settings.groupManagements') },
    { id: 'categories', label: t('settings.ticketCategories') },
    { id: 'statuses', label: t('settings.ticketStatuses') },
  ];

  const tabUrl = (id: Tab) => `${window.location.pathname}?tab=${id}`;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center h-14 px-6 shrink-0">
        <h2 className="text-sm font-semibold">{t('settings.settings')}</h2>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Sub-sidebar */}
        <nav className="w-52 shrink-0 px-4 py-2 space-y-1">
          {tabs.map((tab) => (
            <a
              key={tab.id}
              href={tabUrl(tab.id)}
              className={`flex items-center rounded-md px-3 py-2 text-sm transition-colors ${
                activeTab === tab.id
                  ? 'bg-secondary text-secondary-foreground font-medium'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              }`}
            >
              {tab.label}
            </a>
          ))}
        </nav>

        {/* Content */}
        <div className="flex-1 min-w-0 px-6 py-2 overflow-y-auto">
          {activeTab === 'general' && <GeneralSettings projectId={projectId} />}
          {activeTab === 'groups' && <GroupManagements projectId={projectId} />}
          {activeTab === 'categories' && (
            <TicketCategories projectId={projectId} />
          )}
          {activeTab === 'statuses' && <TicketStatuses projectId={projectId} />}
        </div>
      </div>
    </div>
  );
}
