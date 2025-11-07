import ClientSidebar from './ClientSidebar';
import ClientHeader from './ClientHeader';

const ClientLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <ClientSidebar />
      <div className="flex-1 ml-64 flex flex-col overflow-hidden">
        <ClientHeader />
        <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
          {children}
        </main>
      </div>
    </div>
  );
};

export default ClientLayout;

