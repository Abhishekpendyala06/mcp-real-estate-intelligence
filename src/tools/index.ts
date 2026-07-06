import { Tool } from '@modelcontextprotocol/sdk/types.js';

export function registerTools(): Tool[] {
  return [
    {
      name: 'property_search',
      description: 'Search for properties with advanced filtering',
      inputSchema: {
        type: 'object' as const,
        properties: {
          location: { type: 'string', description: 'Address or location' },
          priceMin: { type: 'number', description: 'Minimum price' },
          priceMax: { type: 'number', description: 'Maximum price' },
          bedrooms: { type: 'number', description: 'Number of bedrooms' },
        },
        required: ['location'],
      },
    },
    {
      name: 'market_analysis',
      description: 'Analyze market trends and forecasts',
      inputSchema: {
        type: 'object' as const,
        properties: {
          region: { type: 'string', description: 'Region to analyze' },
          period: { type: 'string', description: 'Time period' },
        },
        required: ['region'],
      },
    },
    {
      name: 'property_valuation',
      description: 'Get AI-powered property valuation',
      inputSchema: {
        type: 'object' as const,
        properties: {
          address: { type: 'string', description: 'Property address' },
        },
        required: ['address'],
      },
    },
    {
      name: 'investment_analysis',
      description: 'Analyze investment potential and ROI',
      inputSchema: {
        type: 'object' as const,
        properties: {
          propertyId: { type: 'string' },
          purchasePrice: { type: 'number' },
          rentalIncome: { type: 'number' },
        },
        required: ['propertyId', 'purchasePrice'],
      },
    },
    {
      name: 'neighborhood_analysis',
      description: 'Get comprehensive neighborhood data',
      inputSchema: {
        type: 'object' as const,
        properties: {
          location: { type: 'string', description: 'Location' },
        },
        required: ['location'],
      },
    },
    {
      name: 'mortgage_calculator',
      description: 'Calculate mortgage payments',
      inputSchema: {
        type: 'object' as const,
        properties: {
          purchasePrice: { type: 'number' },
          downPayment: { type: 'number' },
          interestRate: { type: 'number' },
        },
        required: ['purchasePrice', 'downPayment', 'interestRate'],
      },
    },
  ];
}
