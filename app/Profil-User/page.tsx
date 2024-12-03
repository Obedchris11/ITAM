'use client'

import { useState, useMemo, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, CheckCircle2, XCircle, X } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface UserData {
  name: string;
  email: string;
  username: string;
  password: string;
  role: string;
}

const AlertPopup = ({ type, message }: { type: 'success' | 'error', message: string }) => (
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
    <button className="text-gray-400 hover:text-gray-600">
      <X className="h-5 w-5" />
    </button>
  </div>
)

const fetchUserData = async (): Promise<UserData> => {
  // Simulating API call
  return new Promise(resolve => setTimeout(() => resolve({
    name: 'John Doe',
    email: 'john.doe@example.com',
    username: 'johndoe',
    password: 'password123',
    role: 'Admin'
  }), 1000))
}

export default function UserProfile() {
  const [userData, setUserData] = useState<UserData>({
    name: '',
    email: '',
    username: '',
    password: '',
    role: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  const router = useRouter()

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const fetchedUserData = await fetchUserData()
        setUserData(fetchedUserData)
        setIsLoading(false)
      } catch (error) {
        console.error('Failed to load user data:', error)
        setAlert({
          type: 'error',
          message: "Failed to load user data. Please try again later."
        })
        setIsLoading(false)
      }
    }

    loadUserData()
  }, [])

  const initials = useMemo(() => {
    return userData.name
      .split(' ')
      .map(word => word[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()
  }, [userData.name])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUserData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userData.name.trim()) {
      setAlert({
        type: 'error',
        message: "Name cannot be empty."
      })
      return
    }
    
    // Here you would typically make an API call to save the data
    console.log('Saving profile changes:', userData)
    
    setAlert({
      type: 'success',
      message: "Profile updated successfully."
    })

    // Update the header icon
    localStorage.setItem('userInitials', initials)

    // Navigate back to the dashboard after a short delay
    setTimeout(() => {
      router.push('/Dashboard')
    }, 2000)
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleBack = () => {
    router.push('/Dashboard')
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100 relative">
      {alert && <AlertPopup type={alert.type} message={alert.message} />}
      <div className="h-32 bg-blue-600 relative">
        <Button
          onClick={handleBack}
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 text-white hover:bg-blue-700 transition-colors"
          aria-label="Back to Dashboard"
        >
          <X className="h-6 w-6" />
        </Button>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
          <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-2xl font-bold text-blue-600 border-4 border-blue-600">
            {initials}
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 pt-20 pb-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Profile Information</CardTitle>
            <p className="text-gray-600">Update your profile information below.</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <Input
                  id="name"
                  name="name"
                  value={userData.name}
                  onChange={handleInputChange}
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={userData.email}
                  onChange={handleInputChange}
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <Input
                  id="username"
                  name="username"
                  value={userData.username}
                  onChange={handleInputChange}
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={userData.password}
                    onChange={handleInputChange}
                    className="pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <Eye className="h-5 w-5" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <Input
                  id="role"
                  name="role"
                  value={userData.role}
                  className="mt-1 bg-gray-100"
                  disabled
                />
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                SAVE
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}