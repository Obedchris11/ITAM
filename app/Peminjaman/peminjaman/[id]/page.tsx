'use client'

import { useState, useRef, useEffect } from "react"
import { ChevronLeft, MoreVertical, Plus, Upload, X, FileText } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AlertPopup } from "@/components/ui/alert"
import Link from "next/link"
import { useRouter } from 'next/navigation'

interface Employee {
  id: number;
  name: string;
  department: string;
}

interface Asset {
  id: number;
  name: string;
}

interface AssetItem {
  id: string;
  name: string;
  owner: string;
}

interface UploadedFile {
  name: string;
  size: number;
  type: string;
}

const employees: Employee[] = [
  { id: 1, name: "John Doe", department: "IT Department" },
  { id: 2, name: "Jane Smith", department: "Design Team" },
  { id: 3, name: "Mike Johnson", department: "Engineering" },
]

const employeeAssets: { [key: number]: Asset[] } = {
  1: [
    { id: 1, name: "Apple Macbook Pro 16\" M2" },
    { id: 2, name: "Logitech MX Master 3" },
  ],
  2: [
    { id: 3, name: "Apple Studio Display screen" },
    { id: 4, name: "Herman Miller Aeron Chair" },
  ],
  3: [
    { id: 5, name: "Dell XPS 15" },
    { id: 6, name: "HP Elite Display" },
  ],
}

