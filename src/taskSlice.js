import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// 1. ASYNC THUNK (Mocking an API Call with Professional Data + Priority)
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (_, { getState }) => {
    const { tasks } = getState().tasks;
    if (tasks.length > 0) return tasks; 

    // Artificial delay for presentation (Simulating network latency)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Updated with Priority field for Week 8 MUI integration
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

// 2. THE SLICE (The Department)
const taskSlice = createSlice({
  name: 'tasks',
  // Initial state pulled from local storage (Updated key to v8)
  initialState: {
    tasks: JSON.parse(localStorage.getItem('ultra-tasks-v8')) || [],
    isLoading: false,
    isSyncing: false,
    error: null
  },
  // SYNCHRONOUS ACTIONS
  reducers: {
    addTask: (state, action) => {
      state.tasks.unshift(action.payload);
      localStorage.setItem('ultra-tasks-v8', JSON.stringify(state.tasks));
    },
    toggleTask: (state, action) => {
      const task = state.tasks.find(t => t.id === action.payload);
      if (task) {
        task.completed = !task.completed;
        localStorage.setItem('ultra-tasks-v8', JSON.stringify(state.tasks));
      }
    },
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter(t => t.id !== action.payload);
      localStorage.setItem('ultra-tasks-v8', JSON.stringify(state.tasks));
    },
    setSyncing: (state, action) => {
      state.isSyncing = action.payload;
    }
  },
  // ASYNC ACTIONS
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        if(state.tasks.length === 0) state.isLoading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        if(action.payload !== state.tasks) {
           state.tasks = action.payload;
           localStorage.setItem('ultra-tasks-v8', JSON.stringify(state.tasks));
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