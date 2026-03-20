export interface User {
  id: number;
  username: string;
  image: string | null;
}

export interface Tag {
  id: number;
  name: string;
}

export interface TicketCategory {
  id: number;
  title: string;
  color: string | null;
}

export interface TicketStatus {
  id: number;
  title: string;
  is_done: boolean;
}

export interface Comment {
  id: number;
  body: string;
  created_at: string;
  user: User;
}

export interface HistoryChange {
  attribute: string;
  before: string | null;
  after: string | null;
}

export interface History {
  id: number;
  changed_at: string;
  changed_by: string;
  changes: HistoryChange[];
}

export interface Task {
  id: number;
  title: string;
  body: string | null;
  ticket_number_with_ticket_prefix: string;
  is_done: boolean;
  story_id: number;
  project_ticket_status_id: number | null;
  project_ticket_status: TicketStatus | null;
  assignee_id: number | null;
  assignee: User | null;
  tags: Tag[];
  story?: Story;
  comments?: Comment[];
  histories?: History[];
  created_user?: User;
  last_updated_user?: User;
  created_at?: string;
  updated_at?: string;
  point?: number;
}

export interface Story {
  id: number;
  title: string;
  body: string | null;
  ticket_number_with_ticket_prefix: string;
  point: number;
  is_done: boolean;
  project_id: number;
  sprint_id: number | null;
  project_ticket_status_id: number | null;
  project_ticket_category_id: number | null;
  project_ticket_category: TicketCategory | null;
  project_ticket_status: TicketStatus | null;
  assignee_id: number | null;
  assignee: User | null;
  tags: Tag[];
  tasks?: Task[];
  comments?: Comment[];
  histories?: History[];
  created_user?: User;
  last_updated_user?: User;
  created_at?: string;
  updated_at?: string;
}

export interface Sprint {
  id: number;
  title: string;
  start_datetime: string | null;
  end_datetime: string | null;
  closed: boolean;
  stories: Story[];
}

export interface BacklogsData {
  sprints: Sprint[];
  storiesInBacklogs: Story[];
}
