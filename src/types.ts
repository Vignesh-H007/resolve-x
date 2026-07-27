export type UserRole = 'citizen' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
}

export type IssueCategory = 'Roads' | 'Water Supply' | 'Waste Management' | 'Street Lighting' | 'Public Safety';

export type IssueStatus = 'Submitted' | 'Under Review' | 'In Progress' | 'Resolved';

export interface IssueReport {
  id: string; // e.g. "RX-1044"
  title: string;
  category: IssueCategory;
  location: string;
  description: string;
  imageUrl?: string;
  status: IssueStatus;
  createdAt: string;
  reportedBy: string; // User email or name
  reportedByEmail: string;
  updatedAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  email: string;
  reportsCount: number;
  seriousCount: number;
  resolvedCount: number;
  impactScore: number;
  isCurrentUser?: boolean;
}
