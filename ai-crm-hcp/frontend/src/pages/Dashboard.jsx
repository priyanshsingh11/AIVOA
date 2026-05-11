import React, { useState } from 'react';
import { 
  Send, User, MessageSquare, ClipboardList, 
  Search, Calendar, Clock, Mic, Sparkles, 
  Plus, Smile, Meh, Frown, AlertTriangle 
} from 'lucide-react';

const Dashboard = () => {
  const [chatInput, setChatInput] = useState('');
  const [sentiment, setSentiment] = useState('Neutral');

  return (
    <div className="flex-1 flex w-full h-full bg-[#f4f7fa]">
      {/* Left Side: Log HCP Interaction Form */}
      <section className="w-[65%] overflow-y-auto p-6 space-y-6">
        <h1 className="text-2xl font-bold text-[#1a2b4b] mb-4">Log HCP Interaction</h1>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 space-y-8">
          <div className="border-b border-gray-100 pb-2">
            <h2 className="text-lg font-semibold text-[#1a2b4b]">Interaction Details</h2>
          </div>

          {/* Row 1: HCP Name & Interaction Type */}
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-500 uppercase tracking-tight">HCP Name</label>
              <div className="relative">
                <input 
                  type="text" 
                  className="w-full pl-4 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" 
                  placeholder="Search or select HCP..." 
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-500 uppercase tracking-tight">Interaction Type</label>
              <div className="relative">
                <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none cursor-pointer">
                  <option>Meeting</option>
                  <option>Virtual Call</option>
                  <option>Email</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>
          </div>

          {/* Row 2: Date & Time */}
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-500 uppercase tracking-tight">Date</label>
              <div className="relative">
                <input 
                  type="text" 
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                  placeholder="19-04-2025" 
                />
                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-500 uppercase tracking-tight">Time</label>
              <div className="relative">
                <input 
                  type="text" 
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                  placeholder="19:36" 
                />
                <Clock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Row 3: Attendees */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-500 uppercase tracking-tight">Attendees</label>
            <input 
              type="text" 
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" 
              placeholder="Enter names or search..." 
            />
          </div>

          {/* Row 4: Topics Discussed */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-500 uppercase tracking-tight">Topics Discussed</label>
            <div className="relative">
              <textarea 
                className="w-full h-24 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none" 
                placeholder="Enter key discussion points..."
              ></textarea>
              <Mic className="absolute right-4 bottom-4 w-4 h-4 text-gray-400 cursor-pointer hover:text-blue-500 transition-colors" />
            </div>
            <button className="flex items-center space-x-2 text-sm font-medium px-4 py-2 bg-blue-50 text-blue-700 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors">
              <Sparkles className="w-4 h-4" />
              <span>Summarize from Voice Note (Requires Consent)</span>
            </button>
          </div>

          {/* Row 5: Materials Shared / Samples Distributed */}
          <div className="space-y-4">
            <label className="text-sm font-bold text-gray-500 uppercase tracking-tight">Materials Shared / Samples Distributed</label>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="text-sm text-gray-400 italic">No materials added.</div>
                <button className="flex items-center space-x-2 px-3 py-1.5 bg-white border border-gray-200 rounded text-sm font-medium text-gray-600 hover:bg-gray-100">
                  <Search className="w-3.5 h-3.5" />
                  <span>Search/Add</span>
                </button>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="text-sm text-gray-400 italic">No samples added.</div>
                <button className="flex items-center space-x-2 px-3 py-1.5 bg-white border border-gray-200 rounded text-sm font-medium text-gray-600 hover:bg-gray-100">
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Sample</span>
                </button>
              </div>
            </div>
          </div>

          {/* Row 6: Sentiment */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-500 uppercase tracking-tight">Observed/Inferred HCP Sentiment</label>
            <div className="flex space-x-8">
              {[
                { name: 'Positive', icon: Smile, color: 'text-green-500' },
                { name: 'Neutral', icon: Meh, color: 'text-yellow-500' },
                { name: 'Negative', icon: Frown, color: 'text-red-500' }
              ].map((s) => (
                <label key={s.name} className="flex items-center space-x-2 cursor-pointer group">
                  <input 
                    type="radio" 
                    name="sentiment" 
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    checked={sentiment === s.name}
                    onChange={() => setSentiment(s.name)}
                  />
                  <div className="flex flex-col items-center">
                    <s.icon className={`w-5 h-5 ${sentiment === s.name ? s.color : 'text-gray-300'} group-hover:scale-110 transition-transform`} />
                    <span className={`text-xs font-medium ${sentiment === s.name ? 'text-gray-900' : 'text-gray-400'}`}>{s.name}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Row 7: Outcomes */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-500 uppercase tracking-tight">Outcomes</label>
            <textarea 
              className="w-full h-24 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none" 
              placeholder="Key outcomes or agreements..."
            ></textarea>
          </div>

          {/* Row 8: Follow-up Actions */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-500 uppercase tracking-tight">Follow-up Actions</label>
            <textarea 
              className="w-full h-24 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none" 
              placeholder="Enter next steps or tasks..."
            ></textarea>
          </div>

          {/* Row 9: AI Suggestions */}
          <div className="space-y-2 pt-4">
            <label className="text-sm font-bold text-[#1a2b4b]">AI Suggested Follow-ups:</label>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2 text-blue-600 text-sm hover:underline cursor-pointer font-medium">
                <Plus className="w-3.5 h-3.5" />
                <span>Schedule follow-up meeting in 2 weeks</span>
              </li>
              <li className="flex items-center space-x-2 text-blue-600 text-sm hover:underline cursor-pointer font-medium">
                <Plus className="w-3.5 h-3.5" />
                <span>Send OncoBoost Phase III PDF</span>
              </li>
              <li className="flex items-center space-x-2 text-blue-600 text-sm hover:underline cursor-pointer font-medium">
                <Plus className="w-3.5 h-3.5" />
                <span>Add Dr. Sharma to advisory board invite list</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Right Side: AI Assistant Chat */}
      <section className="w-[35%] flex flex-col bg-white border-l border-gray-200">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-[10px] text-white">🌐</span>
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-800">AI Assistant</h2>
              <p className="text-[10px] text-gray-400">Log interaction via chat</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex justify-start">
            <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl rounded-tl-none max-w-[90%] shadow-sm">
              <p className="text-sm text-gray-600 leading-relaxed">
                Log interaction details here (e.g., "Met Dr. Smith, discussed Product X efficacy, positive sentiment, shared brochure") or ask for help.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-[#f8f9fb]">
          <div className="flex items-center space-x-3">
            <div className="relative flex-1">
              <input 
                type="text" 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm text-sm" 
                placeholder="Describe interaction..." 
              />
            </div>
            <button className="flex items-center space-x-2 px-6 py-3 bg-[#6c7a91] text-white rounded-lg hover:bg-[#5a687d] transition-colors font-semibold text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>Log</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