export default function AssetBorrowingPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const isNewRequest = params.id === 'new'
  
  const [activeTab, setActiveTab] = useState("list-items")
  const [borrowDate, setBorrowDate] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [reason, setReason] = useState('')
  const [assetItems, setAssetItems] = useState<AssetItem[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [filteredEmployees, setFilteredEmployees] = useState(employees)
  const [availableAssets, setAvailableAssets] = useState<Asset[]>([])
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [showAlert, setShowAlert] = useState(false)
  const [alertType, setAlertType] = useState<'success' | 'error'>('error')
  const [alertMessage, setAlertMessage] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!isNewRequest) {
      fetch(`https://your-backend-api.com/borrowing-requests/${params.id}`)
        .then(response => response.json())
        .then(data => {
          setSelectedEmployee(data.employee)
          setAssetItems(data.assetItems)
          setBorrowDate(data.borrowDate)
          setReturnDate(data.returnDate)
          setReason(data.reason)
          setUploadedFiles(data.uploadedFiles)
        })
        .catch(error => {
          console.error('Error fetching borrowing request:', error)
          setAlertType('error')
          setAlertMessage('Failed to load borrowing request data.')
          setShowAlert(true)
        })
    }
  }, [isNewRequest, params.id])

  useEffect(() => {
    const filtered = employees.filter(employee =>
      employee.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setFilteredEmployees(filtered)
  }, [searchQuery])

  const handleBackClick = () => {
    router.push('/form-pinjam')
  }

  const handleSelectEmployee = (employee: Employee) => {
    setSelectedEmployee(employee)
    setAvailableAssets(employeeAssets[employee.id])
    setSearchQuery('')
  }

  const handleAddAsset = (selectedAsset: Asset) => {
    if (!selectedEmployee) return
    const newId = Date.now().toString()
    setAssetItems(prevItems => [...prevItems, { id: newId, name: selectedAsset.name, owner: selectedEmployee.name }])
    setAvailableAssets(prevAssets => prevAssets.filter(asset => asset.id !== selectedAsset.id))
  }

  const handleRemoveAsset = (id: string) => {
    const removedAsset = assetItems.find(item => item.id === id)
    setAssetItems(prevItems => prevItems.filter(item => item.id !== id))
    if (removedAsset && selectedEmployee) {
      setAvailableAssets(prevAssets => [...prevAssets, { id: parseInt(id), name: removedAsset.name }])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = {
      id: isNewRequest ? null : params.id,
      employee: selectedEmployee,
      assetItems,
      borrowDate,
      returnDate,
      reason,
      uploadedFiles,
    }

    const url = isNewRequest 
      ? 'https://your-backend-api.com/borrowing-requests' 
      : `https://your-backend-api.com/borrowing-requests/${params.id}`

    fetch(url, {
      method: isNewRequest ? 'POST' : 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then(response => response.json())
      .then(data => {
        setAlertType('success')
        setAlertMessage(isNewRequest ? 'Borrowing request created successfully.' : 'Borrowing request updated successfully.')
        setShowAlert(true)
        setTimeout(() => router.push('/form-pinjam'), 2000)
      })
      .catch(error => {
        console.error('Error saving borrowing request:', error)
        setAlertType('error')
        setAlertMessage('An error occurred while saving the borrowing request.')
        setShowAlert(true)
      })
  }

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return

    const newFiles: UploadedFile[] = []
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain'
    ]
    const maxSize = 10 * 1024 * 1024 // 10MB

    Array.from(files).forEach(file => {
      if (!allowedTypes.includes(file.type)) {
        setAlertType('error')
        setAlertMessage(`${file.name} is not a valid document type.`)
        setShowAlert(true)
        return
      }
      if (file.size > maxSize) {
        setAlertType('error')
        setAlertMessage(`${file.name} exceeds the 10MB size limit.`)
        setShowAlert(true)
        return
      }
      newFiles.push({
        name: file.name,
        size: file.size,
        type: file.type
      })
    })

    if (newFiles.length > 0) {
      setUploadedFiles(prevFiles => [...prevFiles, ...newFiles])
      setAlertType('success')
      setAlertMessage(`${newFiles.length} file(s) uploaded successfully.`)
      setShowAlert(true)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    const files = e.dataTransfer.files
    handleFileUpload(files)
  }

  const handleAddNewClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    handleFileUpload(files)
  }

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(prevFiles => prevFiles.filter((_, i) => i !== index))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {showAlert && (
        <AlertPopup
          type={alertType}
          message={alertMessage}
          onClose={() => setShowAlert(false)}
        />
      )}
      <div className="border-b bg-white px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={handleBackClick}>
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold">
                {isNewRequest ? 'New Asset Borrowing Request' : 'Edit Asset Borrowing Request'}
              </h1>
              <div className="flex items-center gap-3 text-sm">
                {!isNewRequest && <span className="text-gray-500">ID: {params.id}</span>}
                <span className="rounded bg-yellow-100 px-2 py-0.5 text-yellow-700">
                  {isNewRequest ? 'DRAFT' : 'EDITING'}
                </span>
                <span className="text-gray-500">{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="flex">
        <div className="flex-1 px-4 py-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="border-b px-0 pb-0">
              <TabsTrigger value="list-items" className="rounded-none border-b-2 border-transparent px-4 pb-2 pt-2 data-[state=active]:border-primary">
                ASSET DETAILS
              </TabsTrigger>
              <TabsTrigger value="description" className="rounded-none border-b-2 border-transparent px-4 pb-2 pt-2 data-[state=active]:border-primary">
                DESCRIPTION
              </TabsTrigger>
              <TabsTrigger value="files" className="rounded-none border-b-2 border-transparent px-4 pb-2 pt-2 data-[state=active]:border-primary">
                FILES
              </TabsTrigger>
            </TabsList>

            <TabsContent value="list-items" className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-6">
                    {!selectedEmployee && (
                      <div className="relative">
                        <Label htmlFor="employeeSearch">Search for an employee</Label>
                        <Input
                          id="employeeSearch"
                          ref={searchInputRef}
                          placeholder="Type employee name..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full mt-1"
                        />
                        {searchQuery && (
                          <div className="absolute z-10 mt-1 w-full rounded-md border bg-white shadow-lg">
                            {filteredEmployees.length === 0 ? (
                              <div className="px-4 py-2 text-sm text-gray-500">No employee found.</div>
                            ) : (
                              <ul className="max-h-60 overflow-auto py-1">
                                {filteredEmployees.map((employee) => (
                                  <li
                                    key={employee.id}
                                    onClick={() => handleSelectEmployee(employee)}
                                    className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                                  >
                                    {employee.name} - {employee.department}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {selectedEmployee && (
                      <div className="bg-gray-100 p-4 rounded-lg">
                        <p className="font-medium">{selectedEmployee.name}</p>
                        <p className="text-sm text-gray-500">{selectedEmployee.department}</p>
                      </div>
                    )}

                    {assetItems.length > 0 && (
                      <div className="space-y-4">
                        {assetItems.map((item) => (
                          <div key={item.id} className="flex items-center gap-4 rounded-lg border p-4">
                            <div className="flex-1">
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-gray-500">Owner: {item.owner}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveAsset(item.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}

                    {selectedEmployee && availableAssets.length > 0 && (
                      <div>
                        <Label htmlFor="assetSelect">Select an asset to borrow</Label>
                        <select
                          id="assetSelect"
                          onChange={(e) => {
                            const selectedAsset = availableAssets.find(asset => asset.id.toString() === e.target.value)
                            if (selectedAsset) handleAddAsset(selectedAsset)
                          }}
                          className="w-full mt-1 p-2 border rounded-md"
                          value=""
                        >
                          <option value="" disabled>Select an asset</option>
                          {availableAssets.map((asset) => (
                            <option key={asset.id} value={asset.id}>
                              {asset.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="borrowDate">Borrow Date</Label>
                      <Input 
                        id="borrowDate" 
                        type="date" 
                        value={borrowDate} 
                        onChange={(e) => setBorrowDate(e.target.value)} 
                        required 
                      />
                    </div>
                    <div>
                      <Label htmlFor="returnDate">Return Date</Label>
                      <Input 
                        id="returnDate" 
                        type="date" 
                        value={returnDate} 
                        onChange={(e) => setReturnDate(e.target.value)} 
                        required 
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="description" className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <Label htmlFor="reason">Reason for Borrowing</Label>
                  <Textarea 
                    id="reason" 
                    value={reason} 
                    onChange={(e) => setReason(e.target.value)} 
                    required 
                    className="mt-2"
                    rows={4}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="files" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Files</h2>
                <Button variant="outline" size="sm" onClick={handleAddNewClick}>
                  Add new
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileInputChange}
                  multiple
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                />
              </div>
              <div
                className="rounded-lg border-2 border-dashed p-8"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-8 w-8 text-gray-400" />
                  <p className="text-sm text-gray-500">Drag & drop file here or upload</p>
                  <p className="text-xs text-gray-400">Max file size: 10MB. Allowed types: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT</p>
                </div>
              </div>
              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-white p-2 rounded-md shadow-sm">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-500" />
                        <span className="text-sm">{file.name}</span>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => handleRemoveFile(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <div className="w-80 border-l bg-white px-4 py-6">
          <div className="space-y-6">
            <div>
              <h2 className="font-semibold">STATUS</h2>
              <span className="mt-1 inline-block rounded bg-yellow-100 px-2 py-0.5 text-sm text-yellow-700">
                {isNewRequest ? 'Draft' : 'Editing'}
              </span>
            </div>

            <div>
              <h2 className="font-semibold">REQUESTOR</h2>
              <div className="mt-2 flex items-center gap-2">
                <div>
                  <p className="text-sm font-medium">{selectedEmployee?.name || 'Not selected'}</p>
                  <p className="text-xs text-gray-500">{selectedEmployee?.department || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="font-semibold">DEPARTMENT</h2>
              <p className="mt-1 text-sm">{selectedEmployee?.department || 'N/A'}</p>
            </div>
          </div>

          <div className="mt-8">
            <Button className="w-full" onClick={handleSubmit}>
              {isNewRequest ? 'Submit Borrowing Request' : 'Update Borrowing Request'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}