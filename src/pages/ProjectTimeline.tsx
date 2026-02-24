import React, { useState, useMemo } from 'react';
import { Search, LayoutGrid, List, Calendar, Folder, Plus, RefreshCw, ExternalLink, X, ChevronDown, ChevronUp, FileText, Image as ImageIcon, Film, File, Bell, MoreHorizontal } from 'lucide-react';
import { cn } from '../utils/cn';
import { useToast } from '../contexts/ToastContext';
import { FolderCard } from '../components/FolderCard';

// Mock data for recent updates
const generateUpdates = (count: number, type: 'fx' | 'anim' | 'comp' | 'other') => {
  const updates = [];
  const types = ['add', 'mod', 'del'];
  const files = {
    fx: ['explosion_v2.vdb', 'smoke_sim_01.bgeo', 'particles_cache.abc', 'spark_texture.exr'],
    anim: ['char_run_cycle.fbx', 'camera_track_v3.abc', 'facial_rig_test.ma', 'prop_sword.obj'],
    comp: ['shot_010_v05.nk', 'bg_plate_denoised.exr', 'fg_matte.png', 'final_render_v2.mov'],
    other: ['project_notes.txt', 'reference_01.jpg', 'meeting_record.mp4', 'asset_list.csv']
  };
  
  for (let i = 0; i < count; i++) {
    const fileList = files[type] || files.other;
    updates.push({
      id: i,
      name: fileList[i % fileList.length],
      type: types[Math.floor(Math.random() * types.length)] as 'add' | 'mod' | 'del',
      time: `${Math.floor(Math.random() * 50) + 1}分钟前`
    });
  }
  return updates;
};

const projectFolders = [
  { name: 'Textures', path: '/Projects/ProjectA/Textures', files: 120, size: '4.23 GB', added: 4, modified: 1, deleted: 1, time: '刚刚', recentUpdates: generateUpdates(6, 'other') },
  { name: 'Models', path: '/Projects/ProjectA/Models', files: 45, size: '1.2 GB', added: 3, modified: 1, deleted: 0, time: '刚刚', recentUpdates: generateUpdates(4, 'anim') },
  { name: 'Renders', path: '/Projects/ProjectA/Renders', files: 300, size: '15.5 GB', added: 10, modified: 2, deleted: 5, time: '44分钟前', recentUpdates: generateUpdates(6, 'comp') },
  { name: 'References', path: '/Projects/ProjectA/References', files: 80, size: '500 MB', added: 0, modified: 0, deleted: 0, time: '3小时前', recentUpdates: [] },
];

