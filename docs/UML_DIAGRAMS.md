# UML Diagrams for TaskFlow

## 1. Use Case Diagram

```
@startuml
!theme plain
skinparam backgroundColor white

actor User as U

rectangle "TaskFlow System" {
  usecase "Sign Up" as UC1
  usecase "Sign In" as UC2
  usecase "Sign Out" as UC3
  usecase "Create Task" as UC4
  usecase "Edit Task" as UC5
  usecase "Delete Task" as UC6
  usecase "Mark Task Complete" as UC7
  usecase "Create Project" as UC8
  usecase "Delete Project" as UC9
  usecase "View Dashboard" as UC10
  usecase "Filter Tasks" as UC11
  usecase "Search Tasks" as UC12
  usecase "Manage Settings" as UC13
}

U --> UC1
U --> UC2
U --> UC3
U --> UC4
U --> UC5
U --> UC6
U --> UC7
U --> UC8
U --> UC9
U --> UC10
U --> UC11
U --> UC12
U --> UC13

UC4 ..> UC8 : <<extends>>
UC5 ..> UC8 : <<extends>>

@enduml
```

**Definition**: A Use Case Diagram shows the functional requirements of a system by depicting the interactions between actors (users) and the system's use cases (functionalities). It helps identify what the system should do from a user's perspective.

## 2. Class Diagram

```
@startuml
!theme plain
skinparam backgroundColor white

class User {
  +id: string
  +email: string
  +created_at: Date
  +last_sign_in_at: Date
}

class Task {
  +id: string
  +title: string
  +description: string?
  +completed: boolean
  +priority: Priority
  +due_date: Date?
  +created_at: Date
  +updated_at: Date
  +project_id: string?
  +user_id: string
  +toggleComplete(): void
  +updatePriority(priority: Priority): void
  +setDueDate(date: Date): void
}

class Project {
  +id: string
  +name: string
  +description: string?
  +color: string
  +created_at: Date
  +user_id: string
  +getTaskCount(): number
  +getCompletedTasks(): Task[]
}

enum Priority {
  LOW
  MEDIUM
  HIGH
}

class AuthContext {
  +user: User?
  +session: Session?
  +loading: boolean
  +signIn(email: string, password: string): Promise<void>
  +signUp(email: string, password: string): Promise<void>
  +signOut(): Promise<void>
}

class TaskService {
  +fetchTasks(): Promise<Task[]>
  +createTask(task: TaskInput): Promise<Task>
  +updateTask(id: string, updates: Partial<Task>): Promise<void>
  +deleteTask(id: string): Promise<void>
}

class ProjectService {
  +fetchProjects(): Promise<Project[]>
  +createProject(project: ProjectInput): Promise<Project>
  +updateProject(id: string, updates: Partial<Project>): Promise<void>
  +deleteProject(id: string): Promise<void>
}

User ||--o{ Task : owns
User ||--o{ Project : creates
Project ||--o{ Task : contains
Task }o-- Priority : has

AuthContext --> User : manages
TaskService --> Task : manipulates
ProjectService --> Project : manipulates

@enduml
```

**Definition**: A Class Diagram shows the static structure of a system by displaying classes, their attributes, methods, and relationships. It provides a blueprint of the system's object-oriented design and data model.

## 3. Sequence Diagram - Task Creation Flow

```
@startuml
!theme plain
skinparam backgroundColor white

actor User as U
participant "NewTask Component" as NT
participant "useTasks Hook" as UT
participant "Supabase Client" as SC
participant "Database" as DB

U -> NT: Fill task form and submit
activate NT

NT -> NT: Validate form data
NT -> UT: createTask(taskData)
activate UT

UT -> SC: supabase.from('tasks').insert(taskData)
activate SC

SC -> DB: INSERT INTO tasks VALUES(...)
activate DB

DB --> SC: Task created successfully
deactivate DB

SC --> UT: Return created task
deactivate SC

UT -> UT: Refresh task list
UT --> NT: Task creation complete
deactivate UT

NT -> NT: Navigate to tasks page
NT --> U: Show success feedback
deactivate NT

@enduml
```

**Definition**: A Sequence Diagram shows the interaction between objects over time, displaying the sequence of messages exchanged between participants to accomplish a specific functionality. It helps understand the flow of operations and timing of interactions.

## 4. Activity Diagram - User Authentication Flow

