import AuthGuard from "@/components/AuthGuard";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import {
  ArrowLeft, BookOpen, Users, ShoppingCart, Layers, Plus,
  Trash2, Edit, Loader2, GraduationCap, BarChart3, X, Save
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type Tab = 'courses' | 'modules' | 'users' | 'orders';

function AdminContent() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<Tab>('courses');

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F0F0F0' }}>
        <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
          <GraduationCap className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <h1 className="text-xl font-bold mb-2" style={{ color: '#001F3F' }}>Access Denied</h1>
          <p className="text-gray-500 mb-6">You need admin privileges to access this page.</p>
          <Button onClick={() => setLocation('/dashboard')} className="text-white" style={{ background: '#001F3F' }}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const tabs: { key: Tab; label: string; icon: any }[] = [
    { key: 'courses', label: 'Courses', icon: BookOpen },
    { key: 'modules', label: 'Modules', icon: Layers },
    { key: 'users', label: 'Users', icon: Users },
    { key: 'orders', label: 'Orders', icon: ShoppingCart },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#F0F0F0' }}>
      <div className="bg-white border-b border-gray-100">
        <div className="container py-6">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => setLocation('/dashboard')} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <ArrowLeft className="w-5 h-5" style={{ color: '#001F3F' }} />
            </button>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: '#001F3F' }}>Admin Panel</h1>
              <p className="text-sm text-gray-500">Manage your platform</p>
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.key ? 'text-white' : 'bg-white text-gray-600 border border-gray-200'
                }`}
                style={activeTab === tab.key ? { background: '#001F3F' } : {}}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container py-8">
        {activeTab === 'courses' && <AdminCourses />}
        {activeTab === 'modules' && <AdminModules />}
        {activeTab === 'users' && <AdminUsers />}
        {activeTab === 'orders' && <AdminOrders />}
      </div>
    </div>
  );
}

function AdminCourses() {
  const courses = trpc.admin.courses.list.useQuery();
  const deleteCourse = trpc.admin.courses.delete.useMutation({
    onSuccess: () => { toast.success('Course deleted'); courses.refetch(); },
    onError: () => toast.error('Failed to delete'),
  });
  const createCourse = trpc.admin.courses.create.useMutation({
    onSuccess: () => { toast.success('Course created'); courses.refetch(); setShowCreate(false); },
    onError: () => toast.error('Failed to create'),
  });

  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ code: '', name: '', description: '', category: '', difficulty: 'beginner', estimatedHours: 10 });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold" style={{ color: '#001F3F' }}>Courses ({courses.data?.length ?? 0})</h2>
        <Button className="text-white rounded-xl" style={{ background: '#001F3F' }} onClick={() => setShowCreate(!showCreate)}>
          <Plus className="w-4 h-4 mr-2" /> Add Course
        </Button>
      </div>

      {showCreate && (
        <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold" style={{ color: '#001F3F' }}>New Course</h3>
            <button onClick={() => setShowCreate(false)}><X className="w-5 h-5 text-gray-400" /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <input placeholder="Course Code" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm" />
            <input placeholder="Course Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm" />
            <input placeholder="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm" />
            <select value={form.difficulty} onChange={e => setForm({ ...form, difficulty: e.target.value })} className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm">
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
            <input placeholder="Est. Hours" type="number" value={form.estimatedHours} onChange={e => setForm({ ...form, estimatedHours: Number(e.target.value) })} className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm" />
          </div>
          <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm mb-4" rows={3} />
          <Button className="text-white rounded-xl" style={{ background: '#001F3F' }} onClick={() => createCourse.mutate(form)} disabled={createCourse.isPending}>
            {createCourse.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            Create Course
          </Button>
        </div>
      )}

      {courses.isLoading ? (
        <div className="flex items-center justify-center py-10"><Loader2 className="w-6 h-6 animate-spin" style={{ color: '#001F3F' }} /></div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left p-4 font-medium text-gray-500">Code</th>
                <th className="text-left p-4 font-medium text-gray-500">Name</th>
                <th className="text-left p-4 font-medium text-gray-500 hidden md:table-cell">Category</th>
                <th className="text-left p-4 font-medium text-gray-500 hidden md:table-cell">Difficulty</th>
                <th className="text-left p-4 font-medium text-gray-500 hidden md:table-cell">Published</th>
                <th className="text-right p-4 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(courses.data ?? []).map((c: any) => (
                <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="p-4 font-medium" style={{ color: '#001F3F' }}>{c.code}</td>
                  <td className="p-4">{c.name}</td>
                  <td className="p-4 hidden md:table-cell text-gray-500">{c.category}</td>
                  <td className="p-4 hidden md:table-cell capitalize text-gray-500">{c.difficulty}</td>
                  <td className="p-4 hidden md:table-cell">{c.isPublished ? '✅' : '❌'}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => { if (confirm('Delete this course?')) deleteCourse.mutate({ id: c.id }); }} className="p-2 rounded-lg hover:bg-red-50 text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function AdminModules() {
  const modules = trpc.admin.modules.list.useQuery();
  const deleteModule = trpc.admin.modules.delete.useMutation({
    onSuccess: () => { toast.success('Module deleted'); modules.refetch(); },
    onError: () => toast.error('Failed to delete'),
  });

  return (
    <div>
      <h2 className="text-lg font-bold mb-6" style={{ color: '#001F3F' }}>Modules ({modules.data?.length ?? 0})</h2>
      {modules.isLoading ? (
        <div className="flex items-center justify-center py-10"><Loader2 className="w-6 h-6 animate-spin" style={{ color: '#001F3F' }} /></div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left p-4 font-medium text-gray-500">ID</th>
                <th className="text-left p-4 font-medium text-gray-500">Title</th>
                <th className="text-left p-4 font-medium text-gray-500 hidden md:table-cell">Type</th>
                <th className="text-left p-4 font-medium text-gray-500 hidden md:table-cell">Course ID</th>
                <th className="text-left p-4 font-medium text-gray-500 hidden md:table-cell">XP</th>
                <th className="text-right p-4 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(modules.data ?? []).map((m: any) => (
                <tr key={m.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="p-4 font-medium" style={{ color: '#001F3F' }}>{m.id}</td>
                  <td className="p-4">{m.title}</td>
                  <td className="p-4 hidden md:table-cell text-gray-500 capitalize">{m.type?.replace('_', ' ')}</td>
                  <td className="p-4 hidden md:table-cell text-gray-500">{m.courseId}</td>
                  <td className="p-4 hidden md:table-cell text-gray-500">{m.xpReward}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => { if (confirm('Delete this module?')) deleteModule.mutate({ id: m.id }); }} className="p-2 rounded-lg hover:bg-red-50 text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function AdminUsers() {
  const users = trpc.admin.users.list.useQuery();

  return (
    <div>
      <h2 className="text-lg font-bold mb-6" style={{ color: '#001F3F' }}>Users ({users.data?.length ?? 0})</h2>
      {users.isLoading ? (
        <div className="flex items-center justify-center py-10"><Loader2 className="w-6 h-6 animate-spin" style={{ color: '#001F3F' }} /></div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left p-4 font-medium text-gray-500">ID</th>
                <th className="text-left p-4 font-medium text-gray-500">Name</th>
                <th className="text-left p-4 font-medium text-gray-500 hidden md:table-cell">Email</th>
                <th className="text-left p-4 font-medium text-gray-500 hidden md:table-cell">Role</th>
                <th className="text-left p-4 font-medium text-gray-500 hidden md:table-cell">Joined</th>
              </tr>
            </thead>
            <tbody>
              {(users.data ?? []).map((u: any) => (
                <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="p-4 font-medium" style={{ color: '#001F3F' }}>{u.id}</td>
                  <td className="p-4">{u.name ?? 'N/A'}</td>
                  <td className="p-4 hidden md:table-cell text-gray-500">{u.email ?? 'N/A'}</td>
                  <td className="p-4 hidden md:table-cell">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${u.role === 'admin' ? 'bg-purple-50 text-purple-600' : 'bg-gray-100 text-gray-600'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4 hidden md:table-cell text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function AdminOrders() {
  const orders = trpc.admin.orders.list.useQuery();

  return (
    <div>
      <h2 className="text-lg font-bold mb-6" style={{ color: '#001F3F' }}>Orders ({orders.data?.length ?? 0})</h2>
      {orders.isLoading ? (
        <div className="flex items-center justify-center py-10"><Loader2 className="w-6 h-6 animate-spin" style={{ color: '#001F3F' }} /></div>
      ) : !orders.data || orders.data.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
          <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-400">No orders yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left p-4 font-medium text-gray-500">ID</th>
                <th className="text-left p-4 font-medium text-gray-500">User</th>
                <th className="text-left p-4 font-medium text-gray-500 hidden md:table-cell">Plan</th>
                <th className="text-left p-4 font-medium text-gray-500 hidden md:table-cell">Amount</th>
                <th className="text-left p-4 font-medium text-gray-500">Status</th>
                <th className="text-left p-4 font-medium text-gray-500 hidden md:table-cell">Date</th>
              </tr>
            </thead>
            <tbody>
              {(orders.data ?? []).map((o: any) => (
                <tr key={o.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="p-4 font-medium" style={{ color: '#001F3F' }}>{o.id}</td>
                  <td className="p-4">{o.userId}</td>
                  <td className="p-4 hidden md:table-cell text-gray-500 capitalize">{o.plan}</td>
                  <td className="p-4 hidden md:table-cell text-gray-500">${(o.amount / 100).toFixed(2)}</td>
                  <td className="p-4">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      o.status === 'completed' ? 'bg-green-50 text-green-600' :
                      o.status === 'pending' ? 'bg-yellow-50 text-yellow-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="p-4 hidden md:table-cell text-gray-500">{new Date(o.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function AdminPanel() {
  return (
    <AuthGuard>
      <AdminContent />
    </AuthGuard>
  );
}
