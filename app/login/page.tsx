'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import Cookies from 'js-cookie'

// Define the type for the API response
type LoginApiResponse = {
  success: boolean;
  token?: string;
}

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    const authToken = Cookies.get('authToken')
    if (authToken) {
      router.push('/Dashboard')
    }
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const response = await mockLoginApi(username, password)
      if (response.success && response.token) {
        // cookie 
        Cookies.set('authToken', response.token, { expires: 1, secure: true, sameSite: 'strict' }) // 1 day
        router.push('/Dashboard')
      } else {
        setError('Invalid username or password')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    }
  }

  // Mock API call with proper typing
  const mockLoginApi = async (username: string, password: string): Promise<LoginApiResponse> => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    if (username === 'admin' && password === '123') {
      return { success: true, token: 'mock-auth-token' }
    }
    return { success: false }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 via-blue-200 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-3xl shadow-xl overflow-hidden max-w-5xl w-full flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 p-8 bg-white bg-opacity-50">
          <div className="mb-8">
            <Image
              src="/public/foto/logokecil.png"
              alt="Company Logo"
              width={250}
              height={40}
              className="max-w-full h-auto"
            />
          </div>
          <p className="text-gray-700 mb-4">Welcome back !!!</p>
          <h2 className="text-4xl font-bold mb-6 text-gray-800">Log In</h2>
          {error && <p className="text-red-500 mb-4" role="alert">{error}</p>}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="username" className="text-sm font-medium text-gray-700">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 bg-white bg-opacity-50"
                required
              />
            </div>
            <div>
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
                <a href="#" className="text-xs text-blue-500 hover:underline">Forgot Password?</a>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 bg-white bg-opacity-50 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-full transition duration-300 ease-in-out transform hover:scale-105">
              LOGIN
            </Button>
          </form>
        </div>
        <div className="hidden md:block w-1/2 relative">
          <div className="absolute inset-0 bg-blue-100 bg-opacity-50"></div>
          <Image
            src="/publicFoto/logotutup.png"
            alt="Company logo"
            layout="fill"
            objectFit="cover"
          />
        </div>
      </div>
    </div>
  )
}