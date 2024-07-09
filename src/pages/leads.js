import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, MoreVertical, Search } from 'lucide-react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useGlobalContext } from '@/context/GlobalContext';
import { useToast } from "@/components/ui/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const leadSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  company: z.string().min(1, { message: "Company is required." }),
  email: z.string().email({ message: "Invalid email address." }),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, { message: "Invalid phone number." }),
  status: z.enum(["new", "contacted", "qualified", "closed"]),
  value: z.number().min(0, { message: "Value must be a positive number." }),
  notes: z.string().optional(),
  contactId: z.string().optional(),
});

const LeadCard = ({ lead, index, onEdit, onDelete }) => (
  <Draggable draggableId={lead.id} index={index}>
    {(provided) => (
      <Card
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        className="mb-2 cursor-move hover:shadow-md transition-shadow duration-200"
      >
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold">{lead.name}</h3>
              <p className="text-sm text-gray-600">{lead.company}</p>
              <p className="text-sm text-gray-600">{lead.email}</p>
              <p className="text-sm text-gray-600">${lead.value}</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => onEdit(lead)}>Edit</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(lead.id)} className="text-red-600">Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {lead.notes && <p className="text-sm mt-2 text-gray-700">{lead.notes}</p>}
        </CardContent>
      </Card>
    )}
  </Draggable>
);

const LeadColumn = ({ title, leads, id, onEdit, onDelete }) => (
  <Card className="w-64">
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <Droppable droppableId={id}>
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {leads.map((lead, index) => (
              <LeadCard key={lead.id} lead={lead} index={index} onEdit={onEdit} onDelete={onDelete} />
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
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
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

    toast({
      title: "Lead Moved",
      description: `Lead has been moved to ${destination.droppableId} stage.`,
    });
  };

  const onSubmit = (data) => {
    if (editingLead) {
      dispatch({
        type: 'UPDATE_LEAD',
        payload: { ...editingLead, ...data }
      });
      toast({
        title: "Lead Updated",
        description: `${data.name} has been successfully updated.`,
      });
    } else {
      dispatch({
        type: 'ADD_LEAD',
        payload: { id: Date.now().toString(), ...data }
      });
      toast({
        title: "Lead Added",
        description: `${data.name} has been successfully added to your leads.`,
      });
    }
    setIsAddDialogOpen(false);
    setEditingLead(null);
    reset();
  };

  const handleEdit = (lead) => {
    setEditingLead(lead);
    setIsAddDialogOpen(true);
    Object.keys(lead).forEach(key => {
      setValue(key, lead[key]);
    });
  };

  const handleDelete = (id) => {
    dispatch({
      type: 'DELETE_LEAD',
      payload: id
    });
    toast({
      title: "Lead Deleted",
      description: "The lead has been successfully deleted.",
      variant: "destructive",
    });
  };

  const filteredLeads = Object.fromEntries(
    Object.entries(state.leads).map(([status, leads]) => [
      status,
      leads.filter(lead =>
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    ])
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Leads</h1>
        <Button onClick={() => { setEditingLead(null); setIsAddDialogOpen(true); reset(); }}>
          <Plus className="mr-2 h-4 w-4" /> Add Lead
        </Button>
      </div>

      <div className="flex items-center space-x-2 mb-4">
        <Input
          type="text"
          placeholder="Search leads..."
          className="max-w-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button variant="ghost" size="icon">
          <Search className="h-4 w-4" />
        </Button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex space-x-4 overflow-x-auto pb-4">
          <LeadColumn title="New" leads={filteredLeads.new} id="new" onEdit={handleEdit} onDelete={handleDelete} />
          <LeadColumn title="Contacted" leads={filteredLeads.contacted} id="contacted" onEdit={handleEdit} onDelete={handleDelete} />
          <LeadColumn title="Qualified" leads={filteredLeads.qualified} id="qualified" onEdit={handleEdit} onDelete={handleDelete} />
          <LeadColumn title="Closed" leads={filteredLeads.closed} id="closed" onEdit={handleEdit} onDelete={handleDelete} />
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
              <Select onValueChange={(value) => setValue("status", value)} defaultValue={editingLead?.status || "new"}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
            </div>
            <div>
              <Label htmlFor="value">Value</Label>
              <Input id="value" type="number" {...register("value", { valueAsNumber: true })} />
              {errors.value && <p className="text-red-500 text-sm">{errors.value.message}</p>}
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" {...register("notes")} />
            </div>
            <div>
              <Label htmlFor="contactId">Associated Contact</Label>
              <Select onValueChange={(value) => setValue("contactId", value)} defaultValue={editingLead?.contactId || ""}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a contact" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {state.contacts.map(contact => (
                    <SelectItem key={contact.id} value={contact.id}>{contact.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit">{editingLead ? 'Update' : 'Add'} Lead</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}