export function ProjectTimeline() {
  const [isNotifying, setIsNotifying] = useState(true);
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showToast } = useToast();

  const handleToggleNotification = () => {
    setIsNotifying(!isNotifying);
    showToast(isNotifying ? '已关闭通知' : '已开启通知', isNotifying ? 'info' : 'success');
  };

  const handleRefresh = (name: string) => {
    showToast(`正在刷新文件夹 ${name === 'all' ? '所有' : name} 的快照...`, 'info');
  };

  const handleOpenFolder = (name: string) => {
    showToast(`正在打开文件夹 ${name}...`, 'info');
  };

  const handleSaveSnapshot = () => {
    setIsModalOpen(false);
    showToast('快照设置已保存', 'success');
  };

  const filteredFolders = useMemo(() => {
    return projectFolders.filter(f => 
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      f.path.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className="flex flex-col h-full p-4 md:p-8 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center shrink-0">
            <Folder className="w-6 h-6 text-violet-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">项目A - 材质</h1>
            <p className="text-[var(--color-text-secondary)] mt-1 text-sm font-mono">/Projects/ProjectA/Textures</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0">
          <div className="relative shrink-0">
            <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
            <select 
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-[var(--color-bg-surface)] border border-[var(--color-border-subtle)] rounded-lg pl-9 pr-8 py-2 text-sm focus:outline-none focus:border-violet-500 w-32 appearance-none text-[var(--color-text-secondary)] hover:text-white transition-colors cursor-pointer"
            >
              <option value="all">所有时间</option>
              <option value="today">今天</option>
              <option value="yesterday">昨天</option>
              <option value="week">本周</option>
              <option value="month">本月</option>
              <option value="custom">自定义日期</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-[var(--color-text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
          
          {dateFilter === 'custom' && (
            <div className="flex items-center gap-2 bg-[var(--color-bg-surface)] border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 text-sm focus-within:border-violet-500 transition-colors shrink-0">
              <input 
                type="date" 
                className="bg-transparent border-none outline-none text-[var(--color-text-secondary)] hover:text-white focus:text-white w-[110px] [color-scheme:dark]"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <span className="text-[var(--color-text-muted)]">-</span>
              <input 
                type="date" 
                className="bg-transparent border-none outline-none text-[var(--color-text-secondary)] hover:text-white focus:text-white w-[110px] [color-scheme:dark]"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          )}

          <div className="relative shrink-0">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
            <input 
              type="text" 
              placeholder="搜索文件夹..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-48 bg-[var(--color-bg-surface)] border border-[var(--color-border-subtle)] rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-violet-500 transition-colors"
            />
          </div>
          
          <div className="flex items-center bg-[var(--color-bg-surface)] border border-[var(--color-border-subtle)] rounded-lg p-1 shrink-0">
            <button 
              onClick={() => setLayout('grid')}
              className={cn("p-1.5 rounded-md transition-colors", layout === 'grid' ? "bg-[var(--color-bg-elevated)] text-white" : "text-[var(--color-text-secondary)] hover:text-white")}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setLayout('list')}
              className={cn("p-1.5 rounded-md transition-colors", layout === 'list' ? "bg-[var(--color-bg-elevated)] text-white" : "text-[var(--color-text-secondary)] hover:text-white")}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button 
            onClick={handleToggleNotification}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border shrink-0",
              isNotifying 
                ? "bg-violet-500/10 text-violet-400 border-violet-500/20 hover:bg-violet-500/20" 
                : "bg-[var(--color-bg-surface)] text-[var(--color-text-secondary)] border-[var(--color-border-subtle)] hover:text-white"
            )}
          >
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">{isNotifying ? '通知开启' : '通知关闭'}</span>
          </button>
          
          <button onClick={() => handleRefresh('all')} className="p-2 bg-[var(--color-bg-surface)] border border-[var(--color-border-subtle)] rounded-lg text-[var(--color-text-secondary)] hover:text-white transition-colors shrink-0">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button onClick={() => showToast('打开更多选项菜单', 'info')} className="p-2 bg-[var(--color-bg-surface)] border border-[var(--color-border-subtle)] rounded-lg text-[var(--color-text-secondary)] hover:text-white transition-colors shrink-0">
            <MoreHorizontal className="w-4 h-4" />
          </button>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-lg shadow-violet-500/20 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">添加快照</span>
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto pr-2 pb-8">
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-bg-surface)] border border-[var(--color-border-subtle)]">
              <Calendar className="w-3.5 h-3.5 text-violet-400" />
              <span className="text-xs font-medium">
                {startDate && endDate ? `${startDate} 至 ${endDate}` : 
                 startDate ? `${startDate} 之后` :
                 endDate ? `${endDate} 之前` : '所有时间'}
              </span>
            </div>
            <span className="text-xs text-[var(--color-text-muted)]">{filteredFolders.length} 个快照</span>
            <div className="flex-1 h-px bg-[var(--color-border-subtle)] ml-2" />
          </div>

          {filteredFolders.length === 0 ? (
            <div className="text-center py-12 text-[var(--color-text-secondary)]">
              未找到匹配的文件夹
            </div>
          ) : (
            <div className={cn(
              layout === 'grid' ? "columns-1 sm:columns-2 lg:columns-4 gap-4 space-y-4" : "flex flex-col gap-4"
            )}>
              {filteredFolders.map((folder, i) => (
                <FolderCard 
                  key={i} 
                  folder={folder} 
                  layout={layout} 
                  onRefresh={handleRefresh} 
                  onOpen={handleOpenFolder} 
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
