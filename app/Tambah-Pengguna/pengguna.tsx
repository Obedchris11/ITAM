'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { X, Eye, EyeOff, Search, Edit, MoreVertical, Users } from 'lucide-react'
import { AlertPopup } from "@/components/ui/alert"

interface User {
  id: number
  name: string
  role: string
  username: string
  password: string
}


const roles = ["Admin", "Manager", "Staff", "User", "Guest"]



export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: "John Doe", role: "Admin", username: "john_admin", password: "********" },
    { id: 2, name: "Jane Smith", role: "Manager", username: "jane_manager", password: "********" },
    { id: 3, name: "Bob Johnson", role: "Staff", username: "bob_staff", password: "********" },
    ...Array.from({ length: 50 }, (_, i) => ({
      id: i + 4,
      name: `User ${i + 4}`,
      role: roles[Math.floor(Math.random() * roles.length)],
      username: `user${i + 4}`,
      password: "********"
    }))
  ])

  const [newUser, setNewUser] = useState({ name: '', role: '', username: '', password: '' })
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  const [userToEdit, setUserToEdit] = useState<User | null>(null)
  const [alert, setAlert] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({ show: false, message: '', type: 'success' })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({ name: '', username: '', password: '', role: '' })
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearchVisible, setIsSearchVisible] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const totalPages = Math.ceil(users.length / itemsPerPage)

  useEffect(() => {
    if (alert.show) {
      const timer = setTimeout(() => {
        setAlert({ show: false, message: '', type: 'success' })
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [alert])

  useEffect(() => {
    if (!isAddDialogOpen) {
      setNewUser({ name: '', role: '', username: '', password: '' })
      setShowPassword(false)
      setErrors({ name: '', username: '', password: '', role: '' })
    }
  }, [isAddDialogOpen])

  useEffect(() => {
    if (isSearchVisible && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isSearchVisible])

  const validateName = (name: string): string => {
    if (name.length < 3) return "Nama harus memiliki minimal 3 karakter"
    if (!/^[a-zA-Z\s]+$/.test(name)) return "Nama hanya boleh berisi huruf dan spasi"
    return ""
  }

  const validateUsername = (username: string): string => {
    if (username.length < 5) return "Username harus memiliki minimal 5 karakter"
    if (!/^[a-zA-Z0-9_]+$/.test(username)) return "Username hanya boleh berisi huruf, angka, dan underscore"
    if (users.some(user => user.username === username)) return "Username sudah digunakan"
    return ""
  }

  const validatePassword = (password: string): string => {
    if (password.length < 8) return "Password harus memiliki minimal 8 karakter"
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) return "Password harus mengandung huruf besar, huruf kecil, dan angka"
    return ""
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewUser({ ...newUser, [name]: value })
    
    if (name === 'name') {
      setErrors({ ...errors, name: validateName(value) })
    } else if (name === 'username') {
      setErrors({ ...errors, username: validateUsername(value) })
    } else if (name === 'password') {
      setErrors({ ...errors, password: validatePassword(value) })
    }
  }

  const handleRoleChange = (value: string) => {
    setNewUser({ ...newUser, role: value })
    setErrors({ ...errors, role: '' })
  }

  const handleAddUser = () => {
    const nameError = validateName(newUser.name)
    const usernameError = validateUsername(newUser.username)
    const passwordError = validatePassword(newUser.password)
    const roleError = newUser.role ? '' : 'Role harus dipilih'

    setErrors({
      name: nameError,
      username: usernameError,
      password: passwordError,
      role: roleError
    })

    if (!nameError && !usernameError && !passwordError && !roleError) {
      const newUserWithId = { ...newUser, id: Date.now() }
      setUsers([newUserWithId, ...users])
      setNewUser({ name: '', role: '', username: '', password: '' })
      setIsAddDialogOpen(false)
      setAlert({ show: true, message: `${newUser.name} telah berhasil ditambahkan sebagai ${newUser.role}`, type: 'success' })
    }
  }

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (userToDelete) {
      setUsers(users.filter(user => user.id !== userToDelete.id))
      setAlert({ show: true, message: `${userToDelete.name} telah berhasil dihapus`, type: 'success' })
      setUserToDelete(null)
      setIsDeleteDialogOpen(false)
    }
  }

  const handleEditUser = (user: User) => {
    setUserToEdit(user)
    setIsEditDialogOpen(true)
  }

  const confirmEdit = (newRole: string) => {
    if (userToEdit) {
      setUsers(users.map(user => 
        user.id === userToEdit.id ? { ...user, role: newRole } : user
      ))
      setAlert({ show: true, message: `Role ${userToEdit.name} telah berhasil diubah menjadi ${newRole}`, type: 'success' })
      setUserToEdit(null)
      setIsEditDialogOpen(false)
    }
  }

  const toggleSearch = () => {
    if (window.innerWidth < 640) {
      setIsSearchVisible(!isSearchVisible)
      if (isSearchVisible) {
        setSearchTerm('')
      }
    }
  }

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const getPageNumbers = () => {
    const pageNumbers = []
    const maxVisiblePages = 5
    const halfVisible = Math.floor(maxVisiblePages / 2)

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else if (currentPage <= halfVisible + 1) {
      for (let i = 1; i <= maxVisiblePages - 1; i++) {
        pageNumbers.push(i)
      }
      pageNumbers.push('ellipsis')
      pageNumbers.push(totalPages)
    } else if (currentPage >= totalPages - halfVisible) {
      pageNumbers.push(1)
      pageNumbers.push('ellipsis')
      for (let i = totalPages - (maxVisiblePages - 2); i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      pageNumbers.push(1)
      pageNumbers.push('ellipsis')
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        pageNumbers.push(i)
      }
      pageNumbers.push('ellipsis')
      pageNumbers.push(totalPages)
    }

    return pageNumbers
  }

  return (
    <div className="container mx-auto p-4">
      {alert.show && (
        <AlertPopup
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ show: false, message: '', type: 'success' })}
        />
      )}
      <h1 className="text-2xl font-bold mb-4">Daftar Pengguna</h1>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <div className="relative w-full sm:w-64 mb-4 sm:mb-0">
          <div className="hidden sm:block">
            <Input
              type="text"
              placeholder="Cari pengguna..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-8 py-2 w-full"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Clear search"
              >
                <X size={20} />
              </button>
            )}
          </div>
          <div className="sm:hidden">
            {isSearchVisible ? (
              <div className="relative">
                <Input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Cari pengguna..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-8 py-2 w-full"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <button
                  onClick={toggleSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear search"
                >
                  <X size={20} />
                </button>
              </div>
            ) : (
              <Button variant="outline" onClick={toggleSearch} className="w-full">
                <Search className="h-4 w-4 mr-2" />
                <span>Cari</span>
              </Button>
            )}
          </div>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">Tambah Pengguna</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Pengguna Baru</DialogTitle>
              <DialogDescription>
                Masukkan informasi pengguna baru di sini.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nama
                </Label>
                <div className="col-span-3">
                  <Input
                    id="name"
                    name="name"
                    value={newUser.name}
                    onChange={handleInputChange}
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Username
                </Label>
                <div className="col-span-3">
                  <Input
                    id="username"
                    name="username"
                    value={newUser.username}
                    onChange={handleInputChange}
                    className={errors.username ? "border-red-500" : ""}
                  />
                  {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">
                  Password
                </Label>
                <div className="col-span-3">
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={newUser.password}
                      onChange={handleInputChange}
                      className={`pr-10 ${errors.password ? "border-red-500" : ""}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Role
                </Label>
                <div className="col-span-3">
                  <Select onValueChange={handleRoleChange} value={newUser.role}>
                    <SelectTrigger className={errors.role ? "border-red-500" : ""}>
                      <SelectValue placeholder="Pilih role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role} value={role}>{role}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddUser}>Tambah Pengguna</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead className="hidden sm:table-cell">Username</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell className="hidden sm:table-cell">{user.username}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell className="text-right">
                  <div className="hidden sm:block">
                    <Button variant="outline" size="sm" className="mr-2" onClick={() => handleEditUser(user)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteUser(user)}>
                      Hapus
                    </Button>
                  </div>
                  <div className="sm:hidden">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditUser(user)}>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteUser(user)}>
                          <X className="mr-2 h-4 w-4" />
                          <span>Hapus</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row justify-between items-center">
        <div className="w-full sm:w-1/3 mb-4 sm:mb-0"></div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
            {getPageNumbers().map((pageNumber, index) => (
              <PaginationItem key={index} className="hidden sm:inline-block">
                {pageNumber === 'ellipsis' ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    onClick={() => setCurrentPage(pageNumber as number)}
                    isActive={currentPage === pageNumber}
                  >
                    {pageNumber}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
        <div className="w-full sm:w-1/3 text-center sm:text-right mt-4 sm:mt-0">
          Halaman {currentPage} dari {totalPages}
        </div>
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Penghapusan</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus pengguna ini?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Pengguna</DialogTitle>
            <DialogDescription>
              Ubah role untuk {userToEdit?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select defaultValue={userToEdit?.role} onValueChange={(value) => confirmEdit(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih role baru" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role} value={role}>{role}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Batal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}