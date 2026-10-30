import type React from "react"
import { Card, CardContent } from "@/components/ui/card"

interface CardDashboardProps {
  title: string
  value: string | number
  icon: React.ReactNode
}

const CardDashboard = ({ title, value, icon }: CardDashboardProps) => {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="flex items-center justify-between p-6">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <p className="mt-2 text-4xl font-semibold tracking-tight text-foreground">{value || 0}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-primary">{icon}</div>
      </CardContent>
    </Card>
  )
}

export default CardDashboard
