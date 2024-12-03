import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';

const DashboardHome = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchTodos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'todos'));
      const todoList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      todoList.sort((a, b) => b.createdAt - a.createdAt);
      setTodos(todoList);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    
    setLoading(true);
    try {
      await addDoc(collection(db, 'todos'), {
        content: newTodo,
        completed: false,
        createdAt: Date.now()
      });
      setNewTodo('');
      fetchTodos();
    } catch (error) {
      console.error('Error adding todo:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTodo = async (todoId, completed) => {
    try {
      await updateDoc(doc(db, 'todos', todoId), {
        completed: !completed
      });
      fetchTodos();
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const deleteTodo = async (todoId) => {
    try {
      await deleteDoc(doc(db, 'todos', todoId));
      fetchTodos();
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  return (
    <div className="text-white">
      <div className="relative mb-12">
        <h1 className="text-4xl font-bold text-white font-['Space_Grotesk'] relative z-10">
          Admin Dashboard
          <span className="text-[#63B3ED]">.</span>
        </h1>
        <div className="absolute -top-4 -left-2 w-12 h-12 border-2 border-[#63B3ED]/20 rounded-full" />
        <div className="absolute top-0 left-0 w-8 h-8 border-2 border-[#63B3ED]/40 rounded-full" />
      </div>

      <div className="mt-8 max-w-2xl">
        <div className="bg-[#131E2B] rounded-lg p-6 border border-[#2C5282]/20">
          <h2 className="text-xl font-bold text-white font-['Space_Grotesk'] mb-6">
            Todo List
          </h2>

          <form onSubmit={handleAddTodo} className="flex gap-4 mb-6">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add a new todo..."
              className="flex-1 p-3 bg-[#0F1620] border border-[#2C5282]/20 rounded-lg
                        focus:ring-2 focus:ring-[#63B3ED] focus:border-transparent
                        text-white font-['Space_Grotesk'] transition-all duration-300"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-[#63B3ED] hover:bg-[#63B3ED]/90 text-white rounded-lg 
                      transition-all duration-300 font-['Space_Grotesk'] relative overflow-hidden group"
            >
              Add
            </button>
          </form>

          <div className="space-y-3">
            {todos.map((todo) => (
              <div
                key={todo.id}
                className="flex items-center justify-between p-3 bg-[#0F1620] rounded-lg 
                         border border-[#2C5282]/10 hover:border-[#2C5282]/20 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id, todo.completed)}
                    className="w-5 h-5 rounded border-[#2C5282]/20 bg-[#131E2B]
                             checked:bg-[#63B3ED] checked:border-[#63B3ED] transition-all duration-300"
                  />
                  <span className={`font-['Space_Grotesk'] ${todo.completed ? 'line-through text-gray-500' : 'text-white'}`}>
                    {todo.content}
                  </span>
                </div>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="text-red-400 hover:text-red-300 transition-colors duration-300"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;