import React, { useState, useMemo } from 'react';
import { Search, LayoutGrid, List, Plus, X, Calendar } from 'lucide-react';
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

const folders = [
  { name: 'fx', path: '/Projects/HOUSE/101/010/SH002...', files: 8, size: '4.23 GB', added: 4, modified: 1, deleted: 1, time: '刚刚', recentUpdates: generateUpdates(6, 'fx') },
  { name: 'anim', path: '/Projects/HOUSE/101/010/SH001...', files: 20, size: '366.48 MB', added: 3, modified: 1, deleted: 0, time: '刚刚', recentUpdates: generateUpdates(4, 'anim') },
  { name: 'City', path: '/Projects/HOUSE/Assets/Environ...', files: 15, size: '2.33 GB', added: 4, modified: 1, deleted: 1, time: '44分钟前', recentUpdates: generateUpdates(6, 'other') },
  { name: 'Shot01', path: '/Projects/COMMERCIAL/ClientA/...', files: 12, size: '2.9 GB', added: 4, modified: 2, deleted: 1, time: '3小时前', recentUpdates: generateUpdates(7, 'comp') },
  { name: 'lighting', path: '/Projects/HOUSE/101/010/SH003...', files: 18, size: '493.19 MB', added: 0, modified: 2, deleted: 0, time: '3小时前', recentUpdates: generateUpdates(2, 'other') },
  { name: 'comp', path: '/Projects/HOUSE/101/020/SH004...', files: 18, size: '2.8 GB', added: 1, modified: 0, deleted: 1, time: '3小时前', recentUpdates: generateUpdates(2, 'comp') },
  { name: 'Hero', path: '/Projects/HOUSE/Assets/Charact...', files: 27, size: '5.04 GB', added: 4, modified: 2, deleted: 0, time: '4小时前', recentUpdates: generateUpdates(6, 'anim') },
  { name: 'Shot02', path: '/Projects/COMMERCIAL/ClientA/...', files: 27, size: '373.99 MB', added: 3, modified: 0, deleted: 0, time: '4小时前', recentUpdates: generateUpdates(3, 'comp') },
];

export function FolderBoard() {
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const { showToast } = useToast();

  const filteredFolders = useMemo(() => {
    return folders.filter(f => 
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      f.path.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleRefresh = (name: string) => {
    showToast(`正在刷新 ${name} 的快照...`, 'info');
  };

  const handleOpenFolder = (name: string) => {
    showToast(`在文件管理器中打开 ${name}`, 'info');
  };

  const handleSaveSnapshot = () => {
    setIsModalOpen(false);
    showToast('快照设置已保存', 'success');
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto h-full flex flex-col relative">
      <header className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 shrink-0 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">文件夹看板</h1>
          <p className="text-[var(--color-text-secondary)] mt-1 text-sm">8 个监控文件夹 · 56 个快照</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          <div className="flex items-center gap-2 bg-[var(--color-bg-surface)] border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 text-sm focus-within:border-violet-500 transition-colors">
            <Calendar className="w-4 h-4 text-[var(--color-text-muted)]" />
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
          <div className="relative flex-1 md:flex-none">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索..." 
              className="bg-[var(--color-bg-surface)] border border-[var(--color-border-subtle)] rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-violet-500 w-full md:w-64"
            />
          </div>
          
          <div className="flex bg-[var(--color-bg-surface)] border border-[var(--color-border-subtle)] rounded-lg p-1 shrink-0">
            <button 
              onClick={() => setLayout('grid')}
              className={cn("p-1.5 rounded transition-colors", layout === 'grid' ? "bg-[var(--color-bg-elevated)] text-white shadow-sm" : "hover:bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)] hover:text-white")}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setLayout('list')}
              className={cn("p-1.5 rounded transition-colors", layout === 'list' ? "bg-[var(--color-bg-elevated)] text-white shadow-sm" : "hover:bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)] hover:text-white")}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

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

      {/* Snapshot Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-[var(--color-bg-surface)] border border-[var(--color-border-subtle)] rounded-xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)]">
              <h3 className="font-semibold">设置文件夹快照</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[var(--color-text-muted)] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">目标磁盘</label>
                <select className="w-full bg-[var(--color-bg-base)] border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500">
                  <option>C: 系统盘</option>
                  <option>D: 数据盘</option>
                  <option>E: 备份盘</option>
                  <option>NAS 存储</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">文件夹路径</label>
                <div className="flex gap-2">
                  <input type="text" placeholder="/Projects/..." className="flex-1 bg-[var(--color-bg-base)] border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500" />
                  <button className="px-3 py-2 bg-[var(--color-bg-elevated)] border border-[var(--color-border-subtle)] rounded-lg text-sm hover:text-white transition-colors shrink-0">
                    浏览
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">快照频率</label>
                <select className="w-full bg-[var(--color-bg-base)] border border-[var(--color-border-subtle)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500">
                  <option>手动触发</option>
                  <option>每小时</option>
                  <option>每天 00:00</option>
                  <option>每周</option>
                </select>
              </div>
              <div className="pt-4 flex gap-3">
                <button onClick={() => setIsModalOpen(false)} className="flex-1 py-2 rounded-lg border border-[var(--color-border-subtle)] text-sm font-medium hover:bg-[var(--color-bg-elevated)] transition-colors">
                  取消
                </button>
                <button onClick={handleSaveSnapshot} className="flex-1 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors">
                  保存设置
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
