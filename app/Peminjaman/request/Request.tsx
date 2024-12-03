'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

type BorrowRequest = {
  id: string
  assetName: string
  borrowerName: string
  borrowDate: string
  returnDate: string
  reason: string
}

// Mock data for demonstration
const initialRequests: BorrowRequest[] = [
  {
    id: '1',
    assetName: 'Laptop',
    borrowerName: 'John Doe',
    borrowDate: '2023-07-01',
    returnDate: '2023-07-15',
    reason: 'For a business trip'
  },
  {
    id: '2',
    assetName: 'Projector',
    borrowerName: 'Jane Smith',
    borrowDate: '2023-07-05',
    returnDate: '2023-07-06',
    reason: 'For a client presentation'
  }
]

export default function BorrowRequests() {
  const [requests, setRequests] = useState<BorrowRequest[]>(initialRequests)

  const handleApprove = (id: string) => {
    setRequests(requests.filter(request => request.id !== id))
  }

  const handleDeny = (id: string) => {
    setRequests(requests.filter(request => request.id !== id))
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <Card key={request.id}>
          <CardHeader>
            <CardTitle>{request.assetName}</CardTitle>
            <CardDescription>Requested by {request.borrowerName}</CardDescription>
          </CardHeader>
          <CardContent>
            <p><strong>Borrow Date:</strong> {request.borrowDate}</p>
            <p><strong>Return Date:</strong> {request.returnDate}</p>
            <p><strong>Reason:</strong> {request.reason}</p>
          </CardContent>
          <CardFooter className="space-x-2">
            <Button onClick={() => handleApprove(request.id)}>Approve</Button>
            <Button variant="outline" onClick={() => handleDeny(request.id)}>Deny</Button>
          </CardFooter>
        </Card>
      ))}
      {requests.length === 0 && (
        <p className="text-center text-muted-foreground">No pending requests</p>
      )}
    </div>
  )
}