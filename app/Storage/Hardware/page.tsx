'use client'

import * as React from "react"
import { Eye } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

const allData = Array.from({ length: 50 }).map((_, i) => ({
  id: i + 1,
  nomorAsset: `Asset-${i + 1}`,
  serialNumber: `SN-${i + 1}`,
  dataPerangkat: `Device-${i + 1}`,
  cetakBarcode: `BC-${i + 1}`,
  divisiPengguna: `Division-${i + 1}`,
}))

const ITEMS_PER_PAGE = 10

export default function Component() {
  const [currentPage, setCurrentPage] = React.useState(1)
  const [searchQuery, setSearchQuery] = React.useState("")

  const filteredData = allData.filter((item) =>
    Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  )

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentData = filteredData.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const renderPageNumbers = () => {
    const pageNumbers = []
    const maxVisiblePages = 5
    const ellipsis = <PaginationEllipsis />

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault()
                handlePageChange(i)
              }}
              isActive={currentPage === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        )
      }
    } else {
      const leftSide = Math.floor(maxVisiblePages / 2)
      const rightSide = maxVisiblePages - leftSide

      if (currentPage > leftSide && currentPage < totalPages - rightSide + 1) {
        pageNumbers.push(
          <PaginationItem key={1}>
            <PaginationLink href="#" onClick={(e) => {
              e.preventDefault()
              handlePageChange(1)
            }}>
              1
            </PaginationLink>
          </PaginationItem>
        )
        pageNumbers.push(ellipsis)

        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(
            <PaginationItem key={i}>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  handlePageChange(i)
                }}
                isActive={currentPage === i}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          )
        }

        pageNumbers.push(ellipsis)
        pageNumbers.push(
          <PaginationItem key={totalPages}>
            <PaginationLink href="#" onClick={(e) => {
              e.preventDefault()
              handlePageChange(totalPages)
            }}>
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        )
      } else if (currentPage <= leftSide) {
        for (let i = 1; i <= maxVisiblePages - 1; i++) {
          pageNumbers.push(
            <PaginationItem key={i}>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  handlePageChange(i)
                }}
                isActive={currentPage === i}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          )
        }
        pageNumbers.push(ellipsis)
        pageNumbers.push(
          <PaginationItem key={totalPages}>
            <PaginationLink href="#" onClick={(e) => {
              e.preventDefault()
              handlePageChange(totalPages)
            }}>
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        )
      } else {
        pageNumbers.push(
          <PaginationItem key={1}>
            <PaginationLink href="#" onClick={(e) => {
              e.preventDefault()
              handlePageChange(1)
            }}>
              1
            </PaginationLink>
          </PaginationItem>
        )
        pageNumbers.push(ellipsis)
        for (let i = totalPages - maxVisiblePages + 2; i <= totalPages; i++) {
          pageNumbers.push(
            <PaginationItem key={i}>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  handlePageChange(i)
                }}
                isActive={currentPage === i}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          )
        }
      }
    }
    return pageNumbers
  }

  return (
    <div className="w-full space-y-4 p-4">
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Search..."
          className="max-w-sm"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setCurrentPage(1)
          }}
        />
      </div>
      <ScrollArea className="w-full whitespace-nowrap rounded-md border">
        <div className="relative">
          <Table className="min-w-[800px]">
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-16">No</TableHead>
                <TableHead>Nomor Asset</TableHead>
                <TableHead>S/n</TableHead>
                <TableHead>Data Perangkat</TableHead>
                <TableHead>Cetak Barcode</TableHead>
                <TableHead>Divisi Pengguna</TableHead>
                <TableHead className="sticky right-0 bg-muted/50 w-24">
                  Lihat
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.nomorAsset}</TableCell>
                  <TableCell>{item.serialNumber}</TableCell>
                  <TableCell>{item.dataPerangkat}</TableCell>
                  <TableCell>{item.cetakBarcode}</TableCell>
                  <TableCell>{item.divisiPengguna}</TableCell>
                  <TableCell className="sticky right-0 bg-white">
                    <Button
                      variant="default"
                      className="w-full bg-[#1D4ED8] hover:bg-[#1D4ED8] text-white transition-colors"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Detail
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              href="#" 
              onClick={(e) => {
                e.preventDefault()
                if (currentPage > 1) handlePageChange(currentPage - 1)
              }} 
            />
          </PaginationItem>
          {renderPageNumbers()}
          <PaginationItem>
            <PaginationNext 
              href="#" 
              onClick={(e) => {
                e.preventDefault()
                if (currentPage < totalPages) handlePageChange(currentPage + 1)
              }} 
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}