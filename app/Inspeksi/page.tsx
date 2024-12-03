"use client"

import { useState, useEffect } from "react"
import { Search, Eye, Check, X, CheckCircle2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const PaginationEllipsis = () => {
  return <span className="mx-2">...</span>
}

const AlertPopup = ({ type, message, onClose }: { type: 'success' | 'error', message: string, onClose: () => void }) => (
  <div
    className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg max-w-sm w-full mx-4 z-50 flex items-center justify-between
    ${type === 'success' ? 'bg-white border border-green-500' : 'bg-white border border-red-500'} 
    `}
  >
    <div className="flex items-start">
      {type === 'success' ? (
        <CheckCircle2 className="h-8 w-8 text-green-500 mr-3" />
      ) : (
        <XCircle className="h-8 w-8 text-red-500 mr-3" />
      )}
      <div>
        <span className={`text-lg font-bold ${type === 'success' ? 'text-green-700' : 'text-red-700'}`}>
          {type === 'success' ? 'Berhasil' : 'Gagal'}
        </span>
        <p className="text-sm text-gray-400">{message}</p>
      </div>
    </div>
    <button className="text-gray-400 hover:text-gray-600" onClick={onClose}>
      <X className="h-5 w-5" />
    </button>
  </div>
)

const InspeksiPage = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [alert, setAlert] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({ show: false, message: '', type: 'success' })
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [confirmAction, setConfirmAction] = useState<'accept' | 'reject' | null>(null)
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const itemsPerPage = 10

  const assets = [
    { name: "Asset 1", type: "Type A", date: "2024-10-01" },
    { name: "Asset 2", type: "Type B", date: "2024-10-02" },
    { name: "Asset 3", type: "Type A", date: "2024-10-03" },
    { name: "Asset 4", type: "Type C", date: "2024-10-04" },
    { name: "Asset 5", type: "Type B", date: "2024-10-05" },
    { name: "Asset 6", type: "Type A", date: "2024-10-06" },
    { name: "Asset 7", type: "Type C", date: "2024-10-07" },
    { name: "Asset 8", type: "Type B", date: "2024-10-08" },
    { name: "Asset 9", type: "Type A", date: "2024-10-09" },
    { name: "Asset 10", type: "Type C", date: "2024-10-10" },
    { name: "Asset 11", type: "Type B", date: "2024-10-11" },
    { name: "Asset 12", type: "Type A", date: "2024-10-12" },
    { name: "Asset 13", type: "Type C", date: "2024-10-13" },
    { name: "Asset 14", type: "Type B", date: "2024-10-14" },
    { name: "Asset 15", type: "Type A", date: "2024-10-15" },
    { name: "Asset 16", type: "Type C", date: "2024-10-16" },
    { name: "Asset 17", type: "Type B", date: "2024-10-17" },
    { name: "Asset 18", type: "Type A", date: "2024-10-18" },
    { name: "Asset 19", type: "Type C", date: "2024-10-19" },
    { name: "Asset 20", type: "Type B", date: "2024-10-20" },
  ]

  const filteredAssets = assets.filter(asset =>
    asset.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentAssets = filteredAssets.slice(startIndex, endIndex)

  useEffect(() => {
    setCurrentPage(1) // Reset to first page when search term changes
  }, [searchTerm])

  useEffect(() => {
    if (alert.show) {
      const timer = setTimeout(() => {
        setAlert({ show: false, message: '', type: 'success' })
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [alert])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleAccept = (assetName: string) => {
    setSelectedAsset(assetName)
    setConfirmAction('accept')
    setIsConfirmDialogOpen(true)
  }

  const handleReject = (assetName: string) => {
    setSelectedAsset(assetName)
    setConfirmAction('reject')
    setIsConfirmDialogOpen(true)
  }

  const handleConfirm = () => {
    setIsConfirmDialogOpen(false)
    if (confirmAction === 'accept') {
      setAlert({ show: true, message: `${selectedAsset} telah berhasil disimpan`, type: 'success' })
    } else {
      setAlert({ show: true, message: `${selectedAsset} telah ditolak`, type: 'error' })
    }
  }

  const renderPageNumbers = () => {
    const pageNumbers = []
    const leftSiblingIndex = Math.max(1, currentPage - 2)
    const rightSiblingIndex = Math.min(totalPages, currentPage + 2)

    if (leftSiblingIndex > 1) {
      pageNumbers.push(
        <PaginationItem key={1}>
          <PaginationLink href="#" onClick={() => handlePageChange(1)}>
            1
          </PaginationLink>
        </PaginationItem>
      )
      if (leftSiblingIndex > 2) {
        pageNumbers.push(<PaginationEllipsis key="left-ellipsis" />)
      }
    }

    for (let page = leftSiblingIndex; page <= rightSiblingIndex; page++) {
      pageNumbers.push(
        <PaginationItem key={page}>
          <PaginationLink
            href="#"
            onClick={() => handlePageChange(page)}
            isActive={currentPage === page}
          >
            {page}
          </PaginationLink>
        </PaginationItem>
      )
    }

    if (rightSiblingIndex < totalPages) {
      if (rightSiblingIndex < totalPages - 1) {
        pageNumbers.push(<PaginationEllipsis key="right-ellipsis" />)
      }
      pageNumbers.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            href="#"
            onClick={() => handlePageChange(totalPages)}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      )
    }

    return pageNumbers
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 p-2 sm:p-4 md:p-6">
        <div className="rounded-lg shadow-md p-2 sm:p-4 md:p-6 bg-white flex flex-col h-full">
          <div className="mb-4">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-8 w-full"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>

          <div className="flex-1 overflow-x-auto">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead className="text-left">Nama Asset</TableHead>
                  <TableHead className="text-left">Tipe Asset</TableHead>
                  <TableHead className="text-left">Tanggal Masuk</TableHead>
                  <TableHead className="text-left">View</TableHead>
                  <TableHead className="text-left">Terima Barang</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentAssets.map((asset, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Input type="checkbox" className="w-4 h-4" />
                    </TableCell>
                    <TableCell className="whitespace-nowrap">{asset.name}</TableCell>
                    <TableCell className="whitespace-nowrap">{asset.type}</TableCell>
                    <TableCell className="whitespace-nowrap">{asset.date}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Detail
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-full bg-green-500 text-white"
                          onClick={() => handleAccept(asset.name)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-full bg-red-500 text-white"
                          onClick={() => handleReject(asset.name)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="w-full sm:w-1/3 order-3 sm:order-1 text-center sm:text-left">
              <span className="text-sm text-gray-500">
                Halaman {currentPage} dari {totalPages}
              </span>
            </div>
            <div className="w-full sm:w-1/3 order-1 sm:order-2 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    />
                  </PaginationItem>
                  {renderPageNumbers()}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={() =>
                        handlePageChange(Math.min(totalPages, currentPage + 1))
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
            <div className="w-full sm:w-1/3 order-2 sm:order-3"></div>
          </div>
        </div>
      </main>

      {alert.show && (
        <AlertPopup
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ show: false, message: '', type: 'success' })}
        />
      )}

      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirmAction === 'accept' ? 'Simpan Aset' : 'Tolak Aset'}
            </DialogTitle>
            <DialogDescription>
              {confirmAction === 'accept'
                ? 'Apakah Anda yakin ingin menyimpan aset ini?'
                : 'Apakah Anda yakin ingin menolak aset ini?'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>Batal</Button>
            <Button onClick={handleConfirm}>
              {confirmAction === 'accept' ? 'Simpan' : 'Tolak'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default InspeksiPage