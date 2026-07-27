import { IssueReport, Announcement, LeaderboardUser } from './types';

export const INITIAL_REPORTS: IssueReport[] = [
  {
    id: 'RX-1044',
    title: 'Overflowing garbage bin',
    category: 'Waste Management',
    location: 'Central Park East Gate',
    description: 'The garbage bin near the East Gate of Central Park is overflowing, causing a bad smell and attracting stray animals. Needs urgent clearing.',
    status: 'Submitted',
    createdAt: '2026-06-10T09:00:00.000Z',
    reportedBy: 'Demo Citizen',
    reportedByEmail: 'demo@citizen.com',
    updatedAt: '2026-06-10T09:00:00.000Z',
    imageUrl: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'RX-1043',
    title: 'Broken street light',
    category: 'Street Lighting',
    location: 'Elm Road, Sector 7',
    description: 'Street light lamp post #24 is flickering and completely shuts off after sunset. The area is pitch dark and unsafe for pedestrians.',
    status: 'Under Review',
    createdAt: '2026-06-09T18:30:00.000Z',
    reportedBy: 'Demo Citizen',
    reportedByEmail: 'demo@citizen.com',
    updatedAt: '2026-06-10T10:00:00.000Z',
    imageUrl: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'RX-1042',
    title: 'Large pothole on Main Street',
    category: 'Roads',
    location: 'Main St & 4th Ave',
    description: 'A massive pothole has formed in the middle of the intersection. Multiple cars have experienced tire damage. Needs immediate filling.',
    status: 'In Progress',
    createdAt: '2026-06-07T11:15:00.000Z',
    reportedBy: 'Demo Citizen',
    reportedByEmail: 'demo@citizen.com',
    updatedAt: '2026-06-08T14:20:00.000Z',
    imageUrl: 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'RX-1045',
    title: 'Water leakage from main pipe',
    category: 'Water Supply',
    location: 'Pine Street 142',
    description: 'Clean drinking water is gushing out from the underground main pipe connection, flooding the pavement and lowering water pressure in nearby houses.',
    status: 'Resolved',
    createdAt: '2026-06-01T08:00:00.000Z',
    reportedBy: 'Demo Citizen',
    reportedByEmail: 'demo@citizen.com',
    updatedAt: '2026-06-03T16:45:00.000Z',
    imageUrl: 'https://images.unsplash.com/photo-1508873696983-2df519f0397e?auto=format&fit=crop&w=600&q=80'
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Scheduled water maintenance',
    content: 'Water supply will be interrupted in Sectors 4-7 on Sunday from 9 AM to 2 PM for pipeline maintenance and system upgrades. Please store sufficient water in advance.',
    createdAt: '2026-06-10T00:00:00.000Z'
  },
  {
    id: 'ann-2',
    title: 'Road resurfacing program launched',
    content: 'The municipal corporation has launched a city-wide road resurfacing program. Crews will be operating during night hours to minimize traffic disruption. Expect improvements over the next 60 days.',
    createdAt: '2026-06-06T00:00:00.000Z'
  }
];

export const OTHER_LEADERBOARD_USERS: LeaderboardUser[] = [
  {
    rank: 2,
    name: 'Sarah Jenkins',
    email: 'sarah.j@example.com',
    reportsCount: 3,
    seriousCount: 2,
    resolvedCount: 2,
    impactScore: 13
  },
  {
    rank: 3,
    name: 'Michael Chen',
    email: 'mchen99@example.com',
    reportsCount: 3,
    seriousCount: 1,
    resolvedCount: 1,
    impactScore: 9
  },
  {
    rank: 4,
    name: 'Elena Rodriguez',
    email: 'elena.rod@example.com',
    reportsCount: 2,
    seriousCount: 1,
    resolvedCount: 1,
    impactScore: 7
  },
  {
    rank: 5,
    name: 'Marcus Brody',
    email: 'marcus.b@example.com',
    reportsCount: 2,
    seriousCount: 0,
    resolvedCount: 1,
    impactScore: 5
  }
];
