import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, IssueReport, Announcement, LeaderboardUser, IssueStatus, IssueCategory } from '../types';
import { INITIAL_REPORTS, INITIAL_ANNOUNCEMENTS, OTHER_LEADERBOARD_USERS } from '../data';

interface AppContextProps {
  currentUser: User | null;
  reports: IssueReport[];
  announcements: Announcement[];
  users: User[];
  setCurrentUser: (user: User | null) => void;
  login: (email: string, role: 'citizen' | 'admin') => User;
  register: (name: string, email: string, role: 'citizen' | 'admin') => User;
  logout: () => void;
  addReport: (reportData: { title: string; category: IssueCategory; location: string; description: string; imageUrl?: string }) => IssueReport;
  updateReportStatus: (id: string, status: IssueStatus) => void;
  addAnnouncement: (title: string, content: string) => void;
  updateAnnouncement: (id: string, title: string, content: string) => void;
  deleteAnnouncement: (id: string) => void;
  getLeaderboard: () => LeaderboardUser[];
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial states from localStorage or defaults
  const [currentUser, setLocalCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('rx_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [reports, setReports] = useState<IssueReport[]>(() => {
    const saved = localStorage.getItem('rx_reports');
    if (saved) {
      return JSON.parse(saved);
    }
    localStorage.setItem('rx_reports', JSON.stringify(INITIAL_REPORTS));
    return INITIAL_REPORTS;
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem('rx_announcements');
    if (saved) {
      return JSON.parse(saved);
    }
    localStorage.setItem('rx_announcements', JSON.stringify(INITIAL_ANNOUNCEMENTS));
    return INITIAL_ANNOUNCEMENTS;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('rx_users');
    const defaultUsers: User[] = [
      { id: 'u-1', email: 'demo@citizen.com', name: 'Demo Citizen', role: 'citizen', createdAt: new Date().toISOString() },
      { id: 'u-2', email: 'admin@resolvex.gov', name: 'City Admin', role: 'admin', createdAt: new Date().toISOString() }
    ];
    if (saved) {
      return JSON.parse(saved);
    }
    localStorage.setItem('rx_users', JSON.stringify(defaultUsers));
    return defaultUsers;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('rx_current_user', currentUser ? JSON.stringify(currentUser) : '');
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('rx_reports', JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem('rx_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('rx_users', JSON.stringify(users));
  }, [users]);

  const setCurrentUser = (user: User | null) => {
    setLocalCurrentUser(user);
  };

  const login = (email: string, role: 'citizen' | 'admin'): User => {
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      // Allow role switching for testing, or preserve existing
      const updatedUser = { ...existing, role };
      setLocalCurrentUser(updatedUser);
      return updatedUser;
    } else {
      // Auto-create Demo if it's the demo email but not found
      const name = email.toLowerCase().includes('admin') ? 'City Admin' : 'Demo Citizen';
      const newUser: User = {
        id: `u-${Date.now()}`,
        email: email.toLowerCase(),
        name,
        role,
        createdAt: new Date().toISOString()
      };
      setUsers(prev => [...prev, newUser]);
      setLocalCurrentUser(newUser);
      return newUser;
    }
  };

  const register = (name: string, email: string, role: 'citizen' | 'admin'): User => {
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      setLocalCurrentUser(existing);
      return existing;
    }
    const newUser: User = {
      id: `u-${Date.now()}`,
      email: email.toLowerCase(),
      name,
      role,
      createdAt: new Date().toISOString()
    };
    setUsers(prev => [...prev, newUser]);
    setLocalCurrentUser(newUser);
    return newUser;
  };

  const logout = () => {
    setLocalCurrentUser(null);
  };

  const addReport = (reportData: { title: string; category: IssueCategory; location: string; description: string; imageUrl?: string }) => {
    // Generate new unique RX ID
    const maxId = reports.reduce((max, r) => {
      const num = parseInt(r.id.replace('RX-', ''), 10);
      return isNaN(num) ? max : Math.max(max, num);
    }, 1045); // start after seed data high number
    
    const newId = `RX-${maxId + 1}`;
    const newReport: IssueReport = {
      id: newId,
      ...reportData,
      status: 'Submitted',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      reportedBy: currentUser ? currentUser.name : 'Anonymous Citizen',
      reportedByEmail: currentUser ? currentUser.email : 'anonymous@citizen.com'
    };

    setReports(prev => [newReport, ...prev]);
    return newReport;
  };

