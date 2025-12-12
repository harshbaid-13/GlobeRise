import { useState, useEffect } from 'react';
import ClientSidebar from './ClientSidebar';
import ClientHeader from './ClientHeader';
import Backdrop from '../common/Backdrop';

const ClientLayout = ({ children }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const closeSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    if (isMobileSidebarOpen) {
      document.body.classList.add('mobile-menu-open');
    } else {
      document.body.classList.remove('mobile-menu-open');
    }

    return () => {
      document.body.classList.remove('mobile-menu-open');
    };
  }, [isMobileSidebarOpen]);

  return (
    <div className="flex h-screen bg-[var(--bg-primary)] transition-colors duration-200">
      <ClientSidebar isOpen={isMobileSidebarOpen} onClose={closeSidebar} />
      <Backdrop isOpen={isMobileSidebarOpen} onClick={closeSidebar} />
      <div className="flex-1 lg:ml-64 flex flex-col overflow-hidden">
        <ClientHeader onMenuToggle={toggleSidebar} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-[var(--bg-primary)] transition-colors duration-200">
          {children}
        </main>
      </div>
    </div>
  );
};

export default ClientLayout;
