import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';

const DashboardHome = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [itemType, setItemType] = useState('feature');
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingContent, setEditingContent] = useState('');

  const fetchItems = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'todos'));
      const itemsList = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          type: data.type || 'feature'
        };
      });
      itemsList.sort((a, b) => b.createdAt - a.createdAt);
      setItems(itemsList);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItem.trim()) return;
    
    setLoading(true);
    try {
      await addDoc(collection(db, 'todos'), {
        content: newItem,
        type: itemType,
        completed: false,
        createdAt: Date.now(),
        shippedAt: null
      });
      setNewItem('');
      fetchItems();
    } catch (error) {
      console.error('Error adding item:', error);
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (item) => {
    setEditingId(item.id);
    setEditingContent(item.content);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingContent('');
  };

  const saveEdit = async (itemId) => {
    if (!editingContent.trim()) return;
    
    try {
      await updateDoc(doc(db, 'todos', itemId), {
        content: editingContent
      });
      setEditingId(null);
      setEditingContent('');
      fetchItems();
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const toggleStatus = async (itemId, completed) => {
    try {
      await updateDoc(doc(db, 'todos', itemId), {
        completed: !completed,
        shippedAt: !completed ? Date.now() : null
      });
      fetchItems();
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const deleteItem = async (itemId) => {
    try {
      await deleteDoc(doc(db, 'todos', itemId));
      fetchItems();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const pendingItems = items.filter(item => !item.completed && item.type === itemType);
  const shippedItems = items.filter(item => item.completed && item.type === itemType);

  const ItemContent = ({ item }) => {
    if (editingId === item.id) {
      return (
        <div className="flex items-center gap-2 flex-1">
          <input
            type="text"
            value={editingContent}
            onChange={(e) => setEditingContent(e.target.value)}
            className="flex-1 p-2 bg-[#0F1620] border border-[#2C5282]/20 rounded-lg
                      focus:ring-2 focus:ring-[#63B3ED] focus:border-transparent
                      text-white font-['Space_Grotesk'] transition-all duration-300"
          />
          <button
            onClick={() => saveEdit(item.id)}
            className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg border border-green-500/30
                     hover:bg-green-500/30 transition-all duration-300"
          >
            Save
          </button>
          <button
            onClick={cancelEditing}
            className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg border border-red-500/30
                     hover:bg-red-500/30 transition-all duration-300"
          >
            Cancel
          </button>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-3 flex-1">
        <input
          type="checkbox"
          checked={item.completed}
          onChange={() => toggleStatus(item.id, item.completed)}
          className="w-5 h-5 rounded border-[#2C5282]/20 bg-[#131E2B]
                   checked:bg-[#63B3ED] checked:border-[#63B3ED] transition-all duration-300"
        />
        <div>
          <span className={`font-['Space_Grotesk'] ${item.completed ? 'text-gray-400 line-through' : 'text-white'}`}>
            {item.content}
          </span>
          <span className={`ml-2 px-2 py-0.5 text-sm rounded ${
            item.type === 'feature'
              ? item.completed ? 'bg-green-500/10 text-green-400/60' : 'bg-green-500/20 text-green-400'
              : item.completed ? 'bg-red-500/10 text-red-400/60' : 'bg-red-500/20 text-red-400'
          }`}>
            {item.type}
          </span>
          {item.shippedAt && (
            <span className="ml-2 text-sm text-gray-500">
              {new Date(item.shippedAt).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    );
  };

  const ItemActions = ({ item }) => {
    if (editingId === item.id) {
      return null; // Don't show regular actions while editing
    }

    return (
      <div className="flex gap-2">
        <button
          onClick={() => startEditing(item)}
          className="text-[#63B3ED] hover:text-[#63B3ED]/80 transition-colors duration-300"
        >
          Edit
        </button>
        <button
          onClick={() => deleteItem(item.id)}
          className="text-red-400 hover:text-red-300 transition-colors duration-300"
        >
          Delete
        </button>
      </div>
    );
  };

  return (
    <div className="text-white">
      <div className="relative mb-12">
        <h1 className="text-4xl font-bold text-white font-['Space_Grotesk'] relative z-10">
          Development Dashboard
          <span className="text-[#63B3ED]">.</span>
        </h1>
        <div className="absolute -top-4 -left-2 w-12 h-12 border-2 border-[#63B3ED]/20 rounded-full" />
        <div className="absolute top-0 left-0 w-8 h-8 border-2 border-[#63B3ED]/40 rounded-full" />
      </div>

      <div className="mt-8 max-w-2xl">
        <div className="bg-[#131E2B] rounded-lg p-6 border border-[#2C5282]/20">
          <h2 className="text-xl font-bold text-white font-['Space_Grotesk'] mb-6">
            Add New Feature/Bug Fix
          </h2>

          <form onSubmit={handleAddItem} className="space-y-4 mb-6">
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setItemType('feature')}
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  itemType === 'feature'
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-[#0F1620] text-gray-400 border border-[#2C5282]/20'
                }`}
              >
                Feature
              </button>
              <button
                type="button"
                onClick={() => setItemType('bug')}
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  itemType === 'bug'
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'bg-[#0F1620] text-gray-400 border border-[#2C5282]/20'
                }`}
              >
                Bug Fix
              </button>
            </div>

            <div className="flex gap-4">
              <input
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                placeholder={`Add a new ${itemType === 'feature' ? 'feature' : 'bug fix'}...`}
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
            </div>
          </form>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 font-['Space_Grotesk']">
                In Progress
              </h3>
              <div className="space-y-3">
                {pendingItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-[#0F1620] rounded-lg 
                           border border-[#2C5282]/10 hover:border-[#2C5282]/20 transition-all duration-300"
                  >
                    <ItemContent item={item} />
                    <ItemActions item={item} />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4 font-['Space_Grotesk']">
                Shipped
              </h3>
              <div className="space-y-3">
                {shippedItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-[#0F1620] rounded-lg 
                           border border-[#2C5282]/10 hover:border-[#2C5282]/20 transition-all duration-300"
                  >
                    <ItemContent item={item} />
                    <ItemActions item={item} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;