export type User = {
  id: string;
  email: string;
  name?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type ProjectMember = {
  id?: string;
  role: 'OWNER' | 'ADMIN' | 'CONTRIBUTOR';
  user: User;
  joinedAt?: string;
};

export type TaskAssignee = {
  id?: string;
  userId?: string;
  taskId?: string;
  user: User;
  assignedAt?: string;
};

export type Comment = {
  id: string;
  content: string;
  taskId: string;
  authorId: string;
  author: User;
  createdAt?: string;
  updatedAt?: string;
};

export type Task = {
  id: string;
  title: string;
  description?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  dueDate?: string;
  projectId: string;
  creatorId: string;
  assignees?: TaskAssignee[];
  comments?: Comment[];
  createdAt?: string;
  updatedAt?: string;
};

export type Project = {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  owner?: User;
  members?: ProjectMember[];
  tasks?: Task[];
  createdAt?: string;
  updatedAt?: string;
};
