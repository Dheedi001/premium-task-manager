import React, { useState, useEffect, useRef } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { Trash2, CheckCircle, Clock, Plus, LayoutDashboard, Settings, X, Moon, Sun, AlertCircle, CloudSync, Sparkles, Loader2 } from 'lucide-react';

export default function PremiumTodo() {
  const [tasks, setTasks] = useLocalStorage('ultra-tasks-v6', []);
  const [isDarkMode, setIsDarkMode] = useLocalStorage('theme-v6', true);
  const taskInputRef = useRef(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState({ show: false, id: null });
  const [filter, setFilter] = useState('All');
  
  // WEEK 6: UI Loading States for Asynchronous actions
  const [isSyncing, setIsSyncing] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true); // <-- Added for strict page load spinner

  useEffect(() => {
    if (showAddModal && taskInputRef.current) {
      setTimeout(() => taskInputRef.current.focus(), 150);
    }
  }, [showAddModal]);

  // WEEK 6: PROMISES, ASYNC AWAIT, & JSON (Fetching Initial Data)
  useEffect(() => {
    const fetchInitial = async () => {
      setIsPageLoading(true); // Force the loading screen on
      
      // ARTIFICIAL DELAY: Forces the spinner to show for 1.5s on every refresh
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (tasks.length === 0) {
        try {
          // fetch() returns a PROMISE. 'await' pauses execution until it resolves.
          const res = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=3');
          // JSON: Parsing the JSON string response into JavaScript objects
          const data = await res.json();
          
          const formatted = data.map(t => ({
            id: t.id, title: t.title, completed: t.completed, 
            date: new Date().toLocaleDateString()
          }));
          setTasks(formatted);
        } catch (e) { 
          console.error("Async Error:", e); 
        }
      }
      setIsPageLoading(false); // Turn the loading screen off
    };
    
    fetchInitial();
  }, []);

  // WEEK 6: FORM DATA, ASYNC AWAIT, PROMISES, & JSON (Adding a Task)
  const handleAddTask = async (e) => {
    e.preventDefault(); // Prevent page reload
    setIsSyncing(true);

    // 1. FORM DATA: Extracting values natively without needing onChange state
    const formElements = new FormData(e.target);
    const taskTitle = formElements.get('title'); // Pulls data from the input with name="title"

    const newTask = { 
      title: taskTitle, 
      completed: false, 
      id: Date.now(),
      date: new Date().toLocaleDateString()
    };

    try {
      // ARTIFICIAL DELAY: Pauses execution for 1.5 seconds to demonstrate the pending Promise state during presentation
      await new Promise(resolve => setTimeout(resolve, 1500));

      // 2. PROMISES & ASYNC AWAIT: Sending data to the server
      const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        // 3. JSON: Converting our JS object into a JSON string to send over the internet
        body: JSON.stringify(newTask),
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
      });

      // Await the Promise resolution of the server's JSON response
      await response.json(); 
      
      setTasks([newTask, ...tasks]);
      setShowAddModal(false);
    } catch (error) {
      alert("Failed to sync with server.");
    } finally {
      setIsSyncing(false);
    }
  };

  // WEEK 6: ASYNC PUT REQUEST
  const toggleTask = async (id) => {
    const task = tasks.find(t => t.id === id);
    try {
      await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ ...task, completed: !task.completed }),
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
      });
      setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    } catch (e) {
      console.error("Update failed");
    }
  };

  // WEEK 6: ASYNC DELETE REQUEST
  const confirmDelete = async () => {
    try {
      await fetch(`https://jsonplaceholder.typicode.com/posts/${showDeleteModal.id}`, { method: 'DELETE' });
      setTasks(tasks.filter(t => t.id !== showDeleteModal.id));
      setShowDeleteModal({ show: false, id: null });
    } catch (error) {
      console.error("Delete failed");
    }
  };

  const stats = {
    total: tasks.length,
    done: tasks.filter(t => t.completed).length,
    percent: tasks.length ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0
  };

  return (
    <div className={`flex min-h-screen w-full transition-colors duration-500 ${isDarkMode ? 'bg-[#020617] text-white' : 'bg-[#f8fafc] text-slate-900'} font-sans`}>
      
      {/* SIDEBAR */}
      <aside className={`hidden md:flex flex-col w-72 border-r p-8 sticky top-0 h-screen transition-all ${isDarkMode ? 'border-slate-800 bg-[#070e22]/80 backdrop-blur-xl' : 'border-slate-200 bg-white'}`}>
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
            <Sparkles size={20} />
          </div>
          <h1 className="text-2xl font-black tracking-tighter italic bg-gradient-to-r from-indigo-500 to-purple-400 bg-clip-text text-transparent">Priority.ai</h1>
        </div>
        
        <nav className="flex-1 space-y-2">
          {['All', 'Pending', 'Completed'].map((item) => (
            <button key={item} onClick={() => setFilter(item)} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all ${filter === item ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/40' : 'text-slate-500 hover:bg-indigo-50 dark:hover:bg-slate-800/50'}`}>
              <LayoutDashboard size={18} /> {item}
            </button>
          ))}
        </nav>

        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
           <div className={`flex items-center gap-2 text-[10px] font-black px-2 uppercase tracking-widest ${isSyncing ? 'text-amber-500 animate-pulse' : 'text-emerald-500'}`}>
             {isSyncing ? <Loader2 size={14} className="animate-spin" /> : <CloudSync size={14} />}
             {isSyncing ? 'Awaiting Promise...' : 'Async Ready'}
           </div>
           <button onClick={() => setShowSettings(true)} className="w-full flex items-center gap-4 px-5 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/50">
             <Settings size={18} /> Settings
           </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 w-full max-w-5xl mx-auto p-6 md:p-16">
        <header className="flex justify-between items-start mb-12">
          <div>
            {/* HIGH VISIBILITY ACHIEVE TITLE */}
            <h2 className={`text-6xl font-black tracking-tighter mb-4 leading-none italic transition-all duration-500 
              ${isDarkMode 
                ? 'bg-gradient-to-r from-white via-indigo-200 to-indigo-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]' 
                : 'text-slate-900'}`}>
              Asynchronous.
            </h2>
            <p className={`text-lg font-medium ${isDarkMode ? 'text-indigo-400' : 'text-slate-500'}`}>
              Week 6: JSON, Form Data, & Promises
            </p>
          </div>
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-4 rounded-[20px] border-2 transition-all active:scale-90 ${isDarkMode ? 'bg-slate-900 border-indigo-500 text-yellow-400 shadow-[0_0_15px_rgba(99,102,241,0.3)]' : 'bg-white border-slate-200 text-indigo-600 shadow-sm'}`}
          >
            {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </header>

        {/* PROGRESS DASHBOARD */}
        <div className={`p-10 rounded-[40px] mb-12 shadow-2xl relative overflow-hidden transition-all ${isDarkMode ? 'bg-gradient-to-br from-indigo-600 to-purple-700 shadow-indigo-500/20' : 'bg-indigo-600'}`}>
          <div className="relative z-10 text-white">
            <h3 className="text-xl font-bold mb-6 opacity-80">Workspace Completion</h3>
            <div className="flex items-end gap-8">
              <span className="text-8xl font-black tabular-nums leading-none tracking-tighter">{stats.percent}%</span>
              <div className="flex-1 h-5 bg-black/20 rounded-full mb-4 overflow-hidden backdrop-blur-md">
                 <div className="bg-white h-full transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(255,255,255,0.8)]" style={{width: `${stats.percent}%`}}></div>
              </div>
            </div>
          </div>
        </div>

        {/* TASK LIST */}
        <div className="grid gap-5">
          {isPageLoading ? (
             <div className="text-center py-20 font-bold opacity-50 text-2xl tracking-widest uppercase flex flex-col items-center gap-4">
               <Loader2 size={40} className="animate-spin text-indigo-500" />
               Awaiting Promise Resolution...
             </div>
          ) : (
            tasks.filter(t => filter === 'All' ? true : filter === 'Completed' ? t.completed : !t.completed).map(task => (
              <div key={task.id} className={`group flex items-center justify-between p-7 rounded-[32px] border-2 transition-all hover:scale-[1.02] ${isDarkMode ? 'bg-[#0f172a] border-slate-800 hover:border-indigo-500' : 'bg-white border-slate-100 shadow-sm'}`}>
                <div className="flex items-center gap-6">
                  <button onClick={() => toggleTask(task.id)} className={`w-9 h-9 rounded-2xl border-2 flex items-center justify-center transition-all ${task.completed ? 'bg-emerald-500 border-emerald-500 text-white rotate-[360deg]' : 'border-slate-500'}`}>
                    {task.completed && <CheckCircle size={20} strokeWidth={3} />}
                  </button>
                  <div>
                    <h4 className={`text-2xl font-bold transition-all ${task.completed ? 'opacity-30 line-through italic' : 'text-inherit'}`}>{task.title}</h4>
                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isDarkMode ? 'text-indigo-400' : 'text-slate-400'}`}>System Log • {task.date}</span>
                  </div>
                </div>
                <button onClick={() => setShowDeleteModal({ show: true, id: task.id })} className="p-3 text-red-400 hover:text-red-500 transition-all opacity-100 md:opacity-0 group-hover:opacity-100">
                  <Trash2 size={24} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* FAB */}
        <button 
          onClick={() => setShowAddModal(true)} 
          className="fixed bottom-10 right-10 w-20 h-20 bg-indigo-600 text-white rounded-[32px] shadow-2xl flex items-center justify-center hover:scale-110 active:scale-90 transition-all z-40 shadow-indigo-500/40"
        >
          {isSyncing ? <Loader2 size={40} className="animate-spin" /> : <Plus size={44} strokeWidth={3} />}
        </button>
      </main>

      {/* --- DELETE MODAL --- */}
      {showDeleteModal.show && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center z-[70] p-6">
          <div className={`max-w-md w-full p-12 rounded-[48px] shadow-2xl text-center border-2 ${isDarkMode ? 'bg-[#0f172a] border-slate-800' : 'bg-white'}`}>
            <div className="w-24 h-24 bg-red-500/10 text-red-500 rounded-[32px] flex items-center justify-center mb-10 mx-auto">
              <AlertCircle size={48} />
            </div>
            <h3 className="text-3xl font-black mb-4">Confirm Deletion</h3>
            <p className="opacity-50 text-lg mb-12">This action will permanently remove this resource from your local workspace.</p>
            <div className="flex gap-4">
              <button onClick={() => setShowDeleteModal({show: false, id: null})} className="flex-1 py-5 font-bold rounded-2xl border-2">Cancel</button>
              <button 
                onClick={confirmDelete} 
                className="flex-1 py-5 font-bold rounded-2xl bg-red-600 text-white shadow-xl shadow-red-500/20"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- ADD MODAL --- */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center z-[70] p-6">
          <form onSubmit={handleAddTask} className={`max-w-2xl w-full p-12 rounded-[48px] shadow-2xl border-2 ${isDarkMode ? 'bg-[#0f172a] border-slate-800' : 'bg-white'}`}>
            <h3 className="text-5xl font-black tracking-tighter mb-12">New Mission.</h3>
            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 ml-2">Objective Title (Form Data)</label>
                {/* WEEK 6: Added name="title" so FormData can extract it */}
                <input 
                  name="title"
                  ref={taskInputRef}
                  type="text" placeholder="Specify your next goal..." required 
                  className={`w-full p-7 rounded-[28px] outline-none border-2 transition-all text-xl font-bold focus:border-indigo-600 ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white placeholder:text-slate-600' : 'bg-slate-50 border-slate-100'}`} 
                />
              </div>
            </div>
            <div className="flex gap-6 mt-12">
              <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 font-bold py-6 opacity-40 hover:opacity-100">Dismiss</button>
              <button type="submit" disabled={isSyncing} className="flex-1 py-6 bg-indigo-600 text-white rounded-[28px] font-black text-xl shadow-2xl shadow-indigo-500/40 hover:scale-105 transition-all disabled:opacity-50">
                {isSyncing ? 'Pushing Data...' : 'Launch Task'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}