import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';

// Dummy data for leads
const initialLeads = {
  new: [
    { id: 'lead1', content: 'John Doe - Interested in Product A' },
    { id: 'lead2', content: 'Jane Smith - Requested Demo' },
  ],
  contacted: [
    { id: 'lead3', content: 'Bob Johnson - Follow-up Call Scheduled' },
  ],
  qualified: [
    { id: 'lead4', content: 'Alice Brown - Proposal Sent' },
  ],
  closed: [
    { id: 'lead5', content: 'Charlie Davis - Deal Closed' },
  ],
};

const LeadCard = ({ lead, index }) => (
  <Draggable draggableId={lead.id} index={index}>
    {(provided) => (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        className="bg-white p-4 mb-2 rounded shadow"
      >
        {lead.content}
      </div>
    )}
  </Draggable>
);

const LeadColumn = ({ title, leads, id }) => (
  <Card className="w-64">
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <Droppable droppableId={id}>
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {leads.map((lead, index) => (
              <LeadCard key={lead.id} lead={lead} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </CardContent>
  </Card>
);

export default function Leads() {
  const [leads, setLeads] = React.useState(initialLeads);

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceColumn = leads[source.droppableId];
    const destColumn = leads[destination.droppableId];
    const [removed] = sourceColumn.splice(source.index, 1);
    destColumn.splice(destination.index, 0, removed);

    setLeads({
      ...leads,
      [source.droppableId]: sourceColumn,
      [destination.droppableId]: destColumn,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Leads</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Lead
        </Button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex space-x-4 overflow-x-auto pb-4">
          <LeadColumn title="New" leads={leads.new} id="new" />
          <LeadColumn title="Contacted" leads={leads.contacted} id="contacted" />
          <LeadColumn title="Qualified" leads={leads.qualified} id="qualified" />
          <LeadColumn title="Closed" leads={leads.closed} id="closed" />
        </div>
      </DragDropContext>
    </div>
  );
}