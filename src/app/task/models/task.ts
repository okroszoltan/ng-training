export class Task {
    public id: number;
    public name: string;
    public color: string;
    public position: number;
    public is_done: boolean;
    public created_at: string;
    public updated_at: string;
}

export class MoveableTask {
    public task: Task;
    public offset: number;
}