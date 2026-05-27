import React, { useState, useEffect, useRef, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTasks, addTask, toggleTask, deleteTask, setSyncing } from './taskSlice';
import { ThemeContext } from './ThemeContext';
import { Trash2, CheckCircle, Plus, LayoutDashboard, Settings, Palette, AlertCircle, CloudSync, Activity, Loader2, Search, Bell, Award } from 'lucide-react';

// MUI IMPORTS
import { 
  Snackbar, 
  Alert, 
  TextField, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Select, 
  createTheme, 
  ThemeProvider as MUIThemeProvider 
} from '@mui/material';

export default function PremiumTodo() {
  const { theme: currentTheme, isDarkMode, toggleTheme } = useContext(ThemeContext);
  const { tasks, milestones, isLoading, isSyncing } = useSelector((state) => state.tasks);
  const dispatch = useDispatch();

  const taskInputRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState({ show: false, id: null });
  const [filter, setFilter] = useState('All');

  // MUI SNACKBAR STATE
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  // --- THEME CONFIGURATION OBJECT ---
  const themes = {
    midnight: { 
      bg: 'bg-[#0B0F19]', 
      card: 'bg-[#121826] border-[#1E293B] hover:border-blue-500/50', 
      sidebar: 'bg-[#121826]/90 border-[#1E293B]',
      textMain: 'text-slate-100', 
      textMuted: 'text-slate-400',
      accent: 'from-blue-600 to-violet-700',
      muiMode: 'dark'
    },
    slate: { 
      bg: 'bg-[#F8FAFC]', 
      card: 'bg-white border-slate-200 hover:border-blue-500/50', 
      sidebar: 'bg-white/90 border-slate-200',
      textMain: 'text-slate-900', 
      textMuted: 'text-slate-500',
      accent: 'from-slate-700 to-slate-900',
      muiMode: 'light'
    },
    emerald: { 
      bg: 'bg-[#022c22]', 
      card: 'bg-[#064e3b] border-[#065f46] hover:border-emerald-400/50', 
      sidebar: 'bg-[#064e3b]/90 border-[#065f46]',
      textMain: 'text-emerald-50', 
      textMuted: 'text-emerald-400/60',
      accent: 'from-emerald-500 to-teal-700',
      muiMode: 'dark'
    }
  };

  const active = themes[currentTheme];

  const muiTheme = createTheme({
    palette: {
      mode: active.muiMode,
      primary: { main: currentTheme === 'emerald' ? '#10b981' : '#3B82F6' },
    },
    typography: { fontFamily: 'Inter, sans-serif' }
  });

  useEffect(() => {
    if (showAddModal && taskInputRef.current) {
      setTimeout(() => taskInputRef.current.focus(), 150);
    }
  }, [showAddModal]);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  // --- SEARCH & FILTER LOGIC ---
  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'All' ? true : filter === 'Completed' ? t.completed : !t.completed;
    return matchesSearch && matchesFilter;
  });

  const handleAddTask = async (e) => {
    e.preventDefault(); 
    dispatch(setSyncing(true)); 

    const formData = new FormData(e.currentTarget);
    const newTask = { 
      title: formData.get('title'), 
      priority: formData.get('priority') || 'Medium', 
      completed: false, 
      id: Date.now(),
      date: new Date().toLocaleDateString()
    };

    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        body: JSON.stringify(newTask),
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
      });
      await response.json(); 
      
      dispatch(addTask(newTask));
      setShowAddModal(false);
      setSnackbar({ open: true, message: 'Resource Synced Globally', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Cloud Sync Failed', severity: 'error' });
    } finally {
      dispatch(setSyncing(false));
    }
  };

  const handleConfirmDelete = () => {
    dispatch(deleteTask(showDeleteModal.id));
    setShowDeleteModal({ show: false, id: null });
    setSnackbar({ open: true, message: 'Data Purged from Store', severity: 'info' });
  };

  const stats = {
    total: tasks.length,
    done: tasks.filter(t => t.completed).length,
    percent: tasks.length ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0
  };

  return (
    <MUIThemeProvider theme={muiTheme}>
    <div className={`flex min-h-screen w-full transition-all duration-500 ${active.bg} ${active.textMain} font-sans`}>
      
      {/* SIDEBAR */}
      <aside className={`hidden md:flex flex-col w-64 border-r p-6 sticky top-0 h-screen backdrop-blur-xl transition-all ${active.sidebar}`}>
        <div className="flex items-center gap-3 mb-10">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-lg bg-gradient-to-br ${active.accent}`}>
            <Activity size={18} strokeWidth={2.5} />
          </div>
          <h1 className="text-xl font-bold tracking-tight">Priority<span className="text-blue-500">.ai</span></h1>
        </div>
        
        <nav className="flex-1 space-y-1">
          <p className={`text-[10px] font-bold uppercase tracking-widest mb-4 ml-2 opacity-40`}>Workspace</p>
          {['All', 'Pending', 'Completed'].map((item) => (
            <button 
              key={item} 
              onClick={() => setFilter(item)} 
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                ${filter === item 
                  ? 'bg-blue-500/10 text-blue-500' 
                  : `hover:bg-slate-500/10 ${active.textMuted} hover:${active.textMain}`}`}
            >
              <LayoutDashboard size={16} /> {item}
            </button>
          ))}

          {/* MULTI-THEME SELECTOR */}
          <div className="pt-8 space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-widest ml-2 opacity-40">Appearance</p>
            <div className="flex gap-3 px-2">
              <button onClick={() => toggleTheme('midnight')} className={`w-6 h-6 rounded-full bg-[#0B0F19] border-2 ${currentTheme === 'midnight' ? 'border-blue-500' : 'border-transparent'}`} title="Midnight"></button>
              <button onClick={() => toggleTheme('slate')} className={`w-6 h-6 rounded-full bg-slate-200 border-2 ${currentTheme === 'slate' ? 'border-blue-500' : 'border-transparent'}`} title="Slate"></button>
              <button onClick={() => toggleTheme('emerald')} className={`w-6 h-6 rounded-full bg-[#022c22] border-2 ${currentTheme === 'emerald' ? 'border-emerald-400' : 'border-transparent'}`} title="Emerald"></button>
            </div>
          </div>
        </nav>

        {/* CAREER MILESTONES SECTION */}
        <div className="pt-6 border-t border-white/10 space-y-4">
          <p className="text-[10px] font-bold uppercase tracking-widest ml-2 opacity-40">Curriculum Path</p>
          <div className="space-y-3 px-2 max-h-48 overflow-y-auto custom-scrollbar">
            {milestones?.map((m) => (
              <div key={m.week} className="flex items-start gap-3">
                <Award size={14} className={m.status === 'Completed' ? 'text-blue-500' : 'text-slate-500'} />
                <div className="text-[11px]">
                  <p className="font-bold leading-none mb-1">Week {m.week}</p>
                  <p className={`${active.textMuted} leading-tight`}>{m.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 w-full max-w-5xl mx-auto p-6 md:p-10">
        <header className="flex justify-between items-center mb-10">
          <div className={`flex items-center gap-4 px-4 py-2 rounded-xl border shadow-inner ${active.card} w-full max-w-md`}>
            <Search size={16} className={active.textMuted} />
            <input 
              type="text" 
              placeholder="Search missions..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`bg-transparent outline-none text-sm w-full ${active.textMain}`} 
            />
          </div>
          <div className="flex items-center gap-4">
             <div className="flex flex-col items-end mr-2">
                <span className="text-xs font-bold">Destiny E.</span>
                <span className="text-[10px] opacity-50">Software Intern</span>
             </div>
             <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${active.accent} flex items-center justify-center font-black text-white shadow-lg`}>
               DE
             </div>
          </div>
        </header>

        {/* PROGRESS ANALYTICS */}
        <div className={`p-8 rounded-3xl mb-10 shadow-2xl relative overflow-hidden bg-gradient-to-br ${active.accent}`}>
          <div className="relative z-10 text-white flex justify-between items-end">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest opacity-80 mb-2">Sprint Completion</h3>
              <p className="text-4xl font-black">{stats.percent}% Resolved</p>
            </div>
            <div className={`px-4 py-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold`}>
              {stats.done} / {stats.total} Tasks
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1.5 bg-black/20">
             <div className="bg-white h-full transition-all duration-1000" style={{width: `${stats.percent}%`}}></div>
          </div>
        </div>

        {/* TASK LIST */}
        <div className="space-y-3">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <CloudSync size={20} className="text-blue-500" />
              Active Store
            </h3>
            <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest">{filteredTasks.length} Result(s)</span>
          </div>

          {isLoading ? (
             <div className={`flex flex-col items-center justify-center py-20 border border-dashed rounded-2xl ${active.card}`}>
               <Loader2 size={32} className="animate-spin text-blue-500 mb-4" />
               <p className={`text-sm font-medium ${active.textMuted}`}>Awaiting Provider...</p>
             </div>
          ) : filteredTasks.length === 0 ? (
             <div className={`flex flex-col items-center justify-center py-20 border border-dashed rounded-2xl ${active.card}`}>
               <p className={`text-sm font-medium ${active.textMuted}`}>No resources match your search.</p>
             </div>
          ) : (
            filteredTasks.map(task => (
              <div key={task.id} className={`group flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${active.card}`}>
                <div className="flex items-center gap-4">
                  <button onClick={() => dispatch(toggleTask(task.id))} className={`w-5 h-5 rounded-full border-[1.5px] flex items-center justify-center transition-all ${task.completed ? 'bg-blue-500 border-blue-500 text-white' : 'border-slate-400'}`}>
                    {task.completed && <CheckCircle size={12} strokeWidth={4} />}
                  </button>
                  <h4 className={`text-sm font-medium transition-all ${task.completed ? `line-through ${active.textMuted}` : active.textMain}`}>{task.title}</h4>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-widest 
                    ${task.priority === 'High' ? 'bg-red-500/20 text-red-500' : 
                      task.priority === 'Medium' ? 'bg-amber-500/20 text-amber-500' : 
                      'bg-emerald-500/20 text-emerald-500'}`}>
                    {task.priority}
                  </span>
                  <button onClick={() => setShowDeleteModal({ show: true, id: task.id })} className="text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
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
          className={`fixed bottom-8 right-8 w-14 h-14 rounded-2xl shadow-2xl flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95 z-40 bg-gradient-to-br ${active.accent}`}
        >
          {isSyncing ? <Loader2 size={24} className="animate-spin" /> : <Plus size={28} strokeWidth={3} />}
        </button>
      </main>

      {/* --- ADD MODAL --- */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <form onSubmit={handleAddTask} className={`max-w-md w-full p-8 rounded-3xl border shadow-2xl ${active.card}`}>
            <h3 className="text-2xl font-bold mb-8">New Mission</h3>
            <div className="space-y-6">
              <TextField fullWidth label="Objective Title" name="title" variant="outlined" required inputRef={taskInputRef} />
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select name="priority" label="Priority" defaultValue="Medium">
                  <MenuItem value="High">High Priority</MenuItem>
                  <MenuItem value="Medium">Medium Priority</MenuItem>
                  <MenuItem value="Low">Low Priority</MenuItem>
                </Select>
              </FormControl>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className={`flex-1 py-3 font-bold opacity-50`}>Dismiss</button>
                <button type="submit" className={`flex-1 py-3 rounded-xl text-white font-bold shadow-lg bg-gradient-to-r ${active.accent}`}>Deploy</button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* --- DELETE MODAL --- */}
      {showDeleteModal.show && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className={`max-w-xs w-full p-6 rounded-2xl border shadow-2xl text-center ${active.card}`}>
            <AlertCircle size={32} className="text-red-500 mx-auto mb-4" />
            <h3 className="font-bold mb-2">Purge Data?</h3>
            <p className={`text-xs mb-6 ${active.textMuted}`}>This resource will be permanently removed.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteModal({show: false, id: null})} className={`flex-1 py-2 text-xs font-bold rounded-lg border border-slate-500/20`}>Cancel</button>
              <button onClick={handleConfirmDelete} className="flex-1 py-2 text-xs font-bold rounded-lg bg-red-600 text-white">Delete</button>
            </div>
          </div>
        </div>
      )}

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert severity={snackbar.severity} variant="filled">{snackbar.message}</Alert>
      </Snackbar>

    </div>
    </MUIThemeProvider>
  );
}