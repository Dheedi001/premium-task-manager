import { describe, it, expect } from 'vitest';
import reducer, { addTask, deleteTask } from './taskSlice';

describe('Task Redux Slice (Unit Tests)', () => {
  
  it('should return the initial state when passed an empty action', () => {
    const initialState = reducer(undefined, { type: 'unknown' });
    expect(initialState.tasks).toEqual([]);
    expect(initialState.isLoading).toBe(false);
  });

  it('should handle adding a new task', () => {
    const previousState = { tasks: [] };
    const newTask = { id: 1, title: 'Write Unit Tests', priority: 'High', completed: false };
    
    const nextState = reducer(previousState, addTask(newTask));
    
    expect(nextState.tasks.length).toBe(1);
    expect(nextState.tasks[0].title).toBe('Write Unit Tests');
  });

  it('should handle deleting a task', () => {
    const previousState = { 
      tasks: [{ id: 1, title: 'Write Unit Tests', priority: 'High', completed: false }] 
    };
    
    const nextState = reducer(previousState, deleteTask(1));
    
    expect(nextState.tasks.length).toBe(0);
  });
});