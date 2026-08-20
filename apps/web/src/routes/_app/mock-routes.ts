export const mockRoutes = [
  {
    id: 'recommended',
    duration: 32,
    departure: '14:32',
    arrival: '15:04',
    price: 5.2,
    recommended: true,
    live: true,
    color: 'green',
    description: 'A cada 2–4 min do Consolação',
    legs: [
      {
        type: 'walk',
        duration: 5,
      },
      {
        type: 'subway',
        line: '2',
        color: '#2F6DB2',
      },
      {
        type: 'subway',
        line: '11',
        color: '#7A4CC2',
      },
      {
        type: 'walk',
        duration: 6,
      },
    ],
  },
  {
    id: 'recommended',
    duration: 10,
    departure: '14:32',
    arrival: '15:04',
    price: 5.2,
    recommended: false,
    live: true,
    color: 'green',
    description: 'A cada 2–4 min do Consolação',
    legs: [
      {
        type: 'walk',
        duration: 5,
      },
      {
        type: 'subway',
        line: '1',
        color: '#2F6DB2',
      },
    ],
  },

  {
    id: 'cptm',
    duration: 36,
    departure: '14:33',
    arrival: '15:09',
    price: 5.2,
    recommended: false,
    live: false,
    color: 'red',
    description: 'Próximo trem em 3 min da Paulista',
    legs: [
      {
        type: 'walk',
        duration: 8,
      },
      {
        type: 'train',
        line: '12',
        color: '#D92D20',
      },
      {
        type: 'walk',
        duration: 6,
      },
    ],
  },

  {
    id: 'bus',
    duration: 42,
    departure: '14:35',
    arrival: '15:17',
    price: 4.4,
    recommended: false,
    live: true,
    color: 'blue',
    description: 'Ônibus em 2 min da Av. Paulista',
    legs: [
      {
        type: 'walk',
        duration: 4,
      },
      {
        type: 'bus',
        line: '875A-10',
        color: '#2563EB',
      },
      {
        type: 'walk',
        duration: 7,
      },
    ],
  },

  {
    id: 'connections',
    duration: 48,
    departure: '14:31',
    arrival: '15:19',
    price: 5.6,
    recommended: false,
    live: false,
    color: 'purple',
    description: 'Mais conexões',
    legs: [
      {
        type: 'walk',
        duration: 6,
      },
      {
        type: 'subway',
        line: '2',
        color: '#2F6DB2',
      },
      {
        type: 'subway',
        line: '15',
        color: '#16A34A',
      },
      {
        type: 'train',
        line: '12',
        color: '#DC2626',
      },
      {
        type: 'walk',
        duration: 8,
      },
    ],
  },
] as const
