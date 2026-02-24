import React, { useState, useMemo } from 'react';
import { Folder, Calendar, ChevronDown, ChevronUp, FileText, Image as ImageIcon, Film, File, RefreshCw, ExternalLink } from 'lucide-react';
import { cn } from '../utils/cn';

export interface FolderCardProps {
  folder: any;
  layout: 'grid' | 'list';
  onRefresh: (name: string) => void;
  onOpen: (name: string) => void;
}

export function FolderCard({ folder, layout, onRefresh, onOpen }: FolderCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'add' | 'mod' | 'del'>('all');
  
  const maxDisplay = 3;
  
  const filteredUpdates = useMemo(() => {
    if (filterType === 'all') return folder.recentUpdates || [];
    return (folder.recentUpdates || []).filter((u: any) => u.type === filterType);
  }, [folder.recentUpdates, filterType]);

  const hasMore = filteredUpdates.length > maxDisplay;
  const displayUpdates = isExpanded ? filteredUpdates : filteredUpdates.slice(0, maxDisplay);

  const toggleFilter = (type: 'add' | 'mod' | 'del') => {
    if (filterType === type) {
      setFilterType('all');
    } else {
      setFilterType(type);
      setIsExpanded(true);
    }
  };

  const getFileIcon = (name: string) => {
    if (name.endsWith('.jpg') || name.endsWith('.png') || name.endsWith('.exr')) return <ImageIcon className="w-3 h-3" />;
    if (name.endsWith('.mp4') || name.endsWith('.mov')) return <Film className="w-3 h-3" />;
    if (name.endsWith('.txt') || name.endsWith('.csv')) return <FileText className="w-3 h-3" />;
    return <File className="w-3 h-3" />;
  };

  return (
    <div className={cn(
      "bg-[var(--color-bg-surface)] border border-[var(--color-border-subtle)] rounded-xl p-4 hover:border-[var(--color-border-strong)] transition-all group flex break-inside-avoid mb-4",
      layout === 'grid' ? "flex-col" : "flex-col md:flex-row md:items-start justify-between gap-4"
    )}>
      <div className={cn("flex justify-between items-start", layout === 'grid' ? "mb-3" : "flex-1 min-w-0")}>
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0">
            <Folder className="w-4 h-4 text-violet-400" />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-sm truncate">{folder.name}</h3>
            <p className="text-[10px] text-[var(--color-text-muted)] truncate" title={folder.path}>{folder.path}</p>
          </div>
        </div>
        {layout === 'grid' && (
          <div className="flex items-center gap-1 text-[10px] text-[var(--color-text-muted)] shrink-0 bg-[var(--color-bg-elevated)] px-2 py-1 rounded-md ml-2">
            <Calendar className="w-3 h-3" />
            {folder.time}
          </div>
        )}
      </div>

      <div className={cn("flex items-center gap-3 text-xs font-mono text-[var(--color-text-secondary)]", layout === 'grid' ? "mb-3" : "shrink-0 md:w-32 mt-2 md:mt-0")}>
        <span>{folder.files} 文件</span>
        <span className="w-1 h-1 rounded-full bg-[var(--color-border-strong)]" />
        <span>{folder.size}</span>
      </div>

      <div className={cn("flex flex-wrap gap-2", layout === 'grid' ? "mb-4" : "shrink-0 md:w-48 mt-2 md:mt-0")}>
        {folder.added > 0 && (
          <button 
            onClick={() => toggleFilter('add')}
            className={cn(
              "text-[10px] font-medium px-1.5 py-0.5 rounded transition-all",
              filterType === 'add' || filterType === 'all' ? "text-emerald-400 bg-emerald-400/10 hover:bg-emerald-400/20" : "text-emerald-400/50 bg-emerald-400/5 hover:bg-emerald-400/10",
              filterType === 'add' && "ring-1 ring-emerald-400/50"
            )}
          >
            +{folder.added} 新增
          </button>
        )}
        {folder.modified > 0 && (
          <button 
            onClick={() => toggleFilter('mod')}
            className={cn(
              "text-[10px] font-medium px-1.5 py-0.5 rounded transition-all",
              filterType === 'mod' || filterType === 'all' ? "text-amber-400 bg-amber-400/10 hover:bg-amber-400/20" : "text-amber-400/50 bg-amber-400/5 hover:bg-amber-400/10",
              filterType === 'mod' && "ring-1 ring-amber-400/50"
            )}
          >
            ● {folder.modified} 修改
          </button>
        )}
        {folder.deleted > 0 && (
          <button 
            onClick={() => toggleFilter('del')}
            className={cn(
              "text-[10px] font-medium px-1.5 py-0.5 rounded transition-all",
              filterType === 'del' || filterType === 'all' ? "text-red-400 bg-red-400/10 hover:bg-red-400/20" : "text-red-400/50 bg-red-400/5 hover:bg-red-400/10",
              filterType === 'del' && "ring-1 ring-red-400/50"
            )}
          >
            -{folder.deleted} 删除
          </button>
        )}
      </div>

      {/* Recent Updates List */}
      {folder.recentUpdates && folder.recentUpdates.length > 0 && (
        <div className={cn("bg-[var(--color-bg-elevated)]/50 rounded-lg p-3 space-y-2", layout === 'grid' ? "mb-4" : "w-full md:w-72 shrink-0 mt-4 md:mt-0")}>
          <div className="text-[10px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2 flex justify-between items-center">
            <span>最近更新文件</span>
            {filterType !== 'all' && (
              <span className="text-violet-400 lowercase">
                {filterType === 'add' ? '新增' : filterType === 'mod' ? '修改' : '删除'} ({filteredUpdates.length})
              </span>
            )}
          </div>
          
          {filteredUpdates.length === 0 ? (
            <div className="text-xs text-[var(--color-text-muted)] py-2 text-center">没有匹配的记录</div>
          ) : (
            displayUpdates.map((update: any) => (
              <div key={update.id} className="flex items-center justify-between gap-2 group/item">
                <div className="flex items-center gap-2 min-w-0">
                  <div className={cn(
                    "w-1.5 h-1.5 rounded-full shrink-0",
                    update.type === 'add' ? "bg-emerald-400" :
                    update.type === 'mod' ? "bg-amber-400" : "bg-red-400"
                  )} />
                  <div className="text-[var(--color-text-muted)] shrink-0">
                    {getFileIcon(update.name)}
                  </div>
                  <span className={cn(
                    "text-xs truncate",
                    update.type === 'del' ? "text-[var(--color-text-muted)] line-through" : "text-[var(--color-text-secondary)] group-hover/item:text-white transition-colors"
                  )}>
                    {update.name}
                  </span>
                </div>
                <span className="text-[10px] text-[var(--color-text-muted)] font-mono shrink-0">{update.time}</span>
              </div>
            ))
          )}
          
          {hasMore && (
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center justify-center gap-1 w-full pt-2 mt-1 text-[10px] text-[var(--color-text-muted)] hover:text-white transition-colors border-t border-[var(--color-border-subtle)]"
            >
              {isExpanded ? (
                <><ChevronUp className="w-3 h-3" /> 收起</>
              ) : (
                <><ChevronDown className="w-3 h-3" /> 展开其余 {filteredUpdates.length - maxDisplay} 个文件</>
              )}
            </button>
          )}
        </div>
      )}

      <div className={cn("flex items-center justify-between", layout === 'grid' ? "mt-auto pt-3 border-t border-[var(--color-border-subtle)]" : "shrink-0 mt-4 md:mt-0")}>
        {layout === 'list' && (
          <div className="flex items-center gap-1 text-[10px] text-[var(--color-text-muted)] shrink-0 bg-[var(--color-bg-elevated)] px-2 py-1 rounded-md mr-4">
            <Calendar className="w-3 h-3" />
            {folder.time}
          </div>
        )}
        <div className="flex items-center gap-2 text-[10px] text-[var(--color-text-muted)] font-mono">
          <span className="px-1.5 py-0.5 rounded bg-[var(--color-bg-elevated)] border border-[var(--color-border-subtle)]">最新版本</span>
        </div>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => onRefresh(folder.name)}
            className="p-1.5 text-[var(--color-text-secondary)] hover:text-white hover:bg-[var(--color-bg-elevated)] rounded-md transition-colors" 
            title="刷新快照"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={() => onOpen(folder.name)}
            className="p-1.5 text-[var(--color-text-secondary)] hover:text-white hover:bg-[var(--color-bg-elevated)] rounded-md transition-colors" 
            title="打开文件夹"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
