import { useState } from 'react';
import { useDisk } from '../contexts/DiskContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { Zap, Search, Trash2, FolderOpen, Filter, Download } from 'lucide-react';
import { cn } from '../utils/cn';
import { useToast } from '../contexts/ToastContext';

export function Dashboard() {
  const { disks, totalSpace, usedSpace } = useDisk();
  const { showToast } = useToast();
  const [activeDateRange, setActiveDateRange] = useState('最近7天');

  const formatGB = (gb: number) => {
    if (gb >= 1024) return `${(gb / 1024).toFixed(2)} TB`;
    return `${gb} GB`;
  };

  const pieData = [
    { name: 'Projects', value: 280, color: '#3b82f6' },
    { name: 'System', value: 180, color: '#8b5cf6' },
    { name: 'Videos', value: 120, color: '#f59e0b' },
    { name: 'Others', value: 160, color: '#3f3f46' },
  ];

  const handleQuickAction = (action: string) => {
    showToast(`正在执行：${action}`, 'info');
  };

  const handleExport = () => {
    showToast('开始导出选中文件...', 'success');
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <header className="mb-6 md:mb-8">
        <h1 className="text-2xl font-bold tracking-tight">仪表盘</h1>
        <p className="text-[var(--color-text-secondary)] mt-1 text-sm">系统磁盘空间与使用情况概览</p>
      </header>

      {/* Disk Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {disks.map(disk => {
          const percent = Math.round((disk.used / disk.total) * 100);
          return (
            <div key={disk.id} className="bg-[var(--color-bg-surface)] border border-[var(--color-border-subtle)] rounded-xl p-4 md:p-5 hover:border-[var(--color-border-strong)] transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center bg-opacity-10 shrink-0", disk.color.replace('bg-', 'bg-').replace('500', '500/10'))}>
                    <HardDriveIcon className={cn("w-5 h-5", disk.color.replace('bg-', 'text-'))} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold truncate text-sm">{disk.name}</h3>
                    <p className="text-xs text-[var(--color-text-muted)] truncate">{disk.type}</p>
                  </div>
                </div>
                <span className="text-xs font-mono font-medium bg-[var(--color-bg-elevated)] px-2 py-1 rounded shrink-0 ml-2">
                  {percent}%
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="h-1.5 w-full bg-[var(--color-bg-elevated)] rounded-full overflow-hidden">
                  <div 
                    className={cn("h-full rounded-full", disk.color)} 
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs font-mono text-[var(--color-text-secondary)]">
                  <span>已用 {formatGB(disk.used)}</span>
                  <span>可用 {formatGB(disk.total - disk.used)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Stats & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Stats & Chart */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overview Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[var(--color-bg-surface)] border border-[var(--color-border-subtle)] rounded-xl p-5">
              <div className="w-8 h-8 rounded-full bg-violet-500/10 flex items-center justify-center mb-3">
                <HardDriveIcon className="w-4 h-4 text-violet-400" />
              </div>
              <p className="text-sm text-[var(--color-text-secondary)] mb-1">总容量</p>
              <p className="text-2xl font-bold font-mono">{formatGB(totalSpace)}</p>
            </div>
            <div className="bg-[var(--color-bg-surface)] border border-[var(--color-border-subtle)] rounded-xl p-5">
              <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center mb-3">
                <PieChartIcon className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-sm text-[var(--color-text-secondary)] mb-1">已用空间</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold font-mono">{formatGB(usedSpace)}</p>
                <span className="text-xs text-[var(--color-text-muted)] font-mono">占比 {Math.round((usedSpace/totalSpace)*100)}%</span>
              </div>
            </div>
            <div className="bg-[var(--color-bg-surface)] border border-[var(--color-border-subtle)] rounded-xl p-5">
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center mb-3">
                <FolderOpen className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-sm text-[var(--color-text-secondary)] mb-1">文件数量</p>
              <p className="text-2xl font-bold font-mono">12,456</p>
            </div>
          </div>

          {/* Distribution Chart */}
          <div className="bg-[var(--color-bg-surface)] border border-[var(--color-border-subtle)] rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold">文件夹分布</h3>
              <span className="text-xs text-[var(--color-text-muted)]">共 9 项</span>
            </div>
            <div className="flex flex-col md:flex-row items-center h-auto md:h-64 gap-8 md:gap-0">
              <div className="w-full md:w-1/2 h-64 md:h-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      stroke="none"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#1c1c1f', border: '1px solid #3f3f46', borderRadius: '8px' }}
                      itemStyle={{ color: '#f4f4f5' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-bold font-mono">740 GB</span>
                  <span className="text-xs text-[var(--color-text-muted)]">总计</span>
                </div>
              </div>
              <div className="w-full md:w-1/2 md:pl-8 space-y-4">
                {pieData.map(item => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <div>
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-[10px] text-[var(--color-text-muted)] truncate max-w-[100px] sm:max-w-none">/{item.name}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-mono">{item.value} GB</p>
                      <p className="text-[10px] text-[var(--color-text-muted)] font-mono">{Math.round((item.value/740)*100)}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Actions & Export */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-[var(--color-bg-surface)] border border-[var(--color-border-subtle)] rounded-xl p-5">
            <h3 className="font-semibold mb-4">快速操作</h3>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => handleQuickAction('扫描磁盘')} className="flex flex-col items-start p-3 rounded-lg bg-[var(--color-bg-elevated)] hover:bg-[var(--color-border-strong)] transition-colors border border-transparent hover:border-[var(--color-border-subtle)] text-left">
                <Zap className="w-4 h-4 text-amber-400 mb-2" />
                <span className="text-sm font-medium">扫描磁盘</span>
                <span className="text-[10px] text-[var(--color-text-muted)] mt-0.5">更新索引</span>
              </button>
              <button onClick={() => handleQuickAction('查找大文件')} className="flex flex-col items-start p-3 rounded-lg bg-[var(--color-bg-elevated)] hover:bg-[var(--color-border-strong)] transition-colors border border-transparent hover:border-[var(--color-border-subtle)] text-left">
                <Search className="w-4 h-4 text-blue-400 mb-2" />
                <span className="text-sm font-medium">大文件</span>
                <span className="text-[10px] text-[var(--color-text-muted)] mt-0.5">查找占用</span>
              </button>
              <button onClick={() => handleQuickAction('清理垃圾')} className="flex flex-col items-start p-3 rounded-lg bg-[var(--color-bg-elevated)] hover:bg-[var(--color-border-strong)] transition-colors border border-transparent hover:border-[var(--color-border-subtle)] text-left">
                <Trash2 className="w-4 h-4 text-emerald-400 mb-2" />
                <span className="text-sm font-medium">清理垃圾</span>
                <span className="text-[10px] text-[var(--color-text-muted)] mt-0.5">释放空间</span>
              </button>
              <button onClick={() => handleQuickAction('浏览文件夹')} className="flex flex-col items-start p-3 rounded-lg bg-[var(--color-bg-elevated)] hover:bg-[var(--color-border-strong)] transition-colors border border-transparent hover:border-[var(--color-border-subtle)] text-left">
                <FolderOpen className="w-4 h-4 text-violet-400 mb-2" />
                <span className="text-sm font-medium">文件夹</span>
                <span className="text-[10px] text-[var(--color-text-muted)] mt-0.5">浏览管理</span>
              </button>
            </div>
          </div>

          {/* Export Widget */}
          <div className="bg-[var(--color-bg-surface)] border border-[var(--color-border-subtle)] rounded-xl p-5 flex flex-col h-[calc(100%-16rem)] min-h-[300px]">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-4 h-4 text-blue-400" />
              <div>
                <h3 className="font-semibold text-sm">文件筛选导出</h3>
                <p className="text-[10px] text-[var(--color-text-muted)]">按日期筛选并批量导出</p>
              </div>
            </div>
            
            <div className="space-y-3 mb-4">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-[var(--color-text-muted)] block mb-1">开始日期</label>
                  <input type="date" className="w-full bg-[var(--color-bg-elevated)] border border-[var(--color-border-subtle)] rounded-md px-2 py-1.5 text-xs text-[var(--color-text-primary)] focus:outline-none focus:border-violet-500" />
                </div>
                <div>
                  <label className="text-[10px] text-[var(--color-text-muted)] block mb-1">结束日期</label>
                  <input type="date" className="w-full bg-[var(--color-bg-elevated)] border border-[var(--color-border-subtle)] rounded-md px-2 py-1.5 text-xs text-[var(--color-text-primary)] focus:outline-none focus:border-violet-500" />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {['最近7天', '最近30天', '本月', '本年'].map(t => (
                  <button 
                    key={t} 
                    onClick={() => setActiveDateRange(t)}
                    className={cn(
                      "px-2 py-1 rounded text-[10px] transition-colors",
                      activeDateRange === t 
                        ? "bg-violet-500/20 text-violet-400 border border-violet-500/30" 
                        : "bg-[var(--color-bg-elevated)] hover:bg-[var(--color-border-strong)] text-[var(--color-text-secondary)] border border-transparent"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto border border-[var(--color-border-subtle)] rounded-lg bg-[var(--color-bg-base)] p-2 space-y-1">
              {[
                { name: 'project_v1.psd', path: '/Projects/Design/', size: '150 MB', date: '2024/01/15' },
                { name: 'render_001.exr', path: '/Projects/Renders/', size: '500 MB', date: '2024/02/20' },
                { name: 'texture_diffuse.jpg', path: '/Projects/Textures/', size: '25 MB', date: '2024/03/10' },
                { name: 'animation_v2.mov', path: '/Projects/Animation/', size: '800 MB', date: '2024/06/05' },
              ].map((file, i) => (
                <div key={i} className="flex items-center gap-3 p-2 hover:bg-[var(--color-bg-elevated)] rounded-md group">
                  <input type="checkbox" className="rounded border-[var(--color-border-strong)] bg-transparent w-3.5 h-3.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{file.name}</p>
                    <p className="text-[10px] text-[var(--color-text-muted)] truncate">{file.path}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-mono">{file.size}</p>
                    <p className="text-[10px] text-[var(--color-text-muted)] font-mono">{file.date}</p>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={handleExport} className="w-full mt-4 py-2 bg-violet-500/10 text-violet-400 hover:bg-violet-500/20 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
              <Download className="w-4 h-4" />
              导出选中文件 (0 项)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function HardDriveIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="22" y1="12" x2="2" y2="12" />
      <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
      <line x1="6" y1="16" x2="6.01" y2="16" />
      <line x1="10" y1="16" x2="10.01" y2="16" />
    </svg>
  )
}

function PieChartIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
      <path d="M22 12A10 10 0 0 0 12 2v10z" />
    </svg>
  )
}
