import React, { useState, useEffect } from 'react';
import { Trash2, CheckCircle, Clock, Plus, LayoutDashboard, Settings, X, Moon, Sun, AlertCircle, RotateCcw } from 'lucide-react';

export default function PremiumTodo() {
  // --- 1. STATE & PERSISTENCE ---
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('ultra-tasks-v3');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme-v3');
    return savedTheme === 'dark';
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState({ show: false, id: null });
  const [filter, setFilter] = useState('All');
  
  // Roadmap Check: "State" for form inputs
  const [formData, setFormData] = useState({ title: '', date: '', priority: 'Medium' });

  // --- 2. LIFECYCLE (useEffect) ---
  useEffect(() => {
    localStorage.setItem('ultra-tasks-v3', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('theme-v3', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // --- 3. EVENT HANDLERS ---
  const handleAddTask = (e) => {
    e.preventDefault();
    const newTask = { ...formData, id: Date.now(), completed: false };
    setTasks([newTask, ...tasks]);
    setShowAddModal(false);
    setFormData({ title: '', date: '', priority: 'Medium' });
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const stats = {
    total: tasks.length,
    done: tasks.filter(t => t.completed).length,
    percent: tasks.length ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0
  };

  return (
    // Roadmap Check: Use of "JSX" and Dynamic Classes for Theming
    <div className={`flex min-h-screen w-full transition-colors duration-500 ${isDarkMode ? 'bg-[#0f172a] text-slate-100' : 'bg-[#f8fafc] text-slate-900'}`}>
      
      {/* SIDEBAR - Responsive: Hidden on small screens, visible on md+ */}
      <aside className={`hidden md:flex flex-col w-72 border-r p-8 sticky top-0 h-screen ${isDarkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-white'}`}>
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-indigo-500/20">P</div>
          <h1 className="text-2xl font-black tracking-tighter italic">Priority.ai</h1>
        </div>
        
        <nav className="flex-1 space-y-3">
          {['All', 'Pending', 'Completed'].map((item) => (
            <button 
              key={item}
              onClick={() => setFilter(item)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all ${filter === item ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/30' : 'opacity-60 hover:opacity-100 hover:bg-indigo-50 dark:hover:bg-slate-800'}`}
            >
              <LayoutDashboard size={20} /> {item}
            </button>
          ))}
        </nav>

        <button onClick={() => setShowSettings(true)} className="flex items-center gap-4 px-5 py-4 font-bold opacity-60 hover:opacity-100 transition-all border-t border-slate-200 dark:border-slate-800 pt-6">
          <Settings size={20} /> Settings
        </button>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 w-full max-w-5xl mx-auto p-6 md:p-16">
        <header className="flex justify-between items-start mb-12">
          <div>
            <h2 className="text-5xl font-black tracking-tighter mb-3 leading-none">Focus.</h2>
            <p className={`text-lg font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              You've mastered {stats.done} out of {stats.total} goals.
            </p>
          </div>
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-4 rounded-2xl border transition-all active:scale-90 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-yellow-400' : 'bg-white border-slate-200 text-indigo-600 shadow-sm'}`}
          >
            {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </header>

        {/* PROGRESS DASHBOARD */}
        <div className={`p-10 rounded-[40px] mb-12 shadow-2xl overflow-hidden relative ${isDarkMode ? 'bg-indigo-900/30 border border-indigo-500/20' : 'bg-indigo-600 text-white'}`}>
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-6 opacity-90">Overall Completion</h3>
            <div className="flex items-end gap-6">
              <span className="text-7xl font-black tabular-nums leading-none">{stats.percent}%</span>
              <div className="flex-1 h-4 bg-black/10 dark:bg-white/10 rounded-full mb-3 overflow-hidden backdrop-blur-sm">
                 <div className="bg-white h-full transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(255,255,255,0.5)]" style={{width: `${stats.percent}%`}}></div>
              </div>
            </div>
          </div>
          {/* Decorative background circle */}
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        </div>

        {/* TASK LIST - Roadmap Check: Mapping through State */}
        <div className="grid gap-4">
          {tasks.filter(t => filter === 'All' ? true : filter === 'Completed' ? t.completed : !t.completed).map(task => (
            <div key={task.id} className={`group flex items-center justify-between p-6 rounded-[28px] border transition-all hover:scale-[1.01] ${isDarkMode ? 'bg-slate-900/80 border-slate-800 hover:border-indigo-500/50' : 'bg-white border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5'}`}>
              <div className="flex items-center gap-6">
                <button 
                  onClick={() => toggleTask(task.id)} // Roadmap: Event Handler
                  className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${task.completed ? 'bg-emerald-500 border-emerald-500 text-white rotate-[360deg]' : 'border-slate-300 dark:border-slate-700 hover:border-indigo-500'}`}
                >
                  {task.completed && <CheckCircle size={18} strokeWidth={3} />}
                </button>
                <div>
                  <h4 className={`text-xl font-bold transition-all ${task.completed ? 'opacity-30 line-through italic' : 'opacity-100'}`}>{task.title}</h4>
                  <div className="flex items-center gap-4 mt-2">
                    <span className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                      <Clock size={14}/> {task.date}
                    </span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${task.priority === 'High' ? 'bg-red-500/10 text-red-500' : 'bg-indigo-500/10 text-indigo-500'}`}>
                      {task.priority}
                    </span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setShowDeleteModal({ show: true, id: task.id })}
                className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-all md:opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={22} />
              </button>
            </div>
          ))}
          
          {tasks.length === 0 && (
            <div className="text-center py-20 opacity-30">
              <LayoutDashboard size={64} className="mx-auto mb-4" />
              <p className="text-xl font-bold">No tasks found. Start by adding one!</p>
            </div>
          )}
        </div>

        {/* FAB - Action Button */}
        <button 
          onClick={() => setShowAddModal(true)}
          className="fixed bottom-8 right-8 md:bottom-12 md:right-12 w-20 h-20 bg-indigo-600 text-white rounded-[30px] shadow-2xl shadow-indigo-500/40 flex items-center justify-center hover:scale-110 active:scale-90 transition-all z-40 group"
        >
          <Plus size={40} className="group-hover:rotate-90 transition-transform duration-300" />
        </button>
      </main>

      {/* --- SETTINGS SLIDE-OVER --- */}
      {showSettings && (
        <div className="fixed inset-0 z-[60] flex justify-end bg-slate-950/60 backdrop-blur-md transition-all">
          <div className={`w-full max-w-sm h-full p-10 shadow-2xl animate-in slide-in-from-right duration-300 ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}>
            <div className="flex justify-between items-center mb-12">
              <h3 className="text-3xl font-black tracking-tighter">Settings</h3>
              <button onClick={() => setShowSettings(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><X /></button>
            </div>
            <div className="space-y-10">
              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 block mb-4">Appearance</label>
                <button onClick={() => setIsDarkMode(!isDarkMode)} className={`w-full flex justify-between items-center p-5 rounded-2xl border-2 font-bold ${isDarkMode ? 'border-slate-800 bg-slate-950' : 'border-slate-100 bg-slate-50'}`}>
                  <span>{isDarkMode ? 'Dark Mode Active' : 'Light Mode Active'}</span>
                  {isDarkMode ? <Moon size={20} className="text-indigo-400"/> : <Sun size={20} className="text-orange-400"/>}
                </button>
              </div>
              <div className="pt-10 border-t border-slate-200 dark:border-slate-800">
                <button 
                  onClick={() => { if(confirm("Wipe all app data?")) {setTasks([]); setShowSettings(false);} }}
                  className="w-full flex items-center justify-center gap-3 p-5 rounded-2xl bg-red-500/10 text-red-500 font-bold hover:bg-red-500 hover:text-white transition-all"
                >
                  <RotateCcw size={20} /> Reset Everything
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- ROADMAP: DELETE MODAL --- */}
      {showDeleteModal.show && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl flex items-center justify-center z-[70] p-6">
          <div className={`max-w-md w-full p-10 rounded-[40px] shadow-2xl text-center ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white'}`}>
            <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-3xl flex items-center justify-center mb-8 mx-auto">
              <AlertCircle size={40} />
            </div>
            <h3 className="text-3xl font-black tracking-tighter mb-3">Delete this?</h3>
            <p className={`text-lg font-medium mb-10 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>This action is permanent and cannot be reversed.</p>
            <div className="flex gap-4">
              <button onClick={() => setShowDeleteModal({show: false, id: null})} className="flex-1 py-5 font-bold rounded-2xl border-2 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">Go Back</button>
              <button 
                onClick={() => { setTasks(tasks.filter(t => t.id !== showDeleteModal.id)); setShowDeleteModal({show: false, id: null}); }} 
                className="flex-1 py-5 font-bold rounded-2xl bg-red-600 text-white shadow-xl shadow-red-500/20 hover:bg-red-700 transition-all"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- ROADMAP: ADD TASK MODAL (FRAGMENTS USED) --- */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl flex items-center justify-center z-[70] p-6">
          <form onSubmit={handleAddTask} className={`max-w-xl w-full p-12 rounded-[40px] shadow-2xl ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
            <h3 className="text-4xl font-black tracking-tighter mb-10">New Goal.</h3>
            <div className="space-y-6">
              {/* ROADMAP: JSX + Event Handlers (onChange) */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Task Title</label>
                <input type="text" placeholder="What's the mission?" required className={`w-full p-5 rounded-2xl outline-none border-2 transition-all text-lg font-bold focus:border-indigo-500 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-100'}`} onChange={e => setFormData({...formData, title: e.target.value})}/>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Due Date</label>
                  <input type="date" required className={`w-full p-5 rounded-2xl outline-none border-2 focus:border-indigo-500 font-bold ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-100'}`} onChange={e => setFormData({...formData, date: e.target.value})}/>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Priority</label>
                  <select className={`w-full p-5 rounded-2xl border-2 font-bold focus:border-indigo-500 appearance-none ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-100'}`} onChange={e => setFormData({...formData, priority: e.target.value})}>
                    <option>Low</option><option>Medium</option><option>High</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-4 mt-12">
              <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 font-bold py-5 opacity-40 hover:opacity-100 transition-all">Cancel</button>
              <button type="submit" className="flex-1 py-5 bg-indigo-600 text-white rounded-[24px] font-bold text-lg shadow-2xl shadow-indigo-500/40 hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all">Save Goal</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}