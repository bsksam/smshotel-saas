"use client";

import { useEffect, useState } from "react";
import { Plus, CheckCircle2, Circle, Loader2, Sparkles, X } from "lucide-react";
import { getHousekeepingTasks, createHousekeepingTask, updateTaskStatus, getRooms } from "@/actions/hotel";

export default function HousekeepingPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    try {
      const [tasksRes, roomsRes] = await Promise.all([
        getHousekeepingTasks(),
        getRooms()
      ]);
      if (tasksRes.success) setTasks(tasksRes.data);
      if (roomsRes.success) setRooms(roomsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAddTask(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const res = await createHousekeepingTask(formData);
    
    if (!res.error) {
      setIsModalOpen(false);
      loadData();
    }
    setIsSubmitting(false);
  }

  async function handleToggleStatus(taskId: string, currentStatus: string) {
    const newStatus = currentStatus === "COMPLETED" ? "PENDING" : "COMPLETED";
    await updateTaskStatus(taskId, newStatus);
    loadData();
  }

  const pendingTasks = tasks.filter(t => t.status !== "COMPLETED");
  const completedTasks = tasks.filter(t => t.status === "COMPLETED");

  const getTaskBadge = (type: string) => {
    switch (type) {
      case "CLEANING": return "bg-indigo-50 text-indigo-700 border border-indigo-200";
      case "MAINTENANCE": return "bg-amber-50 text-amber-700 border border-amber-200";
      case "INSPECTION": return "bg-blue-50 text-blue-700 border border-blue-200";
      default: return "bg-zinc-100 text-zinc-650 border border-zinc-200";
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-600 animate-pulse" />
            Housekeeping
          </h2>
          <p className="text-zinc-500 mt-1 text-sm">Manage room cleaning, maintenance, and inspections.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-xl transition-all font-semibold text-xs shadow-md shadow-indigo-100"
        >
          <Plus className="w-4 h-4" />
          Assign Task
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-zinc-300" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* To Do / Pending Tasks */}
          <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-sm p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-amber-500"></div>
            <h3 className="text-lg font-bold text-zinc-900 tracking-tight border-b border-zinc-100 pb-4 mb-4 flex justify-between items-center">
              Pending Tasks
              <span className="bg-amber-50 text-amber-700 border border-amber-200 text-xs px-2.5 py-0.5 rounded-full font-bold">{pendingTasks.length}</span>
            </h3>
            
            <div className="space-y-3">
              {pendingTasks.length === 0 ? (
                <p className="text-sm text-zinc-500 text-center py-8">All caught up! No pending tasks.</p>
              ) : (
                pendingTasks.map(task => (
                  <div key={task.id} className="flex gap-4 p-4 rounded-xl border border-zinc-200 hover:border-amber-400 bg-amber-50/5 hover:bg-amber-50/10 transition-all">
                    <button onClick={() => handleToggleStatus(task.id, task.status)} className="mt-1 text-zinc-350 hover:text-emerald-600 transition-colors">
                      <Circle className="w-6 h-6" />
                    </button>
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="font-bold text-zinc-900">Room {task.room?.number}</span>
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${getTaskBadge(task.taskType)}`}>
                          {task.taskType}
                        </span>
                      </div>
                      {task.notes && <p className="text-sm text-zinc-650 font-medium">{task.notes}</p>}
                      <p className="text-[10px] text-zinc-400 mt-2 font-medium">Added {new Date(task.createdAt).toLocaleTimeString()}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Completed Tasks */}
          <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-sm p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
            <h3 className="text-lg font-bold text-zinc-900 tracking-tight border-b border-zinc-100 pb-4 mb-4 flex justify-between items-center">
              Completed Today
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs px-2.5 py-0.5 rounded-full font-bold">{completedTasks.length}</span>
            </h3>
            
            <div className="space-y-3">
              {completedTasks.length === 0 ? (
                <p className="text-sm text-zinc-500 text-center py-8">No tasks completed yet.</p>
              ) : (
                completedTasks.map(task => (
                  <div key={task.id} className="flex gap-4 p-4 rounded-xl border border-zinc-150 bg-zinc-50/40 hover:bg-zinc-50/70 transition-all opacity-85 hover:opacity-100">
                    <button onClick={() => handleToggleStatus(task.id, task.status)} className="mt-1 text-emerald-600 hover:text-zinc-400 transition-colors">
                      <CheckCircle2 className="w-6 h-6" />
                    </button>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-zinc-400 line-through">Room {task.room?.number}</span>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 border border-zinc-200 px-2 py-0.5 rounded-md bg-zinc-50">
                          {task.taskType}
                        </span>
                      </div>
                      {task.notes && <p className="text-xs text-zinc-400 line-through">{task.notes}</p>}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-zinc-100 bg-zinc-50/30">
              <h3 className="text-lg font-bold text-zinc-900 tracking-tight">Assign Task</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-900 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddTask} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Select Room</label>
                <select required name="roomId" className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm bg-white text-zinc-800">
                  <option value="">Choose a room</option>
                  {rooms.map(r => (
                    <option key={r.id} value={r.id}>Room {r.number} ({r.status})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Task Type</label>
                <select required name="taskType" className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm bg-white text-zinc-800">
                  <option value="CLEANING">Cleaning</option>
                  <option value="MAINTENANCE">Maintenance</option>
                  <option value="INSPECTION">Inspection</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Notes (Optional)</label>
                <textarea name="notes" rows={3} className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm bg-white resize-none" placeholder="E.g. Fix leaky faucet..."></textarea>
              </div>
              <div className="mt-8 flex gap-3 pt-4 border-t border-zinc-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 text-sm font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors">
                  Cancel
                </button>
                <button disabled={isSubmitting} type="submit" className="flex-1 px-4 py-2 text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-colors disabled:opacity-50">
                  {isSubmitting ? "Assigning..." : "Assign Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
