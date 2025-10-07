import { ReactNode } from 'react';
import Sidebar from './Sidebar';

type MainLayoutProps = {
  currentPage: string;
  onNavigate: (page: string) => void;
  children: ReactNode;
};

export default function MainLayout({ currentPage, onNavigate, children }: MainLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar currentPage={currentPage} onNavigate={onNavigate} />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
