class GroupsController < ApplicationController
  def search_by_name
    authorize! :read, Group

    name = ActiveRecord::Base.sanitize_sql_like(params[:name])
    @groups = Group.where('name LIKE :name', name: "%#{name}%")
  end
end
