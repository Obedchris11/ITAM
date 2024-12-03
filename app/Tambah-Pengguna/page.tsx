'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Briefcase } from 'lucide-react'
import DivisionManagement from './divisi'
import UserManagement from './pengguna'

export default function ManagementPage() {
  return (
    <div className="container mx-auto p-4">
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="users" className="flex items-center justify-center">
            <Users className="h-4 w-4 mr-2" />
            Pengguna
          </TabsTrigger>
          <TabsTrigger value="divisions" className="flex items-center justify-center">
            <Briefcase className="h-4 w-4 mr-2" />
            Divisi
          </TabsTrigger>
        </TabsList>
        <TabsContent value="users">
          <UserManagement />
        </TabsContent>
        <TabsContent value="divisions">
          <DivisionManagement />
        </TabsContent>
      </Tabs>
    </div>
  )
}