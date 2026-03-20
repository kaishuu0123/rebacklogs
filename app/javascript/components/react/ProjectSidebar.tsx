import {
  ChevronRightIcon,
  Columns2Icon,
  LayoutGridIcon,
  LayoutTemplateIcon,
  PanelLeftIcon,
  WrenchIcon,
} from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '~/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '~/components/ui/collapsible';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover';
import { Separator } from '~/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/ui/tooltip';

type Sprint = {
  id: number;
  title: string;
  kanbanPath: string;
};

type Project = {
  id: number;
  title: string;
  imageUrl: string;
  projectPath: string;
  closedSprintsPath: string;
  settingsPath: string;
};

type Props = {
  project: Project;
  sprints: Sprint[];
  currentPath: string;
};

const STORAGE_KEY = 'sidebar-collapsed';

function readCollapsed(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

function writeCollapsed(value: boolean) {
  try {
    localStorage.setItem(STORAGE_KEY, String(value));
  } catch {
    // ignore
  }
}

export default function ProjectSidebar({
  project,
  sprints,
  currentPath,
}: Props) {
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(readCollapsed);
  const [kanbanOpen, setKanbanOpen] = useState(
    sprints.some((s) => s.kanbanPath === currentPath),
  );

  const toggle = (next: boolean) => {
    setCollapsed(next);
    writeCollapsed(next);
  };

  const isActive = (path: string) => currentPath === path;
  const isOnSettings = currentPath === project.settingsPath;

  if (collapsed) {
    return (
      <TooltipProvider delayDuration={300}>
        <div className="react-root flex flex-col w-14 shrink-0 border-r bg-muted/30 h-full">
          {/* Toggle button */}
          <div className="flex items-center justify-center px-2 py-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => toggle(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
                >
                  <PanelLeftIcon size={18} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                {t('action.openSidebar')}
              </TooltipContent>
            </Tooltip>
          </div>

          <Separator />

          <nav className="flex flex-col items-center gap-1 p-2 flex-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href={project.projectPath}
                  className={`flex h-9 w-9 items-center justify-center rounded-md ${
                    isActive(project.projectPath)
                      ? 'bg-secondary text-secondary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  }`}
                >
                  <Columns2Icon size={18} />
                </a>
              </TooltipTrigger>
              <TooltipContent side="right">
                {t('title.backlogs')}
              </TooltipContent>
            </Tooltip>

            <Popover>
              <Tooltip>
                <TooltipTrigger asChild>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className={`flex h-9 w-9 items-center justify-center rounded-md ${
                        sprints.some((s) => isActive(s.kanbanPath))
                          ? 'bg-secondary text-secondary-foreground'
                          : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                      }`}
                    >
                      <LayoutGridIcon size={18} />
                    </button>
                  </PopoverTrigger>
                </TooltipTrigger>
                <TooltipContent side="right">
                  {t('title.kanban')}
                </TooltipContent>
              </Tooltip>
              <PopoverContent side="right" align="start" className="w-48 p-1">
                <p className="px-2 py-1 text-xs text-muted-foreground">
                  {t('title.openingSprints')}
                </p>
                {sprints.map((sprint) => (
                  <a
                    key={sprint.id}
                    href={sprint.kanbanPath}
                    className={`flex items-center rounded-md px-2 py-1.5 text-sm hover:bg-accent ${
                      isActive(sprint.kanbanPath)
                        ? 'bg-secondary font-medium'
                        : ''
                    }`}
                  >
                    {sprint.title}
                  </a>
                ))}
              </PopoverContent>
            </Popover>

            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href={project.closedSprintsPath}
                  className={`flex h-9 w-9 items-center justify-center rounded-md ${
                    isActive(project.closedSprintsPath)
                      ? 'bg-secondary text-secondary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  }`}
                >
                  <LayoutTemplateIcon size={18} />
                </a>
              </TooltipTrigger>
              <TooltipContent side="right">
                {t('title.closedSprints')}
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href={project.settingsPath}
                  className={`flex h-9 w-9 items-center justify-center rounded-md ${
                    isOnSettings
                      ? 'bg-secondary text-secondary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  }`}
                >
                  <WrenchIcon size={18} />
                </a>
              </TooltipTrigger>
              <TooltipContent side="right">
                {t('action.settings')}
              </TooltipContent>
            </Tooltip>
          </nav>
        </div>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider delayDuration={300}>
      <div className="react-root flex flex-col w-56 shrink-0 border-r bg-muted/30 h-full">
        {/* Header */}
        <div className="flex items-center gap-2 px-3 py-3">
          <a
            href={project.projectPath}
            className="flex items-center gap-2 flex-1 min-w-0 hover:opacity-80"
          >
            <img
              src={project.imageUrl}
              width={32}
              className="rounded shrink-0"
              alt={project.title}
            />
            <span className="font-semibold text-sm truncate">
              {project.title}
            </span>
          </a>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => toggle(true)}
                className="shrink-0 flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                <PanelLeftIcon size={16} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              {t('action.closeSidebar')}
            </TooltipContent>
          </Tooltip>
        </div>

        <Separator />

        <nav className="flex flex-col gap-1 p-2 flex-1 overflow-y-auto">
          <Button
            variant={isActive(project.projectPath) ? 'secondary' : 'ghost'}
            size="sm"
            className="justify-start"
            asChild
          >
            <a href={project.projectPath}>
              <Columns2Icon size={16} />
              {t('title.backlogs')}
            </a>
          </Button>

          <Collapsible open={kanbanOpen} onOpenChange={setKanbanOpen}>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-between"
              >
                <span className="flex items-center gap-2">
                  <LayoutGridIcon size={16} />
                  {t('title.kanban')}
                </span>
                <ChevronRightIcon
                  size={14}
                  className={`text-muted-foreground transition-transform duration-200 ${kanbanOpen ? 'rotate-90' : ''}`}
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="ml-4 mt-1 flex flex-col gap-1">
                <span className="text-xs text-muted-foreground px-3 py-1">
                  {t('title.openingSprints')}:
                </span>
                {sprints.map((sprint) => (
                  <Button
                    key={sprint.id}
                    variant={
                      isActive(sprint.kanbanPath) ? 'secondary' : 'ghost'
                    }
                    size="sm"
                    className="justify-start"
                    asChild
                  >
                    <a href={sprint.kanbanPath}>{sprint.title}</a>
                  </Button>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Button
            variant={
              isActive(project.closedSprintsPath) ? 'secondary' : 'ghost'
            }
            size="sm"
            className="justify-start"
            asChild
          >
            <a href={project.closedSprintsPath}>
              <LayoutTemplateIcon size={16} />
              {t('title.closedSprints')}
            </a>
          </Button>

          <Button
            variant={isOnSettings ? 'secondary' : 'ghost'}
            size="sm"
            className="justify-start"
            asChild
          >
            <a href={project.settingsPath}>
              <WrenchIcon size={16} />
              {t('action.settings')}
            </a>
          </Button>
        </nav>
      </div>
    </TooltipProvider>
  );
}
