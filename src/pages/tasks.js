import React, { useState } from 'react';
import { useGlobalContext } from '@/context/GlobalContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Edit, Trash } from 'lucide-react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const taskSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]),
  status: z.enum(["todo", "in_progress", "done"]),
  associatedWith: z.object({
    type: z.enum(["contact", "lead"]),
    id: z.string()
  }).optional()
});

export default function Tasks() {
  const { state, dispatch } = useGlobalContext();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(taskSchema),
  });

  const onSubmit = (data) => {
    if (editingTask) {
      dispatch({
        type: 'UPDATE_TASK',
        payload: { ...editingTask, ...data }
      });
      toast({
        title: "Task Updated",
        description: `${data.title} has been successfully updated.`,
      });
    } else {
      dispatch({
        type: 'ADD_TASK',
        payload: { id: Date.now().toString(), ...data }
      });
      toast({
        title: "Task Added",
        description: `${data.title} has been successfully added to your tasks.`,
      });
    }
    setIsAddDialogOpen(false);
    setEditingTask(null);
    reset();
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setIsAddDialogOpen(true);
    reset(task);
  };

  const handleDelete = (id) => {
    dispatch({
      type: 'DELETE_TASK',
      payload: id
    });
    toast({
      title: "Task Deleted",
      description: "The task has been successfully deleted.",
      variant: "destructive",
    });
  };

  const handleStatusChange = (taskId, newStatus) => {
    dispatch({
      type: 'UPDATE_TASK',
      payload: { id: taskId, status: newStatus }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Tasks</h1>
        <Button onClick={() => { setEditingTask(null); setIsAddDialogOpen(true); reset(); }}>
          <Plus className="mr-2 h-4 w-4" /> Add Task
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {['todo', 'in_progress', 'done'].map((status) => (
          <Card key={status}>
            <CardHeader>
              <CardTitle>{status === 'in_progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)}</CardTitle>
            </CardHeader>
            <CardContent>
              {state.tasks.filter(task => task.status === status).map((task) => (
                <div key={task.id} className="mb-2 p-2 bg-secondary rounded-md">
                  <div className="flex items-center justify-between">
                    <Checkbox
                      checked={task.status === 'done'}
                      onCheckedChange={(checked) => handleStatusChange(task.id, checked ? 'done' : 'todo')}
                    />
                    <span className={`ml-2 flex-grow ${task.status === 'done' ? 'line-through' : ''}`}>{task.title}</span>
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(task)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(task.id)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                  {task.dueDate && <div className="text-sm text-muted-foreground mt-1">Due: {task.dueDate}</div>}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTask ? 'Edit Task' : 'Add New Task'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" {...register("title")} />
              {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input id="description" {...register("description")} />
            </div>
            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Input id="dueDate" type="date" {...register("dueDate")} />
            </div>
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select onValueChange={(value) => register("priority").onChange({ target: { value } })} defaultValue={editingTask?.priority || "medium"}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select onValueChange={(value) => register("status").onChange({ target: { value } })} defaultValue={editingTask?.status || "todo"}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit">{editingTask ? 'Update' : 'Add'} Task</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}