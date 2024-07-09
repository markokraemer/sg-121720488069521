import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Edit, Trash } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useGlobalContext } from '@/context/GlobalContext';

const contactSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, { message: "Invalid phone number." }),
  company: z.string().min(1, { message: "Company is required." }),
});

export default function Contacts() {
  const { state, dispatch } = useGlobalContext();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(contactSchema),
  });

  useEffect(() => {
    // Load contacts from global state
    // This is just a placeholder, you might want to fetch contacts from an API in a real application
  }, []);

  const onSubmit = (data) => {
    if (editingContact) {
      dispatch({
        type: 'UPDATE_CONTACT',
        payload: { ...editingContact, ...data }
      });
      setEditingContact(null);
    } else {
      dispatch({
        type: 'ADD_CONTACT',
        payload: { id: Date.now().toString(), ...data }
      });
    }
    setIsAddDialogOpen(false);
    reset();
  };

  const handleEdit = (contact) => {
    setEditingContact(contact);
    setIsAddDialogOpen(true);
    reset(contact);
  };

  const handleDelete = (id) => {
    dispatch({
      type: 'DELETE_CONTACT',
      payload: id
    });
  };

  const filteredContacts = state.contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Contacts</h1>
        <Button onClick={() => { setEditingContact(null); setIsAddDialogOpen(true); reset(); }}>
          <Plus className="mr-2 h-4 w-4" /> Add Contact
        </Button>
      </div>
      
      <div className="flex items-center space-x-2">
        <Input
          type="text"
          placeholder="Search contacts..."
          className="max-w-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button variant="ghost" size="icon">
          <Search className="h-4 w-4" />
        </Button>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredContacts.map((contact) => (
            <TableRow key={contact.id}>
              <TableCell className="font-medium">{contact.name}</TableCell>
              <TableCell>{contact.email}</TableCell>
              <TableCell>{contact.phone}</TableCell>
              <TableCell>{contact.company}</TableCell>
              <TableCell>
                <Button variant="ghost" onClick={() => handleEdit(contact)}>
                  <Edit className="h-4 w-4 mr-2" /> Edit
                </Button>
                <Button variant="ghost" className="text-red-500" onClick={() => handleDelete(contact.id)}>
                  <Trash className="h-4 w-4 mr-2" /> Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingContact ? 'Edit Contact' : 'Add New Contact'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...register("name")} />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
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
              <Label htmlFor="company">Company</Label>
              <Input id="company" {...register("company")} />
              {errors.company && <p className="text-red-500 text-sm">{errors.company.message}</p>}
            </div>
            <Button type="submit">{editingContact ? 'Update' : 'Add'} Contact</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}