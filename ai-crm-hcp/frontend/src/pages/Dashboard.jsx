import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Send, User, MessageSquare, ClipboardList, 
  Search, Calendar, Clock, Mic, Sparkles, 
  Plus, Smile, Meh, Frown, AlertTriangle, Loader2,
  Package, FileText
} from 'lucide-react';
import { updateField, batchUpdateFields, addMessage, setLoading, setError, resetForm } from '../redux/slices/crmSlice';
import { crmService, aiService } from '../services/api';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { currentInteraction, messages, loading } = useSelector((state) => state.crm);
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
    if (!chatInput.trim()) return;

    const userMessage = { role: 'user', content: chatInput };
    dispatch(addMessage(userMessage));
    setChatInput('');
    dispatch(setLoading(true));

    try {
      const response = await aiService.chat(chatInput, messages);
      let content = response.data.response;
      console.log('AI Response:', content);
      
      // Parse autofill data if present
      const autofillMatch = content.match(/<autofill>(.*?)<\/autofill>/s);
      if (autofillMatch) {
        try {
          const autofillData = JSON.parse(autofillMatch[1]);
          dispatch(batchUpdateFields(autofillData));
          // Clean up the message content by removing the tags
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

          <div className="space-y-2">
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
            <button className="flex items-center space-x-2 text-xs font-bold px-4 py-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-100 hover:bg-blue-100 transition-all">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SUMMARIZE FROM VOICE NOTE</span>
            </button>
          </div>

          {/* Materials & Samples Section */}
          <div className="grid grid-cols-2 gap-8 pt-4">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center space-x-1">
                <FileText className="w-3 h-3" />
                <span>Materials Shared</span>
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  value={currentInteraction.materials_shared}
                  onChange={(e) => handleInputChange('materials_shared', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition-all" 
                  placeholder="Brochures, Study results..." 
                />
                <Plus className="absolute right-3 top-3.5 w-4 h-4 text-gray-300 cursor-pointer" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center space-x-1">
                <Package className="w-3 h-3" />
                <span>Samples Distributed</span>
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  value={currentInteraction.samples_distributed}
                  onChange={(e) => handleInputChange('samples_distributed', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition-all" 
                  placeholder="Drug samples, test kits..." 
                />
                <Plus className="absolute right-3 top-3.5 w-4 h-4 text-gray-300 cursor-pointer" />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Observed Sentiment</label>
            <div className="flex space-x-12">
              {[
                { name: 'Positive', icon: Smile, color: 'text-green-500', bg: 'bg-green-50', border: 'border-green-200' },
                { name: 'Neutral', icon: Meh, color: 'text-yellow-500', bg: 'bg-yellow-50', border: 'border-yellow-200' },
                { name: 'Negative', icon: Frown, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200' }
              ].map((s) => (
                <label key={s.name} className="flex flex-col items-center space-y-2 cursor-pointer group">
                  <input 
                    type="radio" 
                    name="sentiment" 
                    checked={currentInteraction.sentiment === s.name}
                    onChange={() => handleInputChange('sentiment', s.name)}
                    className="hidden"
                  />
                  <div className={`p-3 rounded-full border-2 transition-all ${
                    currentInteraction.sentiment === s.name 
                      ? `${s.bg} ${s.border} scale-110 shadow-sm` 
                      : 'bg-gray-50 border-transparent grayscale opacity-40 hover:opacity-100 hover:grayscale-0'
                  }`}>
                    <s.icon className={`w-6 h-6 ${s.color}`} />
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${
                    currentInteraction.sentiment === s.name ? 'text-gray-900' : 'text-gray-300'
                  }`}>{s.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2 pt-4">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Outcomes & Next Steps</label>
            <textarea 
              value={currentInteraction.outcomes}
              onChange={(e) => handleInputChange('outcomes', e.target.value)}
              className="w-full h-32 px-4 py-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none resize-none transition-all" 
              placeholder="Key outcomes or agreements..."
            ></textarea>
          </div>
        </div>
      </section>

      {/* Right Side: AI Assistant Chat */}
      <section className="w-[35%] flex flex-col bg-white border-l border-gray-200 shadow-2xl">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-100">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-800">AI Assistant</h2>
              <div className="flex items-center space-x-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tighter">Connected</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-4 rounded-2xl shadow-sm max-w-[85%] text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : msg.content.includes('Done.')
                    ? 'bg-green-50 border border-green-100 text-green-800 rounded-tl-none'
                    : 'bg-gray-50 border border-gray-100 text-gray-700 rounded-tl-none'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-50 border border-gray-100 p-4 rounded-2xl rounded-tl-none flex items-center space-x-3">
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Thinking</span>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-white border-t border-gray-100">
          <div className="relative">
            <input 
              type="text" 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="w-full pl-4 pr-14 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none text-sm transition-all shadow-inner" 
              placeholder="Describe interaction..." 
            />
            <button 
              onClick={handleSendMessage}
              disabled={loading || !chatInput.trim()}
              className="absolute right-2 top-2 p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-blue-100 disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="mt-3 text-[10px] text-gray-400 text-center font-medium">
            AI can help you log, summarize, and edit interactions instantly.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
