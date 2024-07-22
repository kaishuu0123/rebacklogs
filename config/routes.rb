Rails.application.routes.draw do
  devise_for :users, controllers: { omniauth_callbacks: 'omniauth_callbacks' }
  # OmniAuth認証後、email入力を求める処理のため。
  match '/users/:id/finish_signup' => 'omniauth_finished#finish_signup', via: %i[get patch], as: :finish_signup

  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  root to: 'projects#index'
  get '/:ticket_number', to: 'projects#show_with_ticket_number', ticket_number: /[A-Za-z]+-[0-9]+/

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
    member do
      get 'closed_sprints'
      get 'settings'

      get 'users'
      get 'groups'
      get 'project_tags'

      post 'add_group'
      delete 'delete_group/:group_id', action: 'delete_group'
      delete 'delete_image'
    end
  end

  get '/groups_by_name', to: 'groups#search_by_name'

  get '/profiles', to: 'profiles#index'
  patch '/profiles', to: 'profiles#update'
  patch '/profiles/update_password', to: 'profiles#update_password'
  # patch '/profiles/use_gravatar', to: 'profiles#use_gravatar'
  delete '/profiles/image', to: 'profiles#destroy_image'

  namespace :application_settings do
    root to: 'dashboard#index'
    get '/', to: 'dashboard#index'
    post '/', to: 'dashboard#update'

    patch 'group_managements/:id/add_user', to: 'group_managements#add_user', as: 'group_managements_add_user'
    delete 'group_managements/:id/remove_user/:user_id', to: 'group_managements#remove_user',
                                                         as: 'group_managements_remove_user'
    resources :group_managements

    patch 'user_managements/:id/update_role', to: 'user_managements#update_role', as: 'user_managements_update_role'
    delete 'user_managements/:id/destroy_image', to: 'user_managements#destroy_image',
                                                 as: 'user_managements_destroy_image'
    resources :user_managements
  end

  get '/installer', to: 'installer#index', as: 'installer'
  match '/installer', to: 'installer#update', via: %i[post patch]

  get '/health', to: 'health#health'

  # 開発環境でメールを確認するために LetterOpenerWeb エンジンのパスをマウントする
  # これにより以下 URL で開発環境でのメール確認が可能になる
  # http://localhost:3000/letter_opener
  mount LetterOpenerWeb::Engine, at: '/letter_opener' if Rails.env.development?
end
