import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Send, User, MessageSquare, ClipboardList, 
  Search, Calendar, Clock, Mic, Sparkles, 
  Plus, Smile, Meh, Frown, AlertTriangle, Loader2
} from 'lucide-react';
import { updateField, addMessage, setLoading, setError, resetForm } from '../redux/slices/crmSlice';
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
      const aiMessage = { role: 'assistant', content: response.data.response };
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
      <section className="w-[65%] overflow-y-auto p-6 space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-[#1a2b4b]">Log HCP Interaction</h1>
          <button 
            onClick={handleSave}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center space-x-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>Save Interaction</span>
          </button>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 space-y-8">
          <div className="border-b border-gray-100 pb-2">
            <h2 className="text-lg font-semibold text-[#1a2b4b]">Interaction Details</h2>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-500 uppercase tracking-tight">HCP Name</label>
              <input 
                type="text" 
                value={currentInteraction.hcp_name}
                onChange={(e) => handleInputChange('hcp_name', e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                placeholder="Search or select HCP..." 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-500 uppercase tracking-tight">Interaction Type</label>
              <select 
                value={currentInteraction.interaction_type}
                onChange={(e) => handleInputChange('interaction_type', e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option>Meeting</option>
                <option>Virtual Call</option>
                <option>Email</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-500 uppercase tracking-tight">Date</label>
              <div className="relative">
                <input 
                  type="date" 
                  value={currentInteraction.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-500 uppercase tracking-tight">Time</label>
              <div className="relative">
                <input 
                  type="time" 
                  value={currentInteraction.time}
                  onChange={(e) => handleInputChange('time', e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-500 uppercase tracking-tight">Attendees</label>
            <input 
              type="text" 
              value={currentInteraction.attendees}
              onChange={(e) => handleInputChange('attendees', e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" 
              placeholder="Enter names or search..." 
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-500 uppercase tracking-tight">Topics Discussed</label>
            <div className="relative">
              <textarea 
                value={currentInteraction.topics_discussed}
                onChange={(e) => handleInputChange('topics_discussed', e.target.value)}
                className="w-full h-24 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none" 
                placeholder="Enter key discussion points..."
              ></textarea>
              <Mic className="absolute right-4 bottom-4 w-4 h-4 text-gray-400 cursor-pointer" />
            </div>
            <button className="flex items-center space-x-2 text-sm font-medium px-4 py-2 bg-blue-50 text-blue-700 rounded-lg border border-blue-100">
              <Sparkles className="w-4 h-4" />
              <span>Summarize from Voice Note</span>
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-500 uppercase tracking-tight">Observed Sentiment</label>
            <div className="flex space-x-8 pt-2">
              {[
                { name: 'Positive', icon: Smile, color: 'text-green-500' },
                { name: 'Neutral', icon: Meh, color: 'text-yellow-500' },
                { name: 'Negative', icon: Frown, color: 'text-red-500' }
              ].map((s) => (
                <label key={s.name} className="flex items-center space-x-2 cursor-pointer group">
                  <input 
                    type="radio" 
                    name="sentiment" 
                    checked={currentInteraction.sentiment === s.name}
                    onChange={() => handleInputChange('sentiment', s.name)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <div className="flex flex-col items-center">
                    <s.icon className={`w-5 h-5 ${currentInteraction.sentiment === s.name ? s.color : 'text-gray-300'}`} />
                    <span className={`text-xs font-medium ${currentInteraction.sentiment === s.name ? 'text-gray-900' : 'text-gray-400'}`}>{s.name}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-500 uppercase tracking-tight">Outcomes & Next Steps</label>
            <textarea 
              value={currentInteraction.outcomes}
              onChange={(e) => handleInputChange('outcomes', e.target.value)}
              className="w-full h-24 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none" 
              placeholder="Key outcomes or agreements..."
            ></textarea>
          </div>
        </div>
      </section>

      {/* Right Side: AI Assistant Chat */}
      <section className="w-[35%] flex flex-col bg-white border-l border-gray-200">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-[10px] text-white">🌐</span>
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-800">AI Assistant</h2>
              <p className="text-[10px] text-gray-400">Powered by Groq & LangGraph</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-4 rounded-xl shadow-sm max-w-[90%] text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-br-none' 
                  : 'bg-gray-50 border border-gray-100 text-gray-700 rounded-tl-none'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl rounded-tl-none flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                <span className="text-xs text-gray-400 font-medium italic">Thinking...</span>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-[#f8f9fb]">
          <div className="flex items-center space-x-3">
            <input 
              type="text" 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm" 
              placeholder="Describe interaction..." 
            />
            <button 
              onClick={handleSendMessage}
              disabled={loading || !chatInput.trim()}
              className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