  const updateReportStatus = (id: string, status: IssueStatus) => {
    setReports(prev =>
      prev.map(r =>
        r.id === id
          ? { ...r, status, updatedAt: new Date().toISOString() }
          : r
      )
    );
  };

  const addAnnouncement = (title: string, content: string) => {
    const newAnn: Announcement = {
      id: `ann-${Date.now()}`,
      title,
      content,
      createdAt: new Date().toISOString()
    };
    setAnnouncements(prev => [newAnn, ...prev]);
  };

  const updateAnnouncement = (id: string, title: string, content: string) => {
    setAnnouncements(prev =>
      prev.map(a =>
        a.id === id
          ? { ...a, title, content }
          : a
      )
    );
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
  };

  // Helper to calculate impact scores dynamically
  const getLeaderboard = (): LeaderboardUser[] => {
    // Calculate stats for each user in our system who has reported issues
    const userStatsMap: Record<string, { reportsCount: number; seriousCount: number; resolvedCount: number; impactScore: number; name: string }> = {};

    // Base score calculations
    reports.forEach(report => {
      const email = report.reportedByEmail.toLowerCase();
      if (!userStatsMap[email]) {
        userStatsMap[email] = {
          reportsCount: 0,
          seriousCount: 0,
          resolvedCount: 0,
          impactScore: 0,
          name: report.reportedBy
        };
      }

      const stats = userStatsMap[email];
      stats.reportsCount += 1;

      // Category Weight: Public Safety = 5, Water Supply = 4, Roads = 3, others = 2
      let categoryWeight = 2;
      const isSerious = report.category === 'Public Safety' || report.category === 'Water Supply';
      if (report.category === 'Public Safety') categoryWeight = 5;
      else if (report.category === 'Water Supply') categoryWeight = 4;
      else if (report.category === 'Roads') categoryWeight = 3;

      if (isSerious) {
        stats.seriousCount += 1;
      }

      // Status Bonus: Resolved = +2, In Progress = +1
      let statusBonus = 0;
      if (report.status === 'Resolved') {
        statusBonus = 2;
        stats.resolvedCount += 1;
      } else if (report.status === 'In Progress') {
        statusBonus = 1;
      }

      stats.impactScore += (categoryWeight + statusBonus);
    });

    // Merge with predefined other leaderboard users to make a vibrant list
    const systemLeaderboard: LeaderboardUser[] = Object.entries(userStatsMap).map(([email, stats]) => {
      const isCurrentUser = currentUser?.email.toLowerCase() === email;
      return {
        rank: 0, // calculated later
        name: stats.name,
        email,
        reportsCount: stats.reportsCount,
        seriousCount: stats.seriousCount,
        resolvedCount: stats.resolvedCount,
        impactScore: stats.impactScore,
        isCurrentUser
      };
    });

    // If current user is not in the systemLeaderboard yet, add them with 0 scores
    if (currentUser && currentUser.role === 'citizen') {
      const curEmail = currentUser.email.toLowerCase();
      if (!systemLeaderboard.some(l => l.email === curEmail)) {
        systemLeaderboard.push({
          rank: 0,
          name: currentUser.name,
          email: curEmail,
          reportsCount: 0,
          seriousCount: 0,
          resolvedCount: 0,
          impactScore: 0,
          isCurrentUser: true
        });
      }
    }

    // Now include OTHER_LEADERBOARD_USERS that are not already present (so we don't duplicate mock data)
    OTHER_LEADERBOARD_USERS.forEach(other => {
      if (!systemLeaderboard.some(l => l.email.toLowerCase() === other.email.toLowerCase())) {
        systemLeaderboard.push({
          ...other,
          isCurrentUser: currentUser?.email.toLowerCase() === other.email.toLowerCase()
        });
      }
    });

    // Sort by impact score descending, then by reportsCount descending
    systemLeaderboard.sort((a, b) => {
      if (b.impactScore !== a.impactScore) {
        return b.impactScore - a.impactScore;
      }
      return b.reportsCount - a.reportsCount;
    });

    // Assign rank
    return systemLeaderboard.map((item, idx) => ({
      ...item,
      rank: idx + 1
    }));
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        reports,
        announcements,
        users,
        setCurrentUser,
        login,
        register,
        logout,
        addReport,
        updateReportStatus,
        addAnnouncement,
        updateAnnouncement,
        deleteAnnouncement,
        getLeaderboard
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
