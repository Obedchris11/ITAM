'use client'

import { useState, useRef, useEffect } from 'react'
import { Bell, Mail, Search, User, LogOut } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { usePathname, useRouter } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Cookies from 'js-cookie'

const Header = () => {
  const pathname = usePathname()
  const router = useRouter()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const [userInitials, setUserInitials] = useState('')

  useEffect(() => {
    const storedInitials = localStorage.getItem('userInitials')
    if (storedInitials) {
      setUserInitials(storedInitials)
    }
  }, [])

  const getPageName = (path: string) => {
    const parts = path.split('/').filter(Boolean)
    if (parts.length === 0) return 'Dashboard'
    return parts[parts.length - 1]
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  const pageName = getPageName(pathname)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [searchRef])

  const handleViewProfile = () => {
    router.push('/Profil-User')
  }

  const handleLogout = () => {
    Cookies.remove('authToken')
    router.push('/login')
  }

  return (
    <header className="bg-blue-600 text-white z-10">
      <div className="flex items-center justify-between p-4">
        <div ref={searchRef} className="flex items-center space-x-4">
          <Search
            className={`h-6 w-6 text-white cursor-pointer md:hidden ${isSearchOpen ? 'hidden' : 'block'}`}
            onClick={() => setIsSearchOpen(true)}
          />
          {isSearchOpen && (
            <Input
              type="search"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 bg-blue-700 border-blue-500 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 ease-in-out md:hidden"
              style={{ width: isSearchOpen ? '16rem' : '0', overflow: 'hidden' }}
            />
          )}
          <div className="hidden md:block relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 w-64 bg-blue-700 border-blue-500 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2 md:space-x-4">
          <Button variant="ghost" size="icon" className="text-white">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white">
            <Mail className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="text-black border-white h-8 w-8 rounded-full p-0">
                {userInitials}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleViewProfile}>
                <User className="mr-2 h-4 w-4" />
                <span>View Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="bg-white py-4 px-6 flex items-center justify-between shadow-md">
        <h1 className="text-xl font-semibold text-gray-800">{pageName}</h1>
      </div>
    </header>
  )
}

export default Header