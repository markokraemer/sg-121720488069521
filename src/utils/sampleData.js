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

export const generateSampleData = (contactCount = 50, leadsPerContact = 2) => {
  const contacts = Array.from({ length: contactCount }, generateContact);
  
  const leads = contacts.flatMap(contact => 
    Array.from({ length: leadsPerContact }, () => generateLead(contact.id))
  );

  const groupedLeads = {
    new: leads.filter(lead => lead.status === 'new'),
    contacted: leads.filter(lead => lead.status === 'contacted'),
    qualified: leads.filter(lead => lead.status === 'qualified'),
    closed: leads.filter(lead => lead.status === 'closed'),
  };

  return { contacts, leads: groupedLeads };
};

export const resetToSampleData = (dispatch) => {
  const sampleData = generateSampleData();
  dispatch({ type: 'RESET_DATA', payload: sampleData });
};