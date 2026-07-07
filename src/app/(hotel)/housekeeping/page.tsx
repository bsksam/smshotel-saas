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

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6" />
            Housekeeping
          </h2>
          <p className="text-zinc-500 mt-1 text-sm">Manage room cleaning, maintenance, and inspections.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-zinc-900 text-white px-4 py-2 rounded-lg hover:bg-zinc-800 transition-colors font-medium text-sm shadow-sm"
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
          <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6">
            <h3 className="text-lg font-bold text-zinc-900 tracking-tight border-b border-zinc-100 pb-4 mb-4 flex justify-between items-center">
              Pending Tasks
              <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full">{pendingTasks.length}</span>
            </h3>
            
            <div className="space-y-3">
              {pendingTasks.length === 0 ? (
                <p className="text-sm text-zinc-500 text-center py-8">All caught up! No pending tasks.</p>
              ) : (
                pendingTasks.map(task => (
                  <div key={task.id} className="flex gap-4 p-4 rounded-xl border border-zinc-200 hover:border-zinc-300 bg-zinc-50/50 transition-colors">
                    <button onClick={() => handleToggleStatus(task.id, task.status)} className="mt-1 text-zinc-300 hover:text-green-500 transition-colors">
                      <Circle className="w-6 h-6" />
                    </button>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-zinc-900">Room {task.room?.number}</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-zinc-200 text-zinc-600 px-2 py-0.5 rounded-md">
                          {task.taskType}
                        </span>
                      </div>
                      {task.notes && <p className="text-sm text-zinc-600">{task.notes}</p>}
                      <p className="text-xs text-zinc-400 mt-2">Added {new Date(task.createdAt).toLocaleTimeString()}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Completed Tasks */}
          <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6 opacity-75 hover:opacity-100 transition-opacity">
            <h3 className="text-lg font-bold text-zinc-900 tracking-tight border-b border-zinc-100 pb-4 mb-4 flex justify-between items-center">
              Completed Today
              <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">{completedTasks.length}</span>
            </h3>
            
            <div className="space-y-3">
              {completedTasks.length === 0 ? (
                <p className="text-sm text-zinc-500 text-center py-8">No tasks completed yet.</p>
              ) : (
                completedTasks.map(task => (
                  <div key={task.id} className="flex gap-4 p-4 rounded-xl border border-zinc-100 bg-white opacity-80">
                    <button onClick={() => handleToggleStatus(task.id, task.status)} className="mt-1 text-green-500 hover:text-zinc-400 transition-colors">
                      <CheckCircle2 className="w-6 h-6" />
                    </button>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-zinc-900 line-through text-zinc-500">Room {task.room?.number}</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                          {task.taskType}
                        </span>
                      </div>
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
            <div className="flex justify-between items-center p-6 border-b border-zinc-100">
              <h3 className="text-lg font-bold text-zinc-900 tracking-tight">Assign Task</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-900 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddTask} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Select Room</label>
                <select required name="roomId" className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm bg-white">
                  <option value="">Choose a room</option>
                  {rooms.map(r => (
                    <option key={r.id} value={r.id}>Room {r.number} ({r.status})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Task Type</label>
                <select required name="taskType" className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm bg-white">
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
