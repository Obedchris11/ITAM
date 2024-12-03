"use client"

import { useState } from "react"
import { ArrowDownIcon, ArrowUpIcon, BoxIcon, PackageIcon, FileIcon, QrCode, Search } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export default function DashboardPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const summaryCards = [
    { title: "Aset Masuk", value: "892711", icon: <ArrowDownIcon className="h-4 w-4 sm:h-6 sm:w-6" />, color: "bg-blue-100 text-blue-600" },
    { title: "Aset Keluar", value: "892711", icon: <ArrowUpIcon className="h-4 w-4 sm:h-6 sm:w-6" />, color: "bg-blue-100 text-blue-600" },
    { title: "Stok Aset", value: "892711", icon: <BoxIcon className="h-4 w-4 sm:h-6 sm:w-6" />, color: "bg-blue-100 text-blue-600" },
    { title: "Aset dibalikan", value: "80", icon: <PackageIcon className="h-4 w-4 sm:h-6 sm:w-6" />, color: "bg-blue-100 text-blue-600" },
    { title: "Software dimiliki", value: "100", icon: <FileIcon className="h-4 w-4 sm:h-6 sm:w-6" />, color: "bg-blue-100 text-blue-600" },
    { title: "Software Diinstal", value: "50", icon: <ArrowDownIcon className="h-4 w-4 sm:h-6 sm:w-6" />, color: "bg-blue-100 text-blue-600" },
  ]

  const assets = [
    { department: "Technology Department", sn: "NA8761", device: "Lenovo", date: "20 Mei 2024" },
    { department: "Technology Department", sn: "KA10902", device: "Data perangkat", date: "20 mei 2024" },
    { department: "Technology Department", sn: "YY121233", device: "Data perangkat", date: "20 Mei 2024" },
    { department: "Technology Department", sn: "MN1293", device: "Data perangkat", date: "20 Mei 2024" },
    { department: "Technology Department", sn: "KA928121", device: "Data perangkat", date: "20 Mei 2024" },
    { department: "Technology Department", sn: "JA191298", device: "Data perangkat", date: "19 Mei 2024" },
    { department: "Technology Department", sn: "AK1273892", device: "Data perangkat", date: "19 Mei 2024" },
    { department: "Technology Department", sn: "BL567890", device: "Data perangkat", date: "18 Mei 2024" },
    { department: "Technology Department", sn: "CM234567", device: "Data perangkat", date: "18 Mei 2024" },
    { department: "Technology Department", sn: "DN890123", device: "Data perangkat", date: "17 Mei 2024" },
    { department: "Technology Department", sn: "EO456789", device: "Data perangkat", date: "17 Mei 2024" },
    { department: "Technology Department", sn: "FP012345", device: "Data perangkat", date: "16 Mei 2024" },
  ]

  const totalPages = Math.ceil(assets.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentAssets = assets.slice(startIndex, endIndex)

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
              onClick={() => handlePageChange(i)}
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
            <PaginationLink href="#" onClick={() => handlePageChange(1)}>
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
                onClick={() => handlePageChange(i)}
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
            <PaginationLink href="#" onClick={() => handlePageChange(totalPages)}>
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
                onClick={() => handlePageChange(i)}
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
            <PaginationLink href="#" onClick={() => handlePageChange(totalPages)}>
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        )
      } else {
        pageNumbers.push(
          <PaginationItem key={1}>
            <PaginationLink href="#" onClick={() => handlePageChange(1)}>
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
                onClick={() => handlePageChange(i)}
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
    <div className="p-2 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold">Welcome to</h1>
      
      <div className="grid gap-2 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <div className="col-span-1 sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
          {summaryCards.slice(0, 2).map((card, index) => (
            <Card key={index} className="col-span-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">{card.title}</CardTitle>
                <div className={`p-1 sm:p-2 rounded-full ${card.color}`}>
                  {card.icon}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-2xl font-bold">{card.value}</div>
                <Button variant="default" size="sm" className="mt-2 bg-blue-600 text-white text-xs sm:text-sm">
                  Detail
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="col-span-1 sm:col-span-2 lg:col-span-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 sm:gap-4">
          {summaryCards.slice(2, 4).map((card, index) => (
            <Card key={index} className="col-span-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">{card.title}</CardTitle>
                <div className={`p-1 sm:p-2 rounded-full ${card.color}`}>
                  {card.icon}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-2xl font-bold">{card.value}</div>
                {index === 1 && (
                  <Button variant="default" size="sm" className="mt-2 bg-blue-600 text-white text-xs sm:text-sm">
                    Detail
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="col-span-1 sm:col-span-2 lg:col-span-1 row-span-2 flex flex-col">
          <CardHeader>
            <CardTitle className="text-sm sm:text-base">SCAN</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col items-center justify-center">
            <div className="w-[100px] h-[100px] sm:w-[150px] sm:h-[150px] bg-gray-200 flex items-center justify-center">
              <QrCode className="w-16 h-16 sm:w-24 sm:h-24 text-gray-400" />
            </div>
            <p className="text-center text-xs sm:text-sm text-gray-500 mt-2 sm:mt-4">Keterangan</p>
          </CardContent>
        </Card>
        <div className="col-span-1 sm:col-span-2 lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
          {summaryCards.slice(4).map((card, index) => (
            <Card key={index} className="col-span-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">{card.title}</CardTitle>
                <div className={`p-1 sm:p-2 rounded-full ${card.color}`}>
                  {card.icon}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-2xl font-bold">{card.value}</div>
                <Button variant="default" size="sm" className="mt-2 bg-blue-600 text-white text-xs sm:text-sm">
                  Detail
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm sm:text-base">Recent Assets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input type="search" placeholder="Search..." className="pl-8 w-full text-xs sm:text-sm" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead className="text-xs sm:text-sm">Nomor Asset</TableHead>
                  <TableHead className="text-xs sm:text-sm">S/N</TableHead>
                  <TableHead className="text-xs sm:text-sm">Data Perangkat</TableHead>
                  <TableHead className="text-xs sm:text-sm">Cetak Barcode</TableHead>
                  <TableHead className="text-xs sm:text-sm">Tanggal Masuk</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentAssets.map((asset, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Input type="checkbox" className="w-4 h-4" />
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm">{asset.department}</TableCell>
                    <TableCell className="text-xs sm:text-sm">{asset.sn}</TableCell>
                    <TableCell className="text-xs sm:text-sm">{asset.device}</TableCell>
                    <TableCell>
                      <Button variant="link" size="sm" className="text-xs sm:text-sm">
                        Link
                      </Button>
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm">{asset.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 flex flex-col items-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={() => 
                      handlePageChange(Math.max(1, currentPage - 1))
                    }
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
            <div className="w-full text-right text-xs sm:text-sm text-gray-500 mt-2">
              Halaman {currentPage} dari {totalPages}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}