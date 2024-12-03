'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { X, Search, Edit, MoreVertical } from 'lucide-react'
import { AlertPopup } from "@/components/ui/alert"

interface Division {
  id: number
  name: string
  description: string
}


export default function DivisionManagement() {
  const [divisions, setDivisions] = useState<Division[]>([
    { id: 1, name: "Human Resources", description: "Manages personnel and workplace culture" },
    { id: 2, name: "Finance", description: "Handles financial planning and accounting" },
    { id: 3, name: "IT", description: "Manages technology infrastructure and support" },
    ...Array.from({ length: 20 }, (_, i) => ({
      id: i + 4,
      name: `Division ${i + 4}`,
      description: `Description for Division ${i + 4}`
    }))
  ])

  const [newDivision, setNewDivision] = useState({ name: '', description: '' })
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [divisionToDelete, setDivisionToDelete] = useState<Division | null>(null)
  const [divisionToEdit, setDivisionToEdit] = useState<Division | null>(null)
  const [alert, setAlert] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({ show: false, message: '', type: 'success' })
  const [errors, setErrors] = useState({ name: '', description: '' })
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearchVisible, setIsSearchVisible] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const totalPages = Math.ceil(divisions.length / itemsPerPage)

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
      setNewDivision({ name: '', description: '' })
      setErrors({ name: '', description: '' })
    }
  }, [isAddDialogOpen])

  useEffect(() => {
    if (isSearchVisible && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isSearchVisible])

  const validateName = (name: string): string => {
    if (name.length < 3) return "Nama divisi harus memiliki minimal 3 karakter"
    if (divisions.some(div => div.name.toLowerCase() === name.toLowerCase())) return "Nama divisi sudah ada"
    return ""
  }

  const validateDescription = (description: string): string => {
    if (description.length < 10) return "Deskripsi harus memiliki minimal 10 karakter"
    return ""
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewDivision({ ...newDivision, [name]: value })
    
    if (name === 'name') {
      setErrors({ ...errors, name: validateName(value) })
    } else if (name === 'description') {
      setErrors({ ...errors, description: validateDescription(value) })
    }
  }

  const handleAddDivision = () => {
    const nameError = validateName(newDivision.name)
    const descriptionError = validateDescription(newDivision.description)

    setErrors({
      name: nameError,
      description: descriptionError
    })

    if (!nameError && !descriptionError) {
      const newDivisionWithId = { ...newDivision, id: Date.now() }
      setDivisions([newDivisionWithId, ...divisions])
      setNewDivision({ name: '', description: '' })
      setIsAddDialogOpen(false)
      setAlert({ show: true, message: `Divisi ${newDivision.name} telah berhasil ditambahkan`, type: 'success' })
    }
  }

  const handleDeleteDivision = (division: Division) => {
    setDivisionToDelete(division)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (divisionToDelete) {
      setDivisions(divisions.filter(div => div.id !== divisionToDelete.id))
      setAlert({ show: true, message: `Divisi ${divisionToDelete.name} telah berhasil dihapus`, type: 'success' })
      setDivisionToDelete(null)
      setIsDeleteDialogOpen(false)
    }
  }

  const handleEditDivision = (division: Division) => {
    setDivisionToEdit(division)
    setIsEditDialogOpen(true)
  }

  const confirmEdit = (newName: string, newDescription: string) => {
    if (divisionToEdit) {
      setDivisions(divisions.map(div => 
        div.id === divisionToEdit.id ? { ...div, name: newName, description: newDescription } : div
      ))
      setAlert({ show: true, message: `Divisi ${divisionToEdit.name} telah berhasil diubah`, type: 'success' })
      setDivisionToEdit(null)
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

  const filteredDivisions = divisions.filter(division =>
    division.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    division.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const paginatedDivisions = filteredDivisions.slice(
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
      <h1 className="text-2xl font-bold mb-4">Daftar Divisi</h1>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <div className="relative w-full sm:w-64 mb-4 sm:mb-0">
          <div className="hidden sm:block">
            <Input
              type="text"
              placeholder="Cari divisi..."
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
                  placeholder="Cari divisi..."
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
            <Button className="w-full sm:w-auto">Tambah Divisi</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Divisi Baru</DialogTitle>
              <DialogDescription>
                Masukkan informasi divisi baru di sini.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nama Divisi
                </Label>
                <div className="col-span-3">
                  <Input
                    id="name"
                    name="name"
                    value={newDivision.name}
                    onChange={handleInputChange}
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Deskripsi
                </Label>
                <div className="col-span-3">
                  <Input
                    id="description"
                    name="description"
                    value={newDivision.description}
                    onChange={handleInputChange}
                    className={errors.description ? "border-red-500" : ""}
                  />
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddDivision}>Tambah Divisi</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Divisi</TableHead>
              <TableHead className="hidden sm:table-cell">Deskripsi</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedDivisions.map((division) => (
              <TableRow key={division.id}>
                <TableCell>{division.name}</TableCell>
                <TableCell className="hidden sm:table-cell">{division.description}</TableCell>
                <TableCell className="text-right">
                  <div className="hidden sm:block">
                    <Button variant="outline" size="sm" className="mr-2" onClick={() => handleEditDivision(division)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteDivision(division)}>
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
                        <DropdownMenuItem onClick={() => handleEditDivision(division)}>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteDivision(division)}>
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
              Apakah Anda yakin ingin menghapus divisi ini?
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
            <DialogTitle>Edit Divisi</DialogTitle>
            <DialogDescription>
              Ubah informasi untuk divisi {divisionToEdit?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Nama Divisi
              </Label>
              <Input
                id="edit-name"
                defaultValue={divisionToEdit?.name}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-description" className="text-right">
                Deskripsi
              </Label>
              <Input
                id="edit-description"
                defaultValue={divisionToEdit?.description}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={() => {
              const newName = (document.getElementById('edit-name') as HTMLInputElement).value
              const newDescription = (document.getElementById('edit-description') as HTMLInputElement).value
              confirmEdit(newName, newDescription)
            }}>
              Simpan Perubahan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}