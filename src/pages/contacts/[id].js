import React from 'react';
import { useRouter } from 'next/router';
import { useGlobalContext } from '@/context/GlobalContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Phone, Mail, Building, MapPin, Linkedin, Twitter, FileText, User, Target } from 'lucide-react';

export default function ContactDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { state } = useGlobalContext();

  const contact = state.contacts.find(c => c.id === id);
  const relatedLeads = state.leads.new.concat(state.leads.contacted, state.leads.qualified, state.leads.closed)
    .filter(lead => lead.contactId === id);

  if (!contact) {
    return <div>Contact not found</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left Sidebar */}
      <aside className="w-64 bg-gray-100 p-4 overflow-y-auto">
        <Card>
          <CardContent className="pt-6">
            <Avatar className="w-20 h-20 mx-auto mb-4">
              <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${contact.name}`} />
              <AvatarFallback>{contact.name[0]}</AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-bold text-center mb-2">{contact.name}</h2>
            <p className="text-center text-gray-500 mb-4">{contact.company}</p>
            <div className="flex justify-center space-x-2">
              <Button size="sm"><Phone className="w-4 h-4 mr-2" /> Call</Button>
              <Button size="sm"><Mail className="w-4 h-4 mr-2" /> Email</Button>
            </div>
          </CardContent>
        </Card>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>

            <Card className="mt-6">
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
          </TabsContent>
          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Activity timeline will be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="notes">
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{contact.notes || 'No notes available.'}</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Right Sidebar */}
      <aside className="w-64 bg-gray-100 p-4 overflow-y-auto">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button className="w-full"><FileText className="w-4 h-4 mr-2" /> Add Note</Button>
              <Button className="w-full"><User className="w-4 h-4 mr-2" /> Schedule Meeting</Button>
              <Button className="w-full"><Target className="w-4 h-4 mr-2" /> Create Lead</Button>
            </div>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}