import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen bg-[var(--bg-primary)] transition-colors duration-200">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 bg-[var(--bg-primary)] transition-colors duration-200">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
