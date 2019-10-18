Rails.application.routes.draw do
  devise_for :users
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  root to: 'projects#index'

  resources :projects do
    resources :sprints, constraints: { format: :json }
    get '/api/closed_sprints', to: 'sprints#closed_sprints', as: 'closed_sprints_api'
    get '/sprints/:id/kanban', to: 'sprints#kanban', as: 'sprint_kanban'
    get '/sprints/:id/kanban/api', to: 'sprints#kanban_api'

    resources :project_ticket_categories, constraints: { format: :json }
    resources :project_ticket_statuses, constraints: { format: :json }

    resources :stories, controller: :tickets, type: Story, constraints: { format: :json } do
      resources :comments
    end
    resources :tasks, controller: :tickets, type: Task, constraints: { format: :json } do
      resources :comments
    end
  end

  get '/projects/:id/closed_sprints', to: 'projects#closed_sprints', as: 'project_closed_sprints'
  get '/projects/:id/settings', to: 'projects#settings', as: 'project_settings'

  get '/projects/:id/users', to: 'projects#users'
  get '/projects/:id/groups', to: 'projects#groups'

  post '/projects/:id/add_group', to: 'projects#add_group'
  delete '/projects/:id/delete_group/:group_id', to: 'projects#delete_group'
  delete '/projects/:id/delete_image', to: 'projects#delete_image'

  get '/groups_by_name', to: 'groups#search_by_name'

  get '/profiles', to: 'profiles#index'
  patch '/profiles', to: 'profiles#update'
  patch '/profiles/update_password', to: 'profiles#update_password'
  delete '/profiles/image', to: 'profiles#destroy_image'

  namespace :application_settings do
    root to: 'dashboard#index'
    get '/', to: 'dashboard#index'
    post '/', to: 'dashboard#update'

    patch 'group_managements/:id/add_user', to: 'group_managements#add_user', as: 'group_managements_add_user'
    delete 'group_managements/:id/remove_user/:user_id', to: 'group_managements#remove_user', as: 'group_managements_remove_user'
    resources :group_managements

    patch 'user_managements/:id/update_role', to: 'user_managements#update_role', as: 'user_managements_update_role'
    delete 'user_managements/:id/destroy_image', to: 'user_managements#destroy_image', as: 'user_managements_destroy_image'
    resources :user_managements
  end

  get '/installer', to: 'installer#index', as: 'installer'
  match '/installer', to: 'installer#update', via: [:post, :patch]

  get '/health', to: 'health#health'
end
