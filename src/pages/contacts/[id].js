import React from 'react';
import { useRouter } from 'next/router';
import { useGlobalContext } from '@/context/GlobalContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Phone, Mail, Building, MapPin, Linkedin, Twitter, FileText, User, Target } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

export default function ContactDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { state, dispatch } = useGlobalContext();
  const { toast } = useToast();

  const contact = state.contacts.find(c => c.id === id);
  const relatedLeads = Object.values(state.leads)
    .flat()
    .filter(lead => lead.contactId === id);

  if (!contact) {
    return <div>Contact not found</div>;
  }

  const handleEditContact = () => {
    // Implement edit functionality
    toast({
      title: "Edit Contact",
      description: "Edit functionality to be implemented.",
    });
  };

  const handleDeleteContact = () => {
    dispatch({
      type: 'DELETE_CONTACT',
      payload: id
    });
    toast({
      title: "Contact Deleted",
      description: "The contact has been successfully deleted.",
      variant: "destructive",
    });
    router.push('/contacts');
  };

  const handleAddNote = () => {
    // Implement add note functionality
    toast({
      title: "Add Note",
      description: "Note adding functionality to be implemented.",
    });
  };

  const handleScheduleMeeting = () => {
    // Implement schedule meeting functionality
    toast({
      title: "Schedule Meeting",
      description: "Meeting scheduling functionality to be implemented.",
    });
  };

  const handleCreateLead = () => {
    // Implement create lead functionality
    toast({
      title: "Create Lead",
      description: "Lead creation functionality to be implemented.",
    });
  };

  return (
    <div className="flex flex-col lg:flex-row h-full space-y-4 lg:space-y-0 lg:space-x-4">
      {/* Left Sidebar */}
      <aside className="w-full lg:w-1/4 space-y-4">
        <Card>
          <CardContent className="pt-6">
            <Avatar className="w-20 h-20 mx-auto mb-4">
              <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${contact.name}`} />
              <AvatarFallback>{contact.name[0]}</AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-bold text-center mb-2">{contact.name}</h2>
            <p className="text-center text-gray-500 mb-4">{contact.company}</p>
            <div className="flex justify-center space-x-2">
              <Button size="sm" onClick={() => window.location.href = `tel:${contact.phone}`}>
                <Phone className="w-4 h-4 mr-2" /> Call
              </Button>
              <Button size="sm" onClick={() => window.location.href = `mailto:${contact.email}`}>
                <Mail className="w-4 h-4 mr-2" /> Email
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button className="w-full" onClick={handleAddNote}>
                <FileText className="w-4 h-4 mr-2" /> Add Note
              </Button>
              <Button className="w-full" onClick={handleScheduleMeeting}>
                <User className="w-4 h-4 mr-2" /> Schedule Meeting
              </Button>
              <Button className="w-full" onClick={handleCreateLead}>
                <Target className="w-4 h-4 mr-2" /> Create Lead
              </Button>
            </div>
          </CardContent>
        </Card>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <Card className="mb-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Contact Information</CardTitle>
            <div>
              <Button variant="outline" className="mr-2" onClick={handleEditContact}>Edit</Button>
              <Button variant="destructive" onClick={handleDeleteContact}>Delete</Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>
              <TabsContent value="overview">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 mr-2 text-gray-500" />
                    <span>{contact.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 mr-2 text-gray-500" />
                    <span>{contact.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <Building className="w-5 h-5 mr-2 text-gray-500" />
                    <span>{contact.company}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-gray-500" />
                    <span>{contact.address || 'N/A'}</span>
                  </div>
                  <div className="flex items-center">
                    <Linkedin className="w-5 h-5 mr-2 text-gray-500" />
                    <span>{contact.socialMedia?.linkedin || 'N/A'}</span>
                  </div>
                  <div className="flex items-center">
                    <Twitter className="w-5 h-5 mr-2 text-gray-500" />
                    <span>{contact.socialMedia?.twitter || 'N/A'}</span>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="activity">
                <p>Activity timeline will be implemented here.</p>
              </TabsContent>
              <TabsContent value="notes">
                <p>{contact.notes || 'No notes available.'}</p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Related Leads</CardTitle>
          </CardHeader>
          <CardContent>
            {relatedLeads.length > 0 ? (
              <ul className="space-y-2">
                {relatedLeads.map(lead => (
                  <li key={lead.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Target className="w-5 h-5 mr-2 text-gray-500" />
                      <span>{lead.name} - {lead.company}</span>
                    </div>
                    <Badge>{lead.status}</Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No related leads found.</p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}