import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Send, User, MessageSquare, ClipboardList, 
  Search, Calendar, Clock, Mic, Sparkles, 
  Plus, Smile, Meh, Frown, AlertTriangle, Loader2,
  Package, FileText, ChevronRight, Play
} from 'lucide-react';
import { updateField, batchUpdateFields, setSuggestions, addMessage, setLoading, setError, resetForm } from '../redux/slices/crmSlice';
import { crmService, aiService } from '../services/api';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { currentInteraction, messages, loading, suggestedFollowUps } = useSelector((state) => state.crm);
  const [chatInput, setChatInput] = useState('');

  const handleInputChange = (field, value) => {
    dispatch(updateField({ field, value }));
  };

  const handleSave = async () => {
    dispatch(setLoading(true));
    try {
      await crmService.saveInteraction(currentInteraction);
      alert('Interaction saved successfully!');
      dispatch(resetForm());
    } catch (err) {
      dispatch(setError(err.message));
      alert('Error saving interaction: ' + err.message);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || loading) return;

    const userMessage = { role: 'user', content: chatInput };
    dispatch(addMessage(userMessage));
    setChatInput('');
    dispatch(setLoading(true));

    try {
      const response = await aiService.chat(chatInput, messages);
      let content = response.data.response;
      
      // Parse autofill data if present
      const autofillMatch = content.match(/<autofill>(.*?)<\/autofill>/s);
      if (autofillMatch) {
        try {
          const autofillData = JSON.parse(autofillMatch[1]);
          dispatch(batchUpdateFields(autofillData));
          
          if (autofillData.suggested_follow_ups) {
            dispatch(setSuggestions(autofillData.suggested_follow_ups));
          }

          content = content.replace(/<autofill>.*?<\/autofill>/s, '').trim();
        } catch (e) {
          console.error('Failed to parse autofill JSON:', e);
        }
      }

      const aiMessage = { role: 'assistant', content: content };
      dispatch(addMessage(aiMessage));
    } catch (err) {
      console.error('Chat error:', err);
      dispatch(addMessage({ role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="flex-1 flex w-full h-full bg-[#f4f7fa]">
      {/* Left Side: Log HCP Interaction Form */}
      <section className="w-[65%] overflow-y-auto p-6 space-y-6 scrollbar-hide">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-[#1a2b4b]">Log HCP Interaction</h1>
          <button 
            onClick={handleSave}
            disabled={loading}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-200 disabled:opacity-50 flex items-center space-x-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>Save Interaction</span>
          </button>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 space-y-8">
          <div className="border-b border-gray-100 pb-3 flex items-center space-x-2">
            <ClipboardList className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-[#1a2b4b]">Interaction Details</h2>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">HCP Name</label>
              <div className="relative group">
                <input 
                  type="text" 
                  value={currentInteraction.hcp_name}
                  onChange={(e) => handleInputChange('hcp_name', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition-all" 
                  placeholder="Search or select HCP..." 
                />
                <Search className="absolute right-3 top-3.5 w-4 h-4 text-gray-300" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Interaction Type</label>
              <select 
                value={currentInteraction.interaction_type}
                onChange={(e) => handleInputChange('interaction_type', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none appearance-none transition-all"
              >
                <option>Meeting</option>
                <option>Virtual Call</option>
                <option>Email</option>
                <option>Lunch & Learn</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Date</label>
              <div className="relative">
                <input 
                  type="date" 
                  value={currentInteraction.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition-all" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Time</label>
              <div className="relative">
                <input 
                  type="time" 
                  value={currentInteraction.time}
                  onChange={(e) => handleInputChange('time', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition-all" 
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Attendees</label>
            <div className="relative group">
              <input 
                type="text" 
                value={currentInteraction.attendees}
                onChange={(e) => handleInputChange('attendees', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition-all" 
                placeholder="Enter names or search..." 
              />
              <User className="absolute right-3 top-3.5 w-4 h-4 text-gray-300" />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Topics Discussed</label>
            <div className="relative">
              <textarea 
                value={currentInteraction.topics_discussed}
                onChange={(e) => handleInputChange('topics_discussed', e.target.value)}
                className="w-full h-32 px-4 py-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none resize-none transition-all" 
                placeholder="Enter key discussion points..."
              ></textarea>
              <Mic className="absolute right-4 bottom-4 w-5 h-5 text-gray-400 hover:text-blue-600 cursor-pointer transition-colors" />
            </div>
            <button className="flex items-center space-x-2 text-xs font-bold px-4 py-2.5 bg-gray-50 text-gray-600 rounded-lg border border-gray-200 hover:bg-gray-100 transition-all uppercase tracking-tight">
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              <span>Summarize from Voice Note (Requires Consent)</span>
            </button>
          </div>

          {/* Materials & Samples Section */}
          <div className="space-y-4 pt-4 border-t border-gray-50">
            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Materials Shared / Samples Distributed</h3>
            
            <div className="space-y-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600">Materials Shared</label>
                  <p className="text-[10px] text-gray-400 italic">No materials added.</p>
                </div>
                <button className="flex items-center space-x-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-[10px] font-bold text-gray-600 hover:bg-gray-50 transition-all shadow-sm">
                  <Search className="w-3 h-3" />
                  <span>Search/Add</span>
                </button>
              </div>

              <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600">Samples Distributed</label>
                  <p className="text-[10px] text-gray-400 italic">No samples added.</p>
                </div>
                <button className="flex items-center space-x-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-[10px] font-bold text-gray-600 hover:bg-gray-50 transition-all shadow-sm">
                  <Plus className="w-3 h-3" />
                  <span>Add Sample</span>
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Observed/Inferred HCP Sentiment</label>
            <div className="flex space-x-12">
              {[
                { name: 'Positive', icon: Smile, color: 'text-green-500', emoji: '😊' },
                { name: 'Neutral', icon: Meh, color: 'text-yellow-500', emoji: '😐' },
                { name: 'Negative', icon: Frown, color: 'text-red-500', emoji: '☹️' }
              ].map((s) => (
                <label key={s.name} className="flex items-center space-x-3 cursor-pointer group">
                  <input 
                    type="radio" 
                    name="sentiment" 
                    checked={currentInteraction.sentiment === s.name}
                    onChange={() => handleInputChange('sentiment', s.name)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <div className="flex flex-col items-start">
                    <div className="flex items-center space-x-1">
                       <span className="text-sm">{s.emoji}</span>
                       <span className={`text-[10px] font-bold uppercase tracking-widest ${
                         currentInteraction.sentiment === s.name ? 'text-gray-900' : 'text-gray-400'
                       }`}>{s.name}</span>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2 pt-4">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Outcomes</label>
            <textarea 
              value={currentInteraction.outcomes}
              onChange={(e) => handleInputChange('outcomes', e.target.value)}
              className="w-full h-24 px-4 py-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none resize-none transition-all" 
              placeholder="Key outcomes or agreements..."
            ></textarea>
          </div>

          <div className="space-y-2 pt-4">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Follow-up Actions</label>
            <textarea 
              value={currentInteraction.follow_up}
              onChange={(e) => handleInputChange('follow_up', e.target.value)}
              className="w-full h-24 px-4 py-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none resize-none transition-all" 
              placeholder="Enter next steps or tasks..."
            ></textarea>
          </div>

          {/* AI Suggested Follow-ups */}
          <div className="space-y-3 pt-6 border-t border-gray-50">
            <h4 className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">AI Suggested Follow-ups:</h4>
            <div className="space-y-2">
              {suggestedFollowUps.map((suggestion, idx) => (
                <div key={idx} className="flex items-center space-x-2 text-blue-500 hover:text-blue-700 cursor-pointer transition-colors group">
                  <span className="text-xs font-medium tracking-tight underline underline-offset-4 decoration-blue-200 group-hover:decoration-blue-500">
                    {suggestion}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Right Side: AI Assistant Chat */}
      <section className="w-[35%] flex flex-col bg-[#f8f9fb] border-l border-gray-200">
        <div className="p-6 border-b border-gray-100 flex items-center space-x-3 bg-white">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-100">
            <MessageSquare className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wider">AI Assistant</h2>
            <p className="text-[10px] text-gray-400 font-medium">Log interaction via chat</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-[12px] leading-relaxed text-gray-600 italic">
            Log interaction details here (e.g., "Met Dr. Smith, discussed Product X efficacy, positive sentiment, shared brochure") or ask for help.
          </div>

          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-4 rounded-2xl shadow-sm max-w-[85%] text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-white border border-gray-100 text-gray-700 rounded-tl-none'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start animate-pulse">
               <div className="w-12 h-6 bg-gray-200 rounded-full"></div>
            </div>
          )}
        </div>

        <div className="p-6 bg-white border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <input 
              type="text" 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none text-sm transition-all" 
              placeholder="Describe interaction..." 
            />
            <button 
              onClick={handleSendMessage}
              disabled={loading || !chatInput.trim()}
              className="px-4 py-3 bg-[#636e72] text-white rounded-lg hover:bg-gray-700 transition-all flex items-center space-x-2 shadow-md disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span className="text-xs font-bold uppercase tracking-widest">Log</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
