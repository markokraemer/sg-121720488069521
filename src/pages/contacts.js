import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from 'lucide-react';

const contacts = [
  { id: 1, name: "John Doe", email: "john@example.com", phone: "+1 234 567 890", company: "ABC Corp" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", phone: "+1 234 567 891", company: "XYZ Inc" },
  { id: 3, name: "Bob Johnson", email: "bob@example.com", phone: "+1 234 567 892", company: "123 LLC" },
  // Add more dummy data as needed
];

export default function Contacts() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Contacts</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Contact
        </Button>
      </div>
      
      <div className="flex items-center space-x-2">
        <Input
          type="text"
          placeholder="Search contacts..."
          className="max-w-sm"
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
          {contacts.map((contact) => (
            <TableRow key={contact.id}>
              <TableCell className="font-medium">{contact.name}</TableCell>
              <TableCell>{contact.email}</TableCell>
              <TableCell>{contact.phone}</TableCell>
              <TableCell>{contact.company}</TableCell>
              <TableCell>
                <Button variant="ghost">Edit</Button>
                <Button variant="ghost" className="text-red-500">Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}