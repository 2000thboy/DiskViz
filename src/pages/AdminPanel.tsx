import React, { useState, useMemo } from 'react';
import { Users, HardDrive, Settings, Search, Plus, Shield, ChevronRight, Folder, Lock } from 'lucide-react';
import { cn } from '../utils/cn';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';

export function AdminPanel() {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<'users' | 'disks' | 'settings'>('users');
  const [searchQuery, setSearchQuery] = useState('');
  const { showToast } = useToast();

  const users = [
    { name: '张三', email: 'zhangsan@company.com', boards: 3, lastActive: '昨天', status: 'active' },
    { name: '李四', email: 'lisi@company.com', boards: 2, lastActive: '2天前', status: 'active' },
    { name: '王五', email: 'wangwu@company.com', boards: 1, lastActive: '7天前', status: 'disabled' },
    { name: '赵六', email: 'zhaoliu@company.com', boards: 3, lastActive: '1小时前', status: 'active' },
  ];

  const logs = [
    { action: '授予权限', desc: '授予项目A看板访问权限', target: '张三', time: '昨天', type: 'grant' },
    { action: '修改权限', desc: '修改项目B看板权限：允许编辑', target: '李四', time: '12小时前', type: 'modify' },
    { action: '切换用户', desc: '以用户身份查看看板', target: '张三', time: '1小时前', type: 'system' },
  ];

  const filteredUsers = useMemo(() => {
    return users.filter(user => 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleAddUser = () => {
    showToast('正在打开添加用户弹窗...', 'info');
  };

  const handleUserClick = (user: any) => {
    showToast(`查看用户 ${user.name} 的详情`, 'info');
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <div className="bg-[var(--color-bg-surface)] border border-[var(--color-border-subtle)] p-8 rounded-2xl max-w-sm w-full shadow-xl text-center">
          <div className="w-16 h-16 rounded-2xl bg-violet-500/10 flex items-center justify-center mb-6 mx-auto">
            <Lock className="w-8 h-8 text-violet-400" />
          </div>
          <h2 className="text-xl font-bold mb-2">无访问权限</h2>
          <p className="text-sm text-[var(--color-text-secondary)] mb-6">
            请在左下角登录管理员账号以访问后台管理系统。
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">管理员后台</h1>
          <p className="text-[var(--color-text-secondary)] mt-1 text-sm">用户权限管理与系统设置</p>
        </div>
        <div className="flex gap-6 text-center">
          <div>
            <div className="text-2xl font-bold font-mono">4</div>
            <div className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider">总用户</div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-emerald-400">3</div>
            <div className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider">活跃用户</div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-violet-400">4</div>
            <div className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider">磁盘数</div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-[var(--color-border-subtle)] mb-6 overflow-x-auto">
        <button 
          onClick={() => setActiveTab('users')}
          className={cn("px-4 py-2.5 text-sm font-medium border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors", activeTab === 'users' ? "border-violet-500 text-violet-400" : "border-transparent text-[var(--color-text-secondary)] hover:text-white")}
        >
          <Users className="w-4 h-4" /> 用户管理
        </button>
        <button 
          onClick={() => { setActiveTab('disks'); showToast('切换到磁盘管理', 'info'); }}
          className={cn("px-4 py-2.5 text-sm font-medium border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors", activeTab === 'disks' ? "border-violet-500 text-violet-400" : "border-transparent text-[var(--color-text-secondary)] hover:text-white")}
        >
          <HardDrive className="w-4 h-4" /> 磁盘管理
        </button>
        <button 
          onClick={() => { setActiveTab('settings'); showToast('切换到系统设置', 'info'); }}
          className={cn("px-4 py-2.5 text-sm font-medium border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors", activeTab === 'settings' ? "border-violet-500 text-violet-400" : "border-transparent text-[var(--color-text-secondary)] hover:text-white")}
        >
          <Settings className="w-4 h-4" /> 系统设置
        </button>
      </div>

      {activeTab === 'users' && (
        <>
          {/* Search & Add */}
          <div className="flex items-center gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索用户..." 
                className="w-full bg-[var(--color-bg-surface)] border border-[var(--color-border-subtle)] rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>
            <button 
              onClick={handleAddUser}
              className="w-10 h-10 rounded-lg bg-[var(--color-bg-surface)] border border-[var(--color-border-subtle)] flex items-center justify-center hover:border-violet-500 hover:text-violet-400 transition-colors shrink-0"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {/* User List */}
          <div className="space-y-2 mb-10">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-8 text-[var(--color-text-secondary)] text-sm">
                未找到匹配的用户
              </div>
            ) : (
              filteredUsers.map((user, i) => (
                <div 
                  key={i} 
                  onClick={() => handleUserClick(user)}
                  className="flex items-center justify-between p-4 rounded-xl bg-[var(--color-bg-surface)] border border-[var(--color-border-subtle)] hover:border-[var(--color-border-strong)] transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0",
                      user.status === 'disabled' ? "bg-red-500/10 text-red-400" : "bg-blue-500/10 text-blue-400"
                    )}>
                      {user.name[0]}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-sm truncate">{user.name}</h3>
                        {user.status === 'disabled' && (
                          <span className="text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded font-medium shrink-0">已禁用</span>
                        )}
                      </div>
                      <p className="text-xs text-[var(--color-text-muted)] font-mono mt-0.5 truncate">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 sm:gap-8 shrink-0">
                    <div className="text-right hidden sm:block">
                      <p className="text-xs text-[var(--color-text-secondary)] flex items-center gap-1 justify-end">
                        <Folder className="w-3.5 h-3.5" /> {user.boards} 个看板
                      </p>
                      <p className="text-[10px] text-[var(--color-text-muted)] mt-1 font-mono">
                        最后活跃: {user.lastActive}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-[var(--color-text-muted)] group-hover:text-white transition-colors" />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Activity Logs */}
          <div>
            <h3 className="text-sm font-semibold flex items-center gap-2 mb-4">
              <Shield className="w-4 h-4 text-violet-400" /> 操作日志
            </h3>
            <div className="space-y-2">
              {logs.map((log, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-[var(--color-bg-surface)] border border-[var(--color-border-subtle)]">
                  <div className="w-8 h-8 rounded-lg bg-[var(--color-bg-elevated)] flex items-center justify-center shrink-0 mt-0.5">
                    <Shield className="w-4 h-4 text-[var(--color-text-secondary)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1 gap-1">
                      <h4 className="text-sm font-medium truncate">管理员 <span className="text-[var(--color-text-secondary)] font-normal">{log.action}</span></h4>
                      <span className="text-[10px] text-[var(--color-text-muted)] font-mono shrink-0">{log.time}</span>
                    </div>
                    <p className="text-xs text-[var(--color-text-secondary)] break-words">{log.desc}</p>
                    <p className="text-[10px] text-[var(--color-text-muted)] mt-1">目标: {log.target}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
      
      {activeTab !== 'users' && (
        <div className="text-center py-12 text-[var(--color-text-secondary)]">
          <p>此模块正在开发中...</p>
        </div>
      )}
    </div>
  );
}
