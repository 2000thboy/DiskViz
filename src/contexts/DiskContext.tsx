import { createContext, useContext, useState, ReactNode } from 'react';

interface DiskInfo {
  id: string;
  name: string;
  type: string;
  total: number;
  used: number;
  color: string;
}

interface DiskContextType {
  disks: DiskInfo[];
  totalSpace: number;
  usedSpace: number;
}

const mockDisks: DiskInfo[] = [
  { id: 'c', name: 'C: 系统盘', type: 'Windows', total: 512, used: 380, color: 'bg-blue-500' },
  { id: 'd', name: 'D: 数据盘', type: 'Data', total: 1024, used: 620, color: 'bg-emerald-500' },
  { id: 'e', name: 'E: 备份盘', type: 'Backup', total: 2048, used: 450, color: 'bg-amber-500' },
  { id: 'nas', name: 'NAS 存储', type: 'Network', total: 8192, used: 2050, color: 'bg-violet-500' },
];

const DiskContext = createContext<DiskContextType | undefined>(undefined);

export function DiskProvider({ children }: { children: ReactNode }) {
  const [disks] = useState<DiskInfo[]>(mockDisks);

  const totalSpace = disks.reduce((acc, disk) => acc + disk.total, 0);
  const usedSpace = disks.reduce((acc, disk) => acc + disk.used, 0);

  return (
    <DiskContext.Provider value={{ disks, totalSpace, usedSpace }}>
      {children}
    </DiskContext.Provider>
  );
}

export function useDisk() {
  const context = useContext(DiskContext);
  if (context === undefined) {
    throw new Error('useDisk must be used within a DiskProvider');
  }
  return context;
}
