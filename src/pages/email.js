import React, { useState } from 'react';
import { useGlobalContext } from '@/context/GlobalContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Send, Inbox, Mail, Star } from 'lucide-react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const emailSchema = z.object({
  to: z.string().email({ message: "Invalid email address" }),
  subject: z.string().min(1, { message: "Subject is required" }),
  body: z.string().min(1, { message: "Email body is required" }),
});

export default function Email() {
  const { state, dispatch } = useGlobalContext();
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState('inbox');
  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(emailSchema),
  });

  const onSubmit = (data) => {
    // In a real application, this would send the email
    console.log('Sending email:', data);
    dispatch({
      type: 'SEND_EMAIL',
      payload: { ...data, id: Date.now().toString(), date: new Date().toISOString() }
    });
    toast({
      title: "Email Sent",
      description: `Your email to ${data.to} has been sent.`,
    });
    setIsComposeOpen(false);
    reset();
  };

  const folders = [
    { name: 'Inbox', icon: Inbox },
    { name: 'Sent', icon: Send },
    { name: 'Drafts', icon: Mail },
    { name: 'Starred', icon: Star },
  ];

  const emails = state.emails || [];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Email</h1>
        <Button onClick={() => setIsComposeOpen(true)}>
          <Mail className="mr-2 h-4 w-4" /> Compose
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card className="col-span-1">
          <CardContent className="p-4">
            {folders.map((folder) => (
              <Button
                key={folder.name}
                variant={selectedFolder === folder.name.toLowerCase() ? "secondary" : "ghost"}
                className="w-full justify-start mb-2"
                onClick={() => setSelectedFolder(folder.name.toLowerCase())}
              >
                <folder.icon className="mr-2 h-4 w-4" />
                {folder.name}
              </Button>
            ))}
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>{selectedFolder.charAt(0).toUpperCase() + selectedFolder.slice(1)}</CardTitle>
          </CardHeader>
          <CardContent>
            {emails
              .filter(email => email.folder === selectedFolder)
              .map((email) => (
                <div key={email.id} className="mb-2 p-2 bg-secondary rounded-md">
                  <div className="flex justify-between">
                    <span className="font-bold">{email.to}</span>
                    <span className="text-sm text-muted-foreground">{new Date(email.date).toLocaleString()}</span>
                  </div>
                  <div>{email.subject}</div>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Compose Email</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="to">To</Label>
              <Input id="to" {...register("to")} />
              {errors.to && <p className="text-red-500 text-sm">{errors.to.message}</p>}
            </div>
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" {...register("subject")} />
              {errors.subject && <p className="text-red-500 text-sm">{errors.subject.message}</p>}
            </div>
            <div>
              <Label htmlFor="body">Message</Label>
              <Textarea id="body" {...register("body")} rows={5} />
              {errors.body && <p className="text-red-500 text-sm">{errors.body.message}</p>}
            </div>
            <Button type="submit">Send Email</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}