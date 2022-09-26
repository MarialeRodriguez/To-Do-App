export class Task {
id!: string;
description!: string;
user_id!: string;
}

export interface ITask {
    id: number;
    description: string;
    user_id: string;
}