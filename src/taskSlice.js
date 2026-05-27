import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// 1. ASYNC THUNK: Mocking the professional task fetch
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (_, { getState }) => {
    const { tasks } = getState().tasks;
    if (tasks.length > 0) return tasks; 

    // Artificial delay for presentation (Simulating network latency)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const professionalTasks = [
      { id: 101, title: "Review Q3 Marketing Strategy", completed: false, priority: "High" },
      { id: 102, title: "Deploy Redux Architecture Update", completed: true, priority: "Medium" },
      { id: 103, title: "Client Onboarding: Alpha Corp", completed: false, priority: "Low" }
    ];

    return professionalTasks.map(t => ({
      ...t,
      date: new Date().toLocaleDateString()
    }));
  }
);

// 2. THE SLICE
const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    // Persistent tasks (updated to v9)
    tasks: JSON.parse(localStorage.getItem('ultra-tasks-v9')) || [],
    
    // NEW: Career Milestones Tracking Data
    milestones: [
      { week: 1, title: "HTML/CSS Foundations", status: "Completed" },
      { week: 4, title: "React Props & Hooks", status: "Completed" },
      { week: 6, title: "Async React & Promises", status: "Completed" },
      { week: 7, title: "Redux State Management", status: "Completed" },
      { week: 8, title: "MUI & Enterprise Design", status: "In Progress" },
    ],
    
    isLoading: false,
    isSyncing: false,
    error: null
  },
  reducers: {
    addTask: (state, action) => {
      state.tasks.unshift(action.payload);
      localStorage.setItem('ultra-tasks-v9', JSON.stringify(state.tasks));
    },
    toggleTask: (state, action) => {
      const task = state.tasks.find(t => t.id === action.payload);
      if (task) {
        task.completed = !task.completed;
        localStorage.setItem('ultra-tasks-v9', JSON.stringify(state.tasks));
      }
    },
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter(t => t.id !== action.payload);
      localStorage.setItem('ultra-tasks-v9', JSON.stringify(state.tasks));
    },
    setSyncing: (state, action) => {
      state.isSyncing = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        if(state.tasks.length === 0) state.isLoading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        if(action.payload !== state.tasks) {
           state.tasks = action.payload;
           localStorage.setItem('ultra-tasks-v9', JSON.stringify(state.tasks));
        }
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  }
});

export const { addTask, toggleTask, deleteTask, setSyncing } = taskSlice.actions;
export default taskSlice.reducer;