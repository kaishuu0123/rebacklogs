import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Check, ChevronsUpDown, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Button } from '~/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '~/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover';
import api from '~/lib/api';
import { cn } from '~/lib/utils';

interface Group {
  id: number;
  name: string;
  image: string | null;
}

interface Props {
  projectId: string;
}

export default function GroupManagements({ projectId }: Props) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  const { data: groups = [] } = useQuery({
    queryKey: ['projectGroups', projectId],
    queryFn: () =>
      api.get<Group[]>(`/projects/${projectId}/groups`).then((r) => r.data),
  });

  const { data: searchResults = [] } = useQuery({
    queryKey: ['groupsByName', search],
    queryFn: () =>
      api
        .get<Group[]>('/groups_by_name', { params: { name: search } })
        .then((r) => r.data),
  });

  const addGroupMutation = useMutation({
    mutationFn: (groupId: number) =>
      api.post(`/projects/${projectId}/add_group`, { group_id: groupId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectGroups', projectId] });
      setSelectedGroup(null);
      setSearch('');
    },
    onError: () => toast.error(t('message.failedToAddGroup')),
  });

  const deleteGroupMutation = useMutation({
    mutationFn: (groupId: number) =>
      api.delete(`/projects/${projectId}/delete_group/${groupId}`),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['projectGroups', projectId] }),
    onError: () => toast.error(t('message.failedToRemoveGroup')),
  });

  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-card shadow-sm p-6 space-y-4">
        <p className="text-sm text-muted-foreground">{t('message.addGroup')}</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (selectedGroup) addGroupMutation.mutate(selectedGroup.id);
          }}
          className="space-y-3"
        >
          <div className="space-y-2">
            <p className="text-sm font-medium">{t('action.selectGroup')}</p>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between font-normal"
                >
                  {selectedGroup ? selectedGroup.name : t('action.selectGroup')}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput
                    placeholder={t('action.selectGroup')}
                    value={search}
                    onValueChange={setSearch}
                  />
                  <CommandList>
                    <CommandEmpty>{t('message.noGroupsFound')}</CommandEmpty>
                    <CommandGroup>
                      {searchResults.map((g) => (
                        <CommandItem
                          key={g.id}
                          value={g.name}
                          onSelect={() => {
                            setSelectedGroup(g);
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              selectedGroup?.id === g.id
                                ? 'opacity-100'
                                : 'opacity-0',
                            )}
                          />
                          {g.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={!selectedGroup || addGroupMutation.isPending}
            >
              {t('action.addGroup')}
            </Button>
          </div>
        </form>
      </div>

      <div className="rounded-xl border bg-card shadow-sm">
        <div className="border-b px-4 py-3">
          <h3 className="text-sm font-semibold">{t('message.groups')}</h3>
        </div>
        <ul className="divide-y">
          {groups.map((group) => (
            <li key={group.id} className="flex items-center gap-3 px-4 py-3">
              {group.image && (
                <img
                  src={group.image}
                  width={32}
                  height={32}
                  className="rounded shrink-0"
                  alt=""
                />
              )}
              <span className="flex-1 text-sm">{group.name}</span>
              <button
                type="button"
                onClick={() => deleteGroupMutation.mutate(group.id)}
                className="text-destructive hover:text-destructive/80"
              >
                <Trash2 size={16} />
              </button>
            </li>
          ))}
          {groups.length === 0 && (
            <li className="px-4 py-6 text-center text-sm text-muted-foreground">
              {t('message.noGroupsAddedYet')}
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
