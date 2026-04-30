import React, { useState, useEffect, useRef, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTasks, addTask, toggleTask, deleteTask, setSyncing } from './taskSlice';
import { ThemeContext } from './ThemeContext';
import { Trash2, CheckCircle, Plus, LayoutDashboard, Settings, Moon, Sun, AlertCircle, CloudSync, Activity, Loader2, Search, Bell } from 'lucide-react';

export default function PremiumTodo() {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const { tasks, isLoading, isSyncing } = useSelector((state) => state.tasks);
  const dispatch = useDispatch();

  const taskInputRef = useRef(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState({ show: false, id: null });
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    if (showAddModal && taskInputRef.current) {
      setTimeout(() => taskInputRef.current.focus(), 150);
    }
  }, [showAddModal]);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleAddTask = async (e) => {
    e.preventDefault(); 
    dispatch(setSyncing(true)); 

    const formElements = new FormData(e.target);
    const taskTitle = formElements.get('title'); 

    const newTask = { 
      title: taskTitle, 
      completed: false, 
      id: Date.now(),
      date: new Date().toLocaleDateString()
    };

    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        body: JSON.stringify(newTask),
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
      });
      await response.json(); 
      
      dispatch(addTask(newTask));
      setShowAddModal(false);
    } catch (error) {
      alert("Failed to sync with server.");
    } finally {
      dispatch(setSyncing(false));
    }
  };

  const handleToggleTask = (id) => dispatch(toggleTask(id));
  
  const handleConfirmDelete = () => {
    dispatch(deleteTask(showDeleteModal.id));
    setShowDeleteModal({ show: false, id: null });
  };

  const stats = {
    total: tasks.length,
    done: tasks.filter(t => t.completed).length,
    percent: tasks.length ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0
  };

  // --- UI THEME VARIABLES (FIXED FOR TAILWIND COMPILATION) ---
  const theme = {
    bg: isDarkMode ? 'bg-[#0B0F19]' : 'bg-[#F8FAFC]',
    sidebar: isDarkMode ? 'bg-[#121826]/90 border-[#1E293B]' : 'bg-white/90 border-slate-200',
    textMain: isDarkMode ? 'text-slate-100' : 'text-slate-900',
    textMuted: isDarkMode ? 'text-slate-400' : 'text-slate-500',
    textHover: isDarkMode ? 'hover:text-slate-100' : 'hover:text-slate-900',
    card: isDarkMode ? 'bg-[#121826] border-[#1E293B] hover:border-[#3B82F6]/50' : 'bg-white border-slate-200 hover:border-[#3B82F6]/50',
    input: isDarkMode ? 'bg-[#0B0F19] border-[#1E293B] focus:border-[#3B82F6]' : 'bg-slate-50 border-slate-200 focus:border-[#3B82F6]',
    accentGrad: 'bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6]',
  };

  return (
    <div className={`flex min-h-screen w-full transition-colors duration-300 ${theme.bg} ${theme.textMain} font-sans selection:bg-[#3B82F6]/30`}>
      
      {/* SIDEBAR */}
      <aside className={`hidden md:flex flex-col w-64 border-r p-6 sticky top-0 h-screen backdrop-blur-xl transition-all ${theme.sidebar}`}>
        <div className="flex items-center gap-3 mb-10">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-lg ${theme.accentGrad}`}>
            <Activity size={18} strokeWidth={2.5} />
          </div>
          <h1 className={`text-xl font-bold tracking-tight ${theme.textMain}`}>Priority<span className="text-[#3B82F6]">.ai</span></h1>
        </div>
        
        <nav className="flex-1 space-y-1">
          <p className={`text-xs font-semibold uppercase tracking-wider mb-4 ml-2 ${theme.textMuted}`}>Views</p>
          {['All', 'Pending', 'Completed'].map((item) => (
            <button 
              key={item} 
              onClick={() => setFilter(item)} 
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                ${filter === item 
                  ? 'bg-[#3B82F6]/10 text-[#3B82F6]' 
                  : `hover:bg-slate-500/10 ${theme.textMuted} ${theme.textHover}`}`}
            >
              <LayoutDashboard size={16} /> {item}
            </button>
          ))}
        </nav>

        <div className="pt-6 space-y-4">
           <div className={`flex items-center gap-2 text-xs font-medium px-2 ${isSyncing ? 'text-amber-500 animate-pulse' : 'text-emerald-500'}`}>
             {isSyncing ? <Loader2 size={14} className="animate-spin" /> : <CloudSync size={14} />}
             {isSyncing ? 'Syncing Redux...' : 'Redux Store Synced'}
           </div>
           <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-slate-500/10 ${theme.textMuted} ${theme.textHover}`}>
             <Settings size={16} /> Workspace Settings
           </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 w-full max-w-5xl mx-auto p-6 md:p-10 lg:p-12">
        {/* TOP NAVBAR */}
        <header className="flex justify-between items-center mb-10">
          <div className={`flex items-center gap-4 px-4 py-2 rounded-full border ${theme.card} w-64`}>
            <Search size={16} className={theme.textMuted} />
            <input type="text" placeholder="Search tasks..." className={`bg-transparent outline-none text-sm w-full ${theme.textMain}`} disabled />
          </div>
          <div className="flex items-center gap-4">
            <button className={`p-2.5 rounded-full border transition-all hover:scale-105 ${theme.card} ${theme.textMuted} hover:text-[#3B82F6]`}>
              <Bell size={18} />
            </button>
            <button onClick={toggleTheme} className={`p-2.5 rounded-full border transition-all hover:scale-105 ${theme.card} ${isDarkMode ? 'text-yellow-400' : 'text-slate-600'}`}>
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </header>

        {/* HEADER */}
        <div className="mb-10">
          <h2 className={`text-4xl font-bold tracking-tight mb-2 ${theme.textMain}`}>My Tasks</h2>
          <p className={`text-sm ${theme.textMuted}`}>Redux Toolkit & Context API Architecture</p>
        </div>

        {/* PROGRESS ANALYTICS WIDGET */}
        <div className={`p-8 rounded-2xl mb-10 shadow-2xl relative overflow-hidden ${theme.accentGrad}`}>
          <div className="relative z-10 text-white flex justify-between items-center">
            <div>
              <h3 className="text-sm font-semibold mb-1 opacity-90 uppercase tracking-wider text-white">Weekly Progress</h3>
              <p className="text-3xl font-bold text-white">{stats.done} / {stats.total} Completed</p>
            </div>
            <div className="text-right text-white">
              <span className="text-5xl font-black tracking-tighter text-white">{stats.percent}%</span>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1.5 bg-black/20">
             <div className="bg-white h-full transition-all duration-1000 ease-out" style={{width: `${stats.percent}%`}}></div>
          </div>
        </div>

        {/* TASK LIST */}
        <div className="space-y-3">
          {isLoading ? (
             <div className={`flex flex-col items-center justify-center py-20 border border-dashed rounded-2xl ${theme.card}`}>
               <Loader2 size={32} className="animate-spin text-[#3B82F6] mb-4" />
               <p className={`text-sm font-medium ${theme.textMuted}`}>Connecting to Provider...</p>
             </div>
          ) : tasks.length === 0 ? (
             <div className={`flex flex-col items-center justify-center py-20 border border-dashed rounded-2xl ${theme.card}`}>
               <div className="w-12 h-12 bg-slate-500/10 rounded-full flex items-center justify-center mb-4">
                 <CheckCircle size={24} className={theme.textMuted} />
               </div>
               <p className={`text-sm font-medium ${theme.textMuted}`}>No tasks found. Start by creating a new mission.</p>
             </div>
          ) : (
            tasks.filter(t => filter === 'All' ? true : filter === 'Completed' ? t.completed : !t.completed).map(task => (
              <div key={task.id} className={`group flex items-center justify-between p-4 rounded-xl border transition-all duration-200 shadow-sm ${theme.card}`}>
                <div className="flex items-center gap-4">
                  <button onClick={() => handleToggleTask(task.id)} className={`w-5 h-5 rounded-full border-[1.5px] flex items-center justify-center transition-all duration-200 ${task.completed ? 'bg-[#3B82F6] border-[#3B82F6] text-white' : 'border-slate-400 hover:border-[#3B82F6]'}`}>
                    {task.completed && <CheckCircle size={12} strokeWidth={4} />}
                  </button>
                  <div className="flex flex-col">
                    <h4 className={`text-sm font-medium transition-all ${task.completed ? `line-through ${theme.textMuted}` : theme.textMain}`}>{task.title}</h4>
                  </div>
                </div>
                <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <span className={`text-[10px] px-2 py-1 rounded-md bg-slate-500/10 font-medium ${theme.textMuted}`}>{task.date}</span>
                  <button onClick={() => setShowDeleteModal({ show: true, id: task.id })} className="text-slate-400 hover:text-red-500 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* FAB */}
        <button 
          onClick={() => setShowAddModal(true)} 
          className={`fixed bottom-8 right-8 w-14 h-14 rounded-full shadow-[0_8px_30px_rgb(59,130,246,0.3)] flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95 z-40 ${theme.accentGrad}`}
        >
          {isSyncing ? <Loader2 size={24} className="animate-spin text-white" /> : <Plus size={24} strokeWidth={2.5} className="text-white" />}
        </button>
      </main>

      {/* --- DELETE MODAL --- */}
      {showDeleteModal.show && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[70] p-4 animate-in fade-in duration-200">
          <div className={`max-w-sm w-full p-6 rounded-2xl border shadow-2xl text-center ${theme.card} ${theme.textMain}`}>
            <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-4 mx-auto">
              <AlertCircle size={24} />
            </div>
            <h3 className={`text-lg font-bold mb-2 ${theme.textMain}`}>Delete Task?</h3>
            <p className={`text-sm mb-6 ${theme.textMuted}`}>This will permanently remove the task from your Redux store.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteModal({show: false, id: null})} className={`flex-1 py-2.5 text-sm font-medium rounded-lg border ${theme.input} ${theme.textMain} hover:bg-slate-500/10 transition-colors`}>Cancel</button>
              <button onClick={handleConfirmDelete} className="flex-1 py-2.5 text-sm font-medium rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* --- ADD MODAL --- */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center z-[70] pt-[15vh] p-4 animate-in fade-in duration-200">
          <form onSubmit={handleAddTask} className={`max-w-xl w-full p-8 rounded-2xl border shadow-2xl ${theme.card}`}>
            <h3 className={`text-2xl font-bold tracking-tight mb-6 ${theme.textMain}`}>Create Issue</h3>
            <div className="space-y-4">
              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${theme.textMuted}`}>Task Title</label>
                <input 
                  name="title"
                  ref={taskInputRef}
                  type="text" placeholder="e.g. Finalize Weekly Report..." required 
                  className={`w-full p-4 rounded-xl border outline-none transition-all text-sm shadow-inner ${theme.input} ${theme.textMain} placeholder:${theme.textMuted}`} 
                />
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <button type="button" onClick={() => setShowAddModal(false)} className={`flex-1 py-3 text-sm font-medium rounded-xl border ${theme.input} ${theme.textMain} hover:bg-slate-500/10 transition-colors`}>Cancel</button>
              <button type="submit" disabled={isSyncing} className={`flex-1 py-3 text-sm font-medium rounded-xl text-white shadow-lg transition-all hover:opacity-90 disabled:opacity-50 flex justify-center items-center gap-2 ${theme.accentGrad}`}>
                {isSyncing ? <><Loader2 size={16} className="animate-spin text-white" /> Syncing</> : 'Create Task'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}