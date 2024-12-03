'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

type AssetRequest = {
  id: string
  assetName: string
  borrowerName: string
  borrowDate: string
  returnDate: string
  department: string
  status: 'pending' | 'approved' | 'rejected'
}

// Mock data for demonstration
const initialRequests: AssetRequest[] = [
  {
    id: '1',
    assetName: 'High-Performance Laptop',
    borrowerName: 'John Doe',
    borrowDate: '2023-07-01',
    returnDate: '2023-07-15',
    department: 'Engineering',
    status: 'pending'
  },
  {
    id: '2',
    assetName: '4K Projector',
    borrowerName: 'Jane Smith',
    borrowDate: '2023-07-05',
    returnDate: '2023-07-06',
    department: 'Sales',
    status: 'pending'
  },
  {
    id: '3',
    assetName: 'Conference Room A',
    borrowerName: 'Mike Johnson',
    borrowDate: '2023-07-10',
    returnDate: '2023-07-11',
    department: 'Marketing',
    status: 'pending'
  }
]

export default function ExecutiveApprovalPage() {
  const [requests, setRequests] = useState<AssetRequest[]>(initialRequests)

  const handleApprove = (id: string) => {
    setRequests(requests.map(request => 
      request.id === id ? { ...request, status: 'approved' } : request
    ))
    // toast({
    //   title: "Request approved",
    //   description: "The asset request has been approved.",
    // })
  }

  const handleReject = (id: string) => {
    setRequests(requests.map(request => 
      request.id === id ? { ...request, status: 'rejected' } : request
    ))
    // toast({
    //   title: "Request rejected",
    //   description: "The asset request has been rejected.",
    // })
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Operator Asset Approval</h1>
      <Card>
        <CardHeader>
          <CardTitle>Pending Asset Requests</CardTitle>
          <CardDescription>Review and approve asset requests that have passed initial screening.</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-4">
              {requests.map((request) => (
                <Card key={request.id}>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>{request.assetName}</CardTitle>
                      <Badge variant={request.status === 'pending' ? 'outline' : request.status === 'approved' ? 'default' : 'destructive'}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </Badge>
                    </div>
                    <CardDescription>Requested by {request.borrowerName} ({request.department})</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p><strong>Borrow Date:</strong> {request.borrowDate}</p>
                    <p><strong>Return Date:</strong> {request.returnDate}</p>
                  </CardContent>
                  <CardFooter className="space-x-2">
                    {request.status === 'pending' && (
                      <>
                        <Button onClick={() => handleApprove(request.id)}>Approve</Button>
                        <Button variant="outline" onClick={() => handleReject(request.id)}>Reject</Button>
                      </>
                    )}
                    {request.status !== 'pending' && (
                      <p className="text-sm text-muted-foreground">
                        This request has been {request.status}.
                      </p>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}



//form pinjam

// 'use client'

// import { useState, useEffect } from 'react'
// import { Plus } from 'lucide-react'
// import { Button } from "@/components/ui/button"
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table"
// import Link from "next/link"

// interface BorrowingRequest {
//   id: string;
//   asset: string;
//   borrower: string;
//   borrowDate: string;
//   returnDate: string;
//   status: string;
// }

// export default function BorrowingListPage() {
//   const [borrowings, setBorrowings] = useState<BorrowingRequest[]>([])

//   useEffect(() => {
//     // Fetch borrowing requests directly from backend
//     fetch('https://your-backend-api.com/borrowing-requests')
//       .then(response => response.json())
//       .then(data => setBorrowings(data))
//       .catch(error => console.error('Error fetching borrowing requests:', error))
//   }, [])

//   return (
//     <div className="container mx-auto py-10">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">Asset Borrowing Requests</h1>
//         <Link href="/form-pinjam/new">
//           <Button>
//             <Plus className="mr-2 h-4 w-4" /> New Borrowing Request
//           </Button>
//         </Link>
//       </div>
//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead>Asset</TableHead>
//             <TableHead>Borrower</TableHead>
//             <TableHead>Borrow Date</TableHead>
//             <TableHead>Return Date</TableHead>
//             <TableHead>Status</TableHead>
//             <TableHead>Actions</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {borrowings.map((borrowing) => (
//             <TableRow key={borrowing.id}>
//               <TableCell>{borrowing.asset}</TableCell>
//               <TableCell>{borrowing.borrower}</TableCell>
//               <TableCell>{borrowing.borrowDate}</TableCell>
//               <TableCell>{borrowing.returnDate}</TableCell>
//               <TableCell>{borrowing.status}</TableCell>
//               <TableCell>
//                 <Link href={`/form-pinjam/${borrowing.id}`}>
//                   <Button variant="outline" size="sm">View</Button>
//                 </Link>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </div>
//   )
// }