import OperatorSidebar from "./OperatorSidebar";

interface OperatorLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const OperatorLayout = ({ children, title, subtitle }: OperatorLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <OperatorSidebar />
      <main className="flex-1 flex flex-col min-h-screen overflow-auto">
        {/* Top header */}
        <header className="bg-white border-b border-gray-200 px-8 py-5 sticky top-0 z-10">
          <h1 className="text-xl font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
        </header>
        {/* Page content */}
        <div className="flex-1 px-8 py-6">{children}</div>
      </main>
    </div>
  );
};

export default OperatorLayout;
