import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, MoreVertical } from 'lucide-react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useGlobalContext } from '@/context/GlobalContext';

const leadSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  company: z.string().min(1, { message: "Company is required." }),
  email: z.string().email({ message: "Invalid email address." }),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, { message: "Invalid phone number." }),
  status: z.enum(["new", "contacted", "qualified", "closed"]),
  notes: z.string().optional(),
});

const LeadCard = ({ lead, index, onEdit }) => (
  <Draggable draggableId={lead.id} index={index}>
    {(provided) => (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        className="bg-white p-4 mb-2 rounded shadow"
      >
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold">{lead.name}</h3>
            <p className="text-sm text-gray-600">{lead.company}</p>
            <p className="text-sm text-gray-600">{lead.email}</p>
            <p className="text-sm text-gray-600">{lead.phone}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => onEdit(lead)}>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
        {lead.notes && <p className="text-sm mt-2">{lead.notes}</p>}
      </div>
    )}
  </Draggable>
);

const LeadColumn = ({ title, leads, id, onEdit }) => (
  <Card className="w-64">
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <Droppable droppableId={id}>
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {leads.map((lead, index) => (
              <LeadCard key={lead.id} lead={lead} index={index} onEdit={onEdit} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </CardContent>
  </Card>
);

export default function Leads() {
  const { state, dispatch } = useGlobalContext();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(leadSchema),
  });

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    dispatch({
      type: 'MOVE_LEAD',
      payload: {
        leadId: result.draggableId,
        fromStatus: source.droppableId,
        toStatus: destination.droppableId,
      }
    });
  };

  const onSubmit = (data) => {
    if (editingLead) {
      dispatch({
        type: 'UPDATE_LEAD',
        payload: { ...editingLead, ...data }
      });
      setEditingLead(null);
    } else {
      dispatch({
        type: 'ADD_LEAD',
        payload: { id: Date.now().toString(), ...data }
      });
    }
    setIsAddDialogOpen(false);
    reset();
  };

  const handleEdit = (lead) => {
    setEditingLead(lead);
    setIsAddDialogOpen(true);
    reset(lead);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Leads</h1>
        <Button onClick={() => { setEditingLead(null); setIsAddDialogOpen(true); reset(); }}>
          <Plus className="mr-2 h-4 w-4" /> Add Lead
        </Button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex space-x-4 overflow-x-auto pb-4">
          <LeadColumn title="New" leads={state.leads.new} id="new" onEdit={handleEdit} />
          <LeadColumn title="Contacted" leads={state.leads.contacted} id="contacted" onEdit={handleEdit} />
          <LeadColumn title="Qualified" leads={state.leads.qualified} id="qualified" onEdit={handleEdit} />
          <LeadColumn title="Closed" leads={state.leads.closed} id="closed" onEdit={handleEdit} />
        </div>
      </DragDropContext>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingLead ? 'Edit Lead' : 'Add New Lead'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...register("name")} />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>
            <div>
              <Label htmlFor="company">Company</Label>
              <Input id="company" {...register("company")} />
              {errors.company && <p className="text-red-500 text-sm">{errors.company.message}</p>}
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" {...register("phone")} />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <select id="status" {...register("status")} className="w-full p-2 border rounded">
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="closed">Closed</option>
              </select>
              {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" {...register("notes")} />
            </div>
            <Button type="submit">{editingLead ? 'Update' : 'Add'} Lead</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}