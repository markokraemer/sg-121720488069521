import { faker } from '@faker-js/faker';

const generateContact = () => ({
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  phone: faker.phone.number(),
  company: faker.company.name(),
  address: faker.location.streetAddress(),
  socialMedia: {
    linkedin: `https://www.linkedin.com/in/${faker.internet.userName()}`,
    twitter: `https://twitter.com/${faker.internet.userName()}`,
  },
  notes: faker.lorem.paragraph(),
});

const generateLead = (contactId) => ({
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  company: faker.company.name(),
  email: faker.internet.email(),
  phone: faker.phone.number(),
  status: faker.helpers.arrayElement(['new', 'contacted', 'qualified', 'closed']),
  value: parseFloat(faker.finance.amount(1000, 100000, 2)),
  notes: faker.lorem.paragraph(),
  contactId: contactId,
});

const generateTask = () => ({
  id: faker.string.uuid(),
  title: faker.lorem.sentence(),
  description: faker.lorem.paragraph(),
  dueDate: faker.date.future(),
  priority: faker.helpers.arrayElement(['low', 'medium', 'high']),
  status: faker.helpers.arrayElement(['todo', 'in_progress', 'done']),
  associatedWith: faker.helpers.arrayElement([
    { type: 'contact', id: faker.string.uuid() },
    { type: 'lead', id: faker.string.uuid() },
    null
  ]),
});

const generateEmail = () => ({
  id: faker.string.uuid(),
  to: faker.internet.email(),
  from: faker.internet.email(),
  subject: faker.lorem.sentence(),
  body: faker.lorem.paragraphs(),
  date: faker.date.recent(),
  folder: faker.helpers.arrayElement(['inbox', 'sent', 'drafts', 'starred']),
});

export const generateSampleData = (contactCount = 50, leadsPerContact = 2, taskCount = 100, emailCount = 200) => {
  try {
    const contacts = Array.from({ length: contactCount }, generateContact);
    
    const leads = contacts.flatMap(contact => 
      Array.from({ length: leadsPerContact }, () => generateLead(contact.id))
    );

    const tasks = Array.from({ length: taskCount }, generateTask);

    const emails = Array.from({ length: emailCount }, generateEmail);

    const groupedLeads = {
      new: leads.filter(lead => lead.status === 'new'),
      contacted: leads.filter(lead => lead.status === 'contacted'),
      qualified: leads.filter(lead => lead.status === 'qualified'),
      closed: leads.filter(lead => lead.status === 'closed'),
    };

    return { contacts, leads: groupedLeads, tasks, emails };
  } catch (error) {
    console.error('Error generating sample data:', error);
    return {
      contacts: [],
      leads: { new: [], contacted: [], qualified: [], closed: [] },
      tasks: [],
      emails: [],
    };
  }
};

export const resetToSampleData = (dispatch) => {
  try {
    const sampleData = generateSampleData();
    dispatch({ type: 'RESET_DATA', payload: sampleData });
    console.log('Sample data reset successful');
  } catch (error) {
    console.error('Error resetting to sample data:', error);
    dispatch({ type: 'RESET_DATA_ERROR', payload: error.message });
  }
};