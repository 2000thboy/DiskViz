import React, { ReactNode, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderKanban, 
  ShieldAlert, 
  Settings,
  HardDrive,
  Plus,
  Menu,
  X,
  LogOut,
  User
} from 'lucide-react';
import { cn } from '../utils/cn';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { showToast } = useToast();
  const { isAuthenticated, user, login, logout } = useAuth();

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginType, setLoginType] = useState<'user' | 'admin'>('user');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [projects, setProjects] = useState([
    { id: 'proj-a', name: '项目A - 材质', time: '4小时前', updates: 3, color: 'bg-blue-500' },
    { id: 'proj-b', name: '项目B - 渲染', time: '6小时前', updates: 0, color: 'bg-emerald-500' },
    { id: 'shared', name: '共享资源库', time: '1天前', updates: 1, color: 'bg-amber-500' },
  ]);

  const [isAddBoardModalOpen, setIsAddBoardModalOpen] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const [newBoardColor, setNewBoardColor] = useState('bg-violet-500');

  const handleSettingsClick = () => {
    showToast('打开系统设置', 'info');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      showToast('请输入用户名', 'error');
      return;
    }
    if (login(username, password, loginType)) {
      showToast('登录成功', 'success');
      setIsLoginModalOpen(false);
      setPassword('');
      setUsername('');
    } else {
      showToast('账号或密码错误', 'error');
    }
  };

  const handleLogout = () => {
    logout();
    showToast('已退出登录', 'info');
    navigate('/dashboard');
  };

  const handleAddBoardClick = () => {
    setIsAddBoardModalOpen(true);
  };

  const handleAddBoardSave = () => {
    if (!newBoardName.trim()) {
      showToast('请输入看板名称', 'error');
      return;
    }
    setProjects([...projects, {
      id: `proj-${Date.now()}`,
      name: newBoardName,
      time: '刚刚',
      updates: 0,
      color: newBoardColor
    }]);
    setIsAddBoardModalOpen(false);
    setNewBoardName('');
    showToast('看板创建成功', 'success');
  };

  const navItems = [
    { icon: LayoutDashboard, label: '仪表盘', path: '/dashboard' },
    { icon: FolderKanban, label: '文件夹看板', path: '/folders' },
  ];

  const adminItems = [
    { icon: ShieldAlert, label: '管理员后台', path: '/admin' },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-bg-base)] text-[var(--color-text-primary)]">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] absolute top-0 left-0 right-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
            <HardDrive className="w-5 h-5 text-white" />
          </div>
          <h1 className="font-bold text-lg">DiskViz</h1>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 -mr-2 text-[var(--color-text-secondary)]">
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed md:relative z-50 w-64 h-full flex flex-col border-r border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] shrink-0 transition-transform duration-300",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="p-6 hidden md:flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
            <HardDrive className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight tracking-tight">DiskViz</h1>
            <p className="text-[10px] text-[var(--color-text-muted)] font-mono">v3.0.1 PRO</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-8 mt-16 md:mt-0">
          {/* Main Nav */}
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-[var(--color-bg-elevated)] text-white" 
                    : "text-[var(--color-text-secondary)] hover:text-white hover:bg-[var(--color-bg-elevated)]/50"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Admin */}
          {user?.isAdmin && (
            <div>
              <div className="px-3 mb-2 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                管理
              </div>
              <nav className="space-y-1">
                {adminItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) => cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      isActive 
                        ? "bg-violet-500/10 text-violet-400" 
                        : "text-[var(--color-text-secondary)] hover:text-white hover:bg-[var(--color-bg-elevated)]/50"
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </NavLink>
                ))}
              </nav>
            </div>
          )}

          {/* Projects */}
          <div>
            <div className="px-3 mb-2 flex items-center justify-between text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
              <span>我的看板</span>
            </div>
            <nav className="space-y-1">
              {projects.map((proj) => (
                <NavLink
                  key={proj.id}
                  to={`/project/${proj.id}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) => cn(
                    "flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors group",
                    isActive 
                      ? "bg-[var(--color-bg-elevated)] border border-[var(--color-border-strong)]" 
                      : "hover:bg-[var(--color-bg-elevated)]/50 border border-transparent"
                  )}
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-start gap-3 min-w-0">
                        <div className={cn("w-1.5 h-1.5 rounded-full mt-1.5 shrink-0", proj.color)} />
                        <div className="min-w-0">
                          <div className={cn("text-sm font-medium truncate", isActive ? "text-white" : "text-[var(--color-text-secondary)] group-hover:text-white")}>
                            {proj.name}
                          </div>
                          <div className="text-[10px] text-[var(--color-text-muted)] font-mono mt-0.5">
                            {proj.time}
                          </div>
                        </div>
                      </div>
                      {proj.updates > 0 && (
                        <div className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center text-[10px] font-bold shrink-0 ml-2">
                          {proj.updates}
                        </div>
                      )}
                    </>
                  )}
                </NavLink>
              ))}
              {user?.isAdmin && (
                <button onClick={handleAddBoardClick} className="w-full flex items-center gap-2 px-3 py-2 mt-2 text-sm text-[var(--color-text-muted)] hover:text-white transition-colors">
                  <Plus className="w-4 h-4" />
                  添加看板
                </button>
              )}
            </nav>
          </div>
        </div>

        <div className="p-4 border-t border-[var(--color-border-subtle)] shrink-0 flex items-center justify-between bg-[var(--color-bg-surface)]">
          {isAuthenticated && user ? (
            <>
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500/20 to-blue-500/20 border border-violet-500/20 flex items-center justify-center text-violet-400 font-bold shrink-0">
                  {user.initials}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">{user.name}</p>
                  <p className="text-[10px] text-[var(--color-text-muted)] truncate font-mono">{user.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={handleSettingsClick} className="p-2 text-[var(--color-text-secondary)] hover:text-white hover:bg-[var(--color-bg-elevated)] rounded-lg transition-colors">
                  <Settings className="w-4 h-4" />
                </button>
                <button onClick={handleLogout} className="p-2 text-[var(--color-text-secondary)] hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors" title="退出登录">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <button 
              onClick={() => setIsLoginModalOpen(true)}
              className="flex items-center gap-3 w-full px-2 py-1.5 text-[var(--color-text-secondary)] hover:text-white hover:bg-[var(--color-bg-elevated)] rounded-lg transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-[var(--color-bg-elevated)] flex items-center justify-center shrink-0">
                <User className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium">未登录</p>
                <p className="text-[10px] text-[var(--color-text-muted)]">点击登录账号</p>
              </div>
            </button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative bg-[var(--color-bg-base)] pt-[73px] md:pt-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/10 via-[var(--color-bg-base)] to-[var(--color-bg-base)] pointer-events-none" />
        <div className="relative z-10 h-full">
          {children}
        </div>
      </main>

      {/* Add Board Modal */}
      {isAddBoardModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-[var(--color-bg-surface)] border border-[var(--color-border-subtle)] rounded-xl w-full max-w-sm shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)]">
              <h3 className="font-semibold">创建新看板</h3>
              <button onClick={() => setIsAddBoardModalOpen(false)} className="text-[var(--color-text-muted)] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">看板名称</label>
                <input 
                  type="text" 
                  value={newBoardName}
                  onChange={(e) => setNewBoardName(e.target.value)}
                  placeholder="例如：项目C - 特效" 
                  className="w-full bg-[var(--color-bg-base)] border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500" 
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">标识颜色</label>
                <div className="flex gap-2">
                  {['bg-violet-500', 'bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-pink-500'].map(color => (
                    <button
                      key={color}
                      onClick={() => setNewBoardColor(color)}
                      className={cn(
                        "w-6 h-6 rounded-full transition-transform",
                        color,
                        newBoardColor === color ? "ring-2 ring-white ring-offset-2 ring-offset-[var(--color-bg-surface)] scale-110" : "opacity-50 hover:opacity-100"
                      )}
                    />
                  ))}
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button onClick={() => setIsAddBoardModalOpen(false)} className="flex-1 py-2 rounded-lg border border-[var(--color-border-subtle)] text-sm font-medium hover:bg-[var(--color-bg-elevated)] transition-colors">
                  取消
                </button>
                <button onClick={handleAddBoardSave} className="flex-1 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors">
                  创建
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Login Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-[var(--color-bg-surface)] border border-[var(--color-border-subtle)] rounded-xl w-full max-w-sm shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)]">
              <h3 className="font-semibold">系统登录</h3>
              <button onClick={() => setIsLoginModalOpen(false)} className="text-[var(--color-text-muted)] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex bg-[var(--color-bg-base)] p-1 rounded-lg mb-6">
                <button
                  onClick={() => setLoginType('user')}
                  className={cn(
                    "flex-1 py-1.5 text-sm font-medium rounded-md transition-colors",
                    loginType === 'user' ? "bg-[var(--color-bg-surface)] text-white shadow-sm" : "text-[var(--color-text-secondary)] hover:text-white"
                  )}
                >
                  用户登录
                </button>
                <button
                  onClick={() => setLoginType('admin')}
                  className={cn(
                    "flex-1 py-1.5 text-sm font-medium rounded-md transition-colors",
                    loginType === 'admin' ? "bg-[var(--color-bg-surface)] text-white shadow-sm" : "text-[var(--color-text-secondary)] hover:text-white"
                  )}
                >
                  管理员登录
                </button>
              </div>
              
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-violet-500/10 flex items-center justify-center">
                    {loginType === 'admin' ? (
                      <ShieldAlert className="w-8 h-8 text-violet-400" />
                    ) : (
                      <User className="w-8 h-8 text-violet-400" />
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">用户名</label>
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="请输入用户名" 
                    className="w-full bg-[var(--color-bg-base)] border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500" 
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
                    {loginType === 'admin' ? '管理员密码' : '密码'}
                  </label>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={loginType === 'admin' ? "请输入密码 (admin)" : "请输入密码 (user)"} 
                    className="w-full bg-[var(--color-bg-base)] border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500" 
                  />
                </div>
                <div className="pt-4">
                  <button type="submit" className="w-full py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors">
                    登录
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
