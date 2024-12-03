import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, ChevronRight, ChevronDown } from 'lucide-react';

const menuItems = [
  { name: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6", path: "/Dashboard" },
  { name: "Inspeksi", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2", path: "/Inspeksi" },
  {
    name: "Registrasi Inventaris",
    icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    submenu: [
      { name: "Perangkat Elektronik", path: "/Registrasi-Inventaris/Elektronik" },
      { name: "Aset Hardware", path: "/Registrasi-Inventaris/Hardware" },
      { name: "Software Lisensi", path: "/Registrasi-Inventaris/Licensi" },
      { name: "Software Aplikasi", path: "/Registrasi-Inventaris/Software" },
    ]
  },
  { name: "Storage", icon: "M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4",
    submenu: [
      { name: "Elektronik", path: "/Storage/Perangkat-Elektronik" },
      { name: "Hardware", path: "/Storage/Hardware" },
      { name: "Submenu 3", path: "/submenu3" },
    ]
  },
  { name: "Pinjam Aset", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10", path: "/Peminjaman" },
  
  { name: "Tambah Pengguna", icon: "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z", path: "/Tambah-Pengguna" },
];

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    // Close submenu if the sidebar is collapsing
    if (sidebarOpen) {
      setOpenSubmenu(null);
    }
  };

  const handleMenuClick = (item: any) => {
    if (item.submenu) {
      // Open the sidebar if it is closed
      if (!sidebarOpen) {
        setSidebarOpen(true);
      }
      setOpenSubmenu(openSubmenu === item.name ? null : item.name);
    }
  };

  const handleSubmenuClick = (path: string) => {
    // Delay the transition for a smoother experience
    setTimeout(() => {
      setSidebarOpen(false);
    }, 300); // Delay to allow submenu to render before closing
  };

  return (
    <aside className={`fixed inset-y-0 left-0 z-30 bg-white transition-all duration-300 ease-in-out ${sidebarOpen ? 'w-64' : 'w-16'}`}>
      <div className="flex flex-col h-full">
        <div className={`flex ${sidebarOpen ? 'items-center justify-between' : 'flex-col items-center'} p-4 border-b`}>
          {sidebarOpen ? (
            <img src="/public/foto/logobesar.png" alt="Large Logo" className="h-20 w-max transition-all duration-300" />
          ) : (
            <img src="/foto/logotutup.png" alt="Small Logo" className="h-6 w-6 mb-4 transition-all duration-300" />
          )}

          {sidebarOpen ? (
            <X className="h-6 w-6 cursor-pointer" onClick={toggleSidebar} />
          ) : (
            <Menu className="h-6 w-6 cursor-pointer" onClick={toggleSidebar} />
          )}
        </div>

        <nav className="flex-1 overflow-y-auto">
          <ul className="p-2 space-y-1">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link href={item.path ? item.path : '#'} passHref>
                  <div
                    className={`flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg ${sidebarOpen ? '' : 'justify-center'}`}
                    onMouseEnter={() => setHoveredItem(item.name)}
                    onMouseLeave={() => setHoveredItem(null)}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMenuClick(item);
                    }}
                  >
                    {sidebarOpen && (
                      <>
                        <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d={item.icon} stroke="currentColor" strokeWidth="2" />
                        </svg>
                        <span>{item.name}</span>
                      </>
                    )}
                    {!sidebarOpen && (
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d={item.icon} stroke="currentColor" strokeWidth="2" />
                      </svg>
                    )}
                    {item.submenu && sidebarOpen && (
                      <span className="ml-auto">
                        {openSubmenu === item.name ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                      </span>
                    )}
                  </div>
                </Link>
                {hoveredItem === item.name && !sidebarOpen && (
                  <div className="absolute left-4 bg-gray-700 text-white rounded p-1 text-xs ml-2 mt-1">
                    {item.name}
                  </div>
                )}
                {item.submenu && openSubmenu === item.name && sidebarOpen && (
                  <ul className="ml-6 mt-2 space-y-1 transition-all duration-300 ease-in-out">
                    {item.submenu.map((subitem, subIndex) => (
                      <li key={subIndex}>
                        <Link
                          href={subitem.path}
                          className="flex items-center p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                          onClick={() => handleSubmenuClick(subitem.path)}
                        >
                          <span>{subitem.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
