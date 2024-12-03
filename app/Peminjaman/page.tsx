'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import BorrowForm from "./peminjaman/form-pinjam"
import BorrowRequests from "./request/Request"

export default function AssetBorrowingPage() {
  const [activeTab, setActiveTab] = useState('borrow')

  return (
    <div className="p-3">
      <Card>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="borrow">Borrow Asset</TabsTrigger>
              <TabsTrigger value="lend">Lend Asset</TabsTrigger>
            </TabsList>
            <TabsContent value="borrow">
              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-4">Borrow an Asset</h2>
                <BorrowForm />
              </div>
            </TabsContent>
            <TabsContent value="lend">
              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-4">Asset Lending Requests</h2>
                <BorrowRequests />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}