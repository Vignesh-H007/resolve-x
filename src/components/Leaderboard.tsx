import React from 'react';
import { useApp } from '../context/AppContext';
import { Award, ShieldAlert, Zap, Heart, Info, Star, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

export const Leaderboard: React.FC = () => {
  const { getLeaderboard, currentUser } = useApp();

  const leaderboard = getLeaderboard();

  // Find current user's entry
  const currentUserEntry = leaderboard.find(l => l.isCurrentUser);
  const userRank = currentUserEntry?.rank || leaderboard.length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Heading Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Civic Leaderboard
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Recognizing citizens who keep our city safe and functional by reporting issues — especially serious ones.
          </p>
        </div>

        {/* Your Rank widget */}
        <div className="bg-slate-950 text-white px-5 py-3 rounded-xl shadow flex items-center gap-3 shrink-0 self-start md:self-auto">
          <div className="w-9 h-9 rounded-full bg-amber-500 flex items-center justify-center text-slate-950">
            <Award size={18} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Your Rank</span>
            <span className="text-base font-black">#{userRank} <span className="text-xs text-slate-400 font-medium">of {leaderboard.length}</span></span>
          </div>
        </div>
      </div>

      {/* Intro Benefit Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Safety First */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm space-y-3">
          <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
            <ShieldAlert size={18} />
          </div>
          <h3 className="font-extrabold text-slate-900 text-sm">Safety first</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Reports on Public Safety and Water Supply are weighted highest — they protect lives, prevent accidents, and stop city-wide disruption.
          </p>
        </div>

        {/* Faster Action */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm space-y-3">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Zap size={18} />
          </div>
          <h3 className="font-extrabold text-slate-900 text-sm">Faster action</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Every verified report shortens response time. Active reporters give crews the data they need to prioritize and dispatch efficiently.
          </p>
        </div>

        {/* Accountability */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm space-y-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Heart size={18} />
          </div>
          <h3 className="font-extrabold text-slate-900 text-sm">Accountability</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Tracking resolved issues per citizen creates a transparent loop between residents and authorities — building trust in public service.
          </p>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h2 className="text-sm font-bold text-slate-900">Top Contributors</h2>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Ranked by civic impact score</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3">Rank</th>
                <th className="px-6 py-3">Citizen</th>
                <th className="px-6 py-3 text-center">Reports</th>
                <th className="px-6 py-3 text-center">Serious</th>
                <th className="px-6 py-3 text-center">Resolved</th>
                <th className="px-6 py-3 text-right">Impact Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {leaderboard.map((user, idx) => {
                const isGold = user.rank === 1;
                const isSilver = user.rank === 2;
                const isBronze = user.rank === 3;
                
                return (
                  <tr 
                    key={user.email} 
                    className={`transition-colors ${user.isCurrentUser ? 'bg-blue-50/40 hover:bg-blue-50/60' : 'hover:bg-slate-50/30'}`}
                  >
                    {/* Rank */}
                    <td className="px-6 py-4">
                      {isGold ? (
                        <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold">🥇</span>
                      ) : isSilver ? (
                        <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold">🥈</span>
                      ) : isBronze ? (
                        <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-xs font-bold">🥉</span>
                      ) : (
                        <span className="text-slate-400 font-mono text-xs pl-2">{user.rank}</span>
                      )}
                    </td>

                    {/* Citizen Name & Badge */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div>
                          <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                            {user.name}
                            {user.isCurrentUser && (
                              <span className="text-[9px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-extrabold uppercase tracking-wider">You</span>
                            )}
                          </div>
                          <span className="text-xs text-slate-400 font-normal">{user.email}</span>
                        </div>
                      </div>
                    </td>

                    {/* Reports Count */}
                    <td className="px-6 py-4 text-center font-bold text-slate-800">
                      {user.reportsCount}
                    </td>

                    {/* Serious Count */}
                    <td className="px-6 py-4 text-center">
                      {user.seriousCount > 0 ? (
                        <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 text-xs px-2.5 py-0.5 rounded-full font-bold border border-rose-100">
                          <ShieldAlert size={11} /> {user.seriousCount}
                        </span>
                      ) : (
                        <span className="text-slate-300 font-mono text-xs">-</span>
                      )}
                    </td>

                    {/* Resolved Count */}
                    <td className="px-6 py-4 text-center">
                      {user.resolvedCount > 0 ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs px-2.5 py-0.5 rounded-full font-bold border border-emerald-100">
                          <CheckCircle size={11} /> {user.resolvedCount}
                        </span>
                      ) : (
                        <span className="text-slate-300 font-mono text-xs">-</span>
                      )}
                    </td>

                    {/* Impact Score */}
                    <td className="px-6 py-4 text-right font-black text-slate-900 text-base">
                      {user.impactScore}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Scoring Legend Box (as requested) */}
        <div className="bg-slate-50 border-t border-slate-100 p-4 text-[11px] text-slate-500 font-medium flex items-start gap-2">
          <Info size={14} className="text-slate-400 mt-0.5 shrink-0" />
          <div>
            <span className="font-bold text-slate-700">Scoring breakdown:</span> Public Safety <span className="font-bold text-slate-700">+5</span>, Water Supply <span className="font-bold text-slate-700">+4</span>, Roads <span className="font-bold text-slate-700">+3</span>, Waste / Street Lighting <span className="font-bold text-slate-700">+2</span> per report. Status bonus: Resolved <span className="font-bold text-slate-700">+2</span>, In Progress <span className="font-bold text-slate-700">+1</span>. <span className="italic">Serious reports are Public Safety and Water Supply.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