```
@startuml
!theme plain
skinparam backgroundColor white

start

:User accesses application;

if (User authenticated?) then (yes)
  :Redirect to Dashboard;
  stop
else (no)
  :Show Login page;
endif

:User enters credentials;

if (Login or Sign Up?) then (Login)
  :Call signIn(email, password);
else (Sign Up)
  :Call signUp(email, password);
endif

:Send request to Supabase Auth;

if (Authentication successful?) then (yes)
  :Set user session;
  :Update auth context;
  :Redirect to Dashboard;
  stop
else (no)
  :Display error message;
  :Return to login form;
  stop
endif

@enduml
```

**Definition**: An Activity Diagram shows the workflow of a system by depicting the sequence of activities, decisions, and parallel processes. It helps visualize the business logic and control flow within a process or use case.

## 5. Component Diagram - System Architecture

```
@startuml
!theme plain
skinparam backgroundColor white

package "Frontend (React)" {
  component [App Component] as App
  component [Auth Context] as Auth
  component [Layout Component] as Layout
  component [Dashboard] as Dashboard
  component [Tasks Page] as Tasks
  component [Projects Page] as Projects
  component [Settings Page] as Settings
  
  package "Custom Hooks" {
    component [useTasks] as HookTasks
    component [useProjects] as HookProjects
    component [useAuth] as HookAuth
  }
  
  package "Components" {
    component [TaskCard] as TaskCard
    component [Login] as Login
    component [NewTask] as NewTask
  }
}

package "Backend Services" {
  component [Supabase Client] as SupabaseClient
  component [Authentication Service] as AuthService
  component [Database Service] as DBService
}

package "Database" {
  database [PostgreSQL] as DB {
    component [Users Table] as UsersTable
    component [Tasks Table] as TasksTable
    component [Projects Table] as ProjectsTable
  }
}

package "External Services" {
  component [Supabase Auth] as SupabaseAuth
  component [Supabase Database] as SupabaseDB
}

' Connections
App --> Auth
App --> Layout
Layout --> Dashboard
Layout --> Tasks
Layout --> Projects
Layout --> Settings

Dashboard --> HookTasks
Dashboard --> HookProjects
Tasks --> HookTasks
Tasks --> TaskCard
Projects --> HookProjects
Settings --> HookAuth

HookTasks --> SupabaseClient
HookProjects --> SupabaseClient
HookAuth --> SupabaseClient

SupabaseClient --> AuthService
SupabaseClient --> DBService

AuthService --> SupabaseAuth
DBService --> SupabaseDB

SupabaseDB --> DB
SupabaseAuth --> UsersTable

TasksTable --> UsersTable
ProjectsTable --> UsersTable

@enduml
```

**Definition**: A Component Diagram shows the organization and dependencies among software components. It illustrates the system's architecture by displaying how components are wired together through interfaces and dependencies, helping understand the system's modular structure.

## 6. State Chart Diagram - Task Lifecycle

```
@startuml
!theme plain
skinparam backgroundColor white

[*] --> Created : Create Task

state Created {
  Created : title: string
  Created : description: string
  Created : priority: low/medium/high
  Created : due_date: optional
}

Created --> InProgress : Start Working
Created --> Completed : Mark Complete
Created --> Deleted : Delete Task

state InProgress {
  InProgress : completed: false
  InProgress : can be edited
  InProgress : can set due date
}

InProgress --> Completed : Mark Complete
InProgress --> Created : Reset to Created
InProgress --> Deleted : Delete Task

state Completed {
  Completed : completed: true
  Completed : read-only state
}

Completed --> InProgress : Reopen Task
Completed --> Deleted : Delete Task

state Deleted {
  Deleted : removed from system
}

Deleted --> [*]

note right of Created : New tasks start here
note right of InProgress : Active work state
note right of Completed : Task finished
note bottom of Deleted : Final state

@enduml
```

**Definition**: A State Chart Diagram (also called State Machine Diagram) shows the different states an object can be in and the transitions between those states triggered by events. It helps understand the behavior and lifecycle of objects in the system, showing how they respond to different events and conditions over time.

## UML Notation Definitions Summary

1. **Use Case Diagram**: Captures functional requirements by showing interactions between actors and system use cases
2. **Class Diagram**: Displays static structure with classes, attributes, methods, and relationships
3. **Sequence Diagram**: Shows object interactions over time with message sequences
4. **Activity Diagram**: Depicts workflow with activities, decisions, and control flow
5. **Component Diagram**: Illustrates system architecture with component organization and dependencies
6. **State Chart Diagram**: Shows object states and transitions triggered by events over the object's lifecycle
