import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useGlobalContext } from '@/context/GlobalContext';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const { state } = useGlobalContext();

  useEffect(() => {
    if (!searchTerm) {
      setSearchResults([]);
      return;
    }

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

    const taskResults = state.tasks
      .filter(task => 
        task.title.toLowerCase().includes(lowerSearchTerm) ||
        task.description.toLowerCase().includes(lowerSearchTerm)
      )
      .map(task => ({ ...task, type: 'task' }));

    setSearchResults([...contactResults, ...leadResults, ...taskResults].slice(0, 10));
  }, [searchTerm, state]);

  return (
    <>
      <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)} className="hidden md:inline-flex">
        <Search className="h-5 w-5" />
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Global Search</DialogTitle>
          </DialogHeader>
          <Input
            type="text"
            placeholder="Search contacts, leads, tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
          <AnimatePresence>
            {searchResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 space-y-2"
              >
                {searchResults.map((result) => (
                  <motion.div
                    key={`${result.type}-${result.id}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      href={
                        result.type === 'contact' ? `/contacts/${result.id}` :
                        result.type === 'lead' ? `/leads#${result.id}` :
                        `/tasks#${result.id}`
                      }
                      onClick={() => setIsOpen(false)}
                      className="block p-2 hover:bg-accent rounded-md"
                    >
                      <div className="font-semibold">{result.name || result.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {result.type.charAt(0).toUpperCase() + result.type.slice(1)} - {result.company || result.status}
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}
            {searchTerm && searchResults.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center text-muted-foreground mt-4"
              >
                No results found
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </>
  );
}