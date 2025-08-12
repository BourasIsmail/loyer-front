import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface CardDashboardProps {
  title: string
  value: string | number
  icon: React.ReactNode
}

const CardDashboard = ({ title, value, icon }: CardDashboardProps) => {
  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-blue-950/20 hover:shadow-xl transition-all duration-300 group">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                <div className="text-blue-600 dark:text-blue-400 text-lg">{icon}</div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 leading-tight">{title}</h3>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">{value || 0}</span>
              <Badge
                variant="secondary"
                className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 mb-1"
              >
                Total
              </Badge>
            </div>
          </div>
          <div className="w-1 h-16 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full opacity-60 group-hover:opacity-100 transition-opacity" />
        </div>
      </CardContent>
    </Card>
  )
}

export default CardDashboard
