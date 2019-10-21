# frozen_string_literal: true

class Ability
  include CanCan::Ability

  def initialize(user)
    # Define abilities for the passed in user here. For example:
    #
    #   user ||= User.new # guest user (not logged in)
    #   if user.admin?
    #     can :manage, :all
    #   else
    #     can :read, :all
    #   end
    #
    # The first argument to `can` is the action you are giving the user
    # permission to do.
    # If you pass :manage it will apply to every action. Other common actions
    # here are :read, :create, :update and :destroy.
    #
    # The second argument is the resource the user can perform the action on.
    # If you pass :all it will apply to every resource. Otherwise pass a Ruby
    # class of the resource.
    #
    # The third argument is an optional hash of conditions to further filter the
    # objects.
    # For example, here the user can only update published articles.
    #
    #   can :update, Article, :published => true
    #
    # See the wiki for details:
    # https://github.com/CanCanCommunity/cancancan/wiki/Defining-Abilities

    # 全ての権限を剥奪
    cannot :manage, :all

    if user.has_role?(:developer)
      # Public Project (read only)
      can [:read, :closed_sprints], Project, is_public: true
      can [:read, :closed_sprints, :kanban, :kanban_api], Sprint, project: { is_public: true }
      can :read, [Story, Task, Ticket] do |ticket|
        ticket.project.is_public
      end
      can :read, [ProjectTicketCategory, ProjectTicketStatus] do |entry|
        entry.project.is_public
      end
      can :create, Comment do |comment|
        comment.ticket.project.is_public
      end
      can :destroy, Comment do |comment|
        comment.ticket.project.is_public && comment.user.id == user.id
      end

      # 自身が属しているプロジェクト
      can :manage, Project, groups: { id: user.groups.pluck(:id) }
      can :manage, Sprint do |sprint|
        (sprint.project.groups.pluck(:id) & user.groups.pluck(:id)).present?
      end
      can :manage, Story do |ticket|
        (ticket.project.groups.pluck(:id) & user.groups.pluck(:id)).present?
      end
      can :manage, Task do |ticket|
        (ticket.project.groups.pluck(:id) & user.groups.pluck(:id)).present?
      end
      can :manage, Ticket do |ticket|
        (ticket.project.groups.pluck(:id) & user.groups.pluck(:id)).present?
      end
      can :manage, [ProjectTicketCategory, ProjectTicketStatus] do |entry|
        (entry.project.groups.pluck(:id) & user.groups.pluck(:id)).present?
      end
      can :manage, Comment do |comment|
        (comment.ticket.project.groups.pluck(:id) & user.groups.pluck(:id)).present?
      end

      can :manage, Group, id: user.groups.pluck(:id)
      can :read, Group
      can :manage, User, id: user.id
    end

    if user.has_role?(:admin)
      can :manage, :all
    end
  end
end
