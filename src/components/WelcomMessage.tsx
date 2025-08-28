"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Sparkles, Rocket, X } from "lucide-react"
import { Link, NavLink } from "react-router-dom"

interface WelcomeMessageProps {
  userName: string
  onDismiss: () => void
}

export function WelcomeMessage({ userName, onDismiss }: WelcomeMessageProps) {
  return (
    <Card className="rounded-2xl bg-white border border-gray-100 p-6 mb-8">
      <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between p-0 mb-4">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-500/10 rounded-xl flex-shrink-0">
            <Rocket className="h-7 w-7 text-blue-600" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900 leading-tight">
              Welcome to SmartForm AI, {userName}!
            </CardTitle>
            <CardDescription className="text-gray-500 mt-1">
              You're all set to create amazing forms with AI.
            </CardDescription>
          </div>
        </div>
        {/* Optional: Add a dismiss button if needed */}
        {/* <Button variant="ghost" size="sm" className="absolute top-4 right-4 md:static h-8 w-8 p-0 text-gray-400 hover:text-gray-600 transition-colors" onClick={onDismiss}>
      <X className="h-4 w-4" />
    </Button> */}
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-gray-700">
            Get started by clicking the <NavLink to="/create-form">Create New Form</NavLink> button and describe the form you want to build. Our AI will
            generate a beautiful, functional form based on your description.
          </p>
          <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
            <Sparkles className="h-4 w-4" />
            <span className="font-medium">Try this: "Create a contact form with name, email, and message fields"</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
