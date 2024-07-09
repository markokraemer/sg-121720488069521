import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useGlobalContext } from '@/context/GlobalContext';
import { Search } from 'lucide-react';
import Link from 'next/link';

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { state } = useGlobalContext();

  const searchResults = React.useMemo(() => {
    if (!searchTerm) return [];

    const lowerSearchTerm = searchTerm.toLowerCase();

    const contactResults = state.contacts
      .filter(contact => 
        contact.name.toLowerCase().includes(lowerSearchTerm) ||
        contact.email.toLowerCase().includes(lowerSearchTerm) ||
        contact.company.toLowerCase().includes(lowerSearchTerm)
      )
      .map(contact => ({ ...contact, type: 'contact' }));

    const leadResults = Object.values(state.leads)
      .flat()
      .filter(lead => 
        lead.name.toLowerCase().includes(lowerSearchTerm) ||
        lead.company.toLowerCase().includes(lowerSearchTerm) ||
        lead.email.toLowerCase().includes(lowerSearchTerm)
      )
      .map(lead => ({ ...lead, type: 'lead' }));

    return [...contactResults, ...leadResults].slice(0, 10); // Limit to 10 results
  }, [searchTerm, state.contacts, state.leads]);

  return (
    <>
      <Button variant="outline" onClick={() => setIsOpen(true)}>
        <Search className="h-4 w-4 mr-2" />
        Search
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Global Search</DialogTitle>
          </DialogHeader>
          <Input
            type="text"
            placeholder="Search contacts, leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="mt-4 space-y-2">
            {searchResults.map((result) => (
              <Link
                key={result.id}
                href={result.type === 'contact' ? `/contacts/${result.id}` : `/leads#${result.id}`}
                onClick={() => setIsOpen(false)}
                className="block p-2 hover:bg-accent rounded-md"
              >
                <div className="font-semibold">{result.name}</div>
                <div className="text-sm text-muted-foreground">
                  {result.type === 'contact' ? 'Contact' : 'Lead'} - {result.company}
                </div>
              </Link>
            ))}
            {searchResults.length === 0 && searchTerm && (
              <div className="text-center text-muted-foreground">No results found</div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}