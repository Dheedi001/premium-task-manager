import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// 1. ASYNC THUNK (Mocking an API Call with Professional Data)
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (_, { getState }) => {
    // Only fetch if we don't already have tasks
    const { tasks } = getState().tasks;
    if (tasks.length > 0) return tasks; 

    // Artificial delay for presentation (like Week 6)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Professional SaaS tasks instead of Latin gibberish
    const professionalTasks = [
      { id: 101, title: "Review Q3 Marketing Strategy", completed: false },
      { id: 102, title: "Deploy Redux Architecture Update", completed: true },
      { id: 103, title: "Client Onboarding: Alpha Corp", completed: false }
    ];

    return professionalTasks.map(t => ({
      ...t,
      date: new Date().toLocaleDateString()
    }));
  }
);

// 2. THE SLICE (The Department)
const taskSlice = createSlice({
  name: 'tasks',
  // Initial state pulled from local storage to keep persistence
  initialState: {
    tasks: JSON.parse(localStorage.getItem('ultra-tasks-v7')) || [],
    isLoading: false,
    isSyncing: false,
    error: null
  },
  // SYNCHRONOUS ACTIONS (Adding, Toggling, Deleting)
  reducers: {
    addTask: (state, action) => {
      state.tasks.unshift(action.payload);
      localStorage.setItem('ultra-tasks-v7', JSON.stringify(state.tasks));
    },
    toggleTask: (state, action) => {
      const task = state.tasks.find(t => t.id === action.payload);
      if (task) {
        task.completed = !task.completed;
        localStorage.setItem('ultra-tasks-v7', JSON.stringify(state.tasks));
      }
    },
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter(t => t.id !== action.payload);
      localStorage.setItem('ultra-tasks-v7', JSON.stringify(state.tasks));
    },
    setSyncing: (state, action) => {
      state.isSyncing = action.payload;
    }
  },
  // ASYNC ACTIONS (Listening to the Thunk)
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        if(state.tasks.length === 0) state.isLoading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        // Only update if we actually fetched new data
        if(action.payload !== state.tasks) {
           state.tasks = action.payload;
           localStorage.setItem('ultra-tasks-v7', JSON.stringify(state.tasks));
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