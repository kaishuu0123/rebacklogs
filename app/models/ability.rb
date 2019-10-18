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
      can :manage, Project, groups: { id: user.groups.pluck(:id) }
      can :manage, [Sprint] do |sprint|
        sprint.project.groups.where(id: user.groups.pluck(:id))
      end
      can :manage, [Story, Task, Ticket] do |ticket|
        ticket.project.groups.where(id: user.groups.pluck(:id))
      end
      can :manage, [ProjectTicketCategory, ProjectTicketStatus] do |entry|
        entry.project.groups.where(id: user.groups.pluck(:id))
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
