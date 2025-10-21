export interface Task {
  id: number;
  title: string;
  description: string;
  date: string;
  time?: string;
  typeId: number;
  color?: string;
  typeName?: string;
  completed?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface TaskType {
  id: number;
  name: string;
  color?: string;
}

export interface TaskForm {
  title: string;
  description: string;
  date: string;
  time?: string;
  typeId: number;
  completed: boolean;
}