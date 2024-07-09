import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Edit, Trash, ExternalLink } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useGlobalContext } from '@/context/GlobalContext';
import Link from 'next/link';
import { useToast } from "@/components/ui/use-toast";

const contactSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, { message: "Invalid phone number." }),
  company: z.string().min(1, { message: "Company is required." }),
  address: z.string().optional(),
  socialMedia: z.object({
    linkedin: z.string().url({ message: "Invalid LinkedIn URL" }).optional().or(z.literal('')),
    twitter: z.string().url({ message: "Invalid Twitter URL" }).optional().or(z.literal('')),
  }).optional(),
  notes: z.string().optional(),
});

export default function Contacts() {
  const { state, dispatch } = useGlobalContext();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [contactsPerPage] = useState(10);
  const { toast } = useToast();

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
      toast({
        title: "Contact Updated",
        description: `${data.name} has been successfully updated.`,
      });
    } else {
      dispatch({
        type: 'ADD_CONTACT',
        payload: { id: Date.now().toString(), ...data }
      });
      toast({
        title: "Contact Added",
        description: `${data.name} has been successfully added to your contacts.`,
      });
    }
    setIsAddDialogOpen(false);
    setEditingContact(null);
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
    toast({
      title: "Contact Deleted",
      description: "The contact has been successfully deleted.",
      variant: "destructive",
    });
  };

  const filteredContacts = state.contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get current contacts
  const indexOfLastContact = currentPage * contactsPerPage;
  const indexOfFirstContact = indexOfLastContact - contactsPerPage;
  const currentContacts = filteredContacts.slice(indexOfFirstContact, indexOfLastContact);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
          {currentContacts.map((contact) => (
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
                <Link href={`/contacts/${contact.id}`} passHref>
                  <Button variant="ghost">
                    <ExternalLink className="h-4 w-4 mr-2" /> View
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        {Array.from({ length: Math.ceil(filteredContacts.length / contactsPerPage) }, (_, i) => (
          <Button
            key={i}
            onClick={() => paginate(i + 1)}
            variant={currentPage === i + 1 ? "default" : "outline"}
            className="mx-1"
          >
            {i + 1}
          </Button>
        ))}
      </div>

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
            <div>
              <Label htmlFor="address">Address</Label>
              <Input id="address" {...register("address")} />
            </div>
            <div>
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input id="linkedin" {...register("socialMedia.linkedin")} />
              {errors.socialMedia?.linkedin && <p className="text-red-500 text-sm">{errors.socialMedia.linkedin.message}</p>}
            </div>
            <div>
              <Label htmlFor="twitter">Twitter</Label>
              <Input id="twitter" {...register("socialMedia.twitter")} />
              {errors.socialMedia?.twitter && <p className="text-red-500 text-sm">{errors.socialMedia.twitter.message}</p>}
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Input id="notes" {...register("notes")} />
            </div>
            <Button type="submit">{editingContact ? 'Update' : 'Add'} Contact</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}