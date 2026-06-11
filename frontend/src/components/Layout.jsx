import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export function Layout({ titulo, children }) {
  return (
    <>
      <Sidebar />
      <Topbar titulo={titulo} />
      <main className="main-content">
        {children}
      </main>
    </>
  );
}
