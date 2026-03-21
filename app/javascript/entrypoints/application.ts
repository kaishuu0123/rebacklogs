import './application.css';
import '~/lib/i18n';
import * as Turbo from '@hotwired/turbo';
import {
  createIcons,
  HelpCircle,
  Pencil,
  Search,
  Settings,
  Trash2,
  User,
  Users,
} from 'lucide';
import type { ComponentType } from 'react';
import { TurboMount } from 'turbo-mount';
import { registerComponent } from 'turbo-mount/react';
import Backlogs from '~/components/react/Backlogs/index';
import ClosedSprints from '~/components/react/ClosedSprints/index';
import FlashToaster from '~/components/react/FlashToaster';
import Header from '~/components/react/Header';
import Kanban from '~/components/react/Kanban/index';
import ProjectSettings from '~/components/react/ProjectSettings/index';
import ProjectSidebar from '~/components/react/ProjectSidebar';
import ThemePicker from '~/components/react/ThemePicker';
import { applyDemoTheme, getDemoTheme } from '~/lib/theme-utils';

Turbo.start();

document.addEventListener('turbo:load', () => {
  createIcons({
    icons: { HelpCircle, Pencil, Search, Settings, Trash2, User, Users },
  });
  applyDemoTheme(getDemoTheme());
});

const turboMount = new TurboMount();

// Props are passed at runtime from ERB via turbo_mount — cast to satisfy turbo-mount's type
// biome-ignore lint/suspicious/noExplicitAny: turbo-mount requires ComponentType<any> for dynamic prop passing
const reg = (name: string, c: ComponentType<any>) =>
  registerComponent(turboMount, name, c);

reg('FlashToaster', FlashToaster);
reg('Header', Header);
reg('ProjectSidebar', ProjectSidebar);
reg('ProjectSettings', ProjectSettings);
reg('Backlogs', Backlogs);
reg('ClosedSprints', ClosedSprints);
reg('Kanban', Kanban);
reg('ThemePicker', ThemePicker);

export { turboMount };
