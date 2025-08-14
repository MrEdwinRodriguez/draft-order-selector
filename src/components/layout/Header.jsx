import { Trophy } from "lucide-react"

export const Header = () => {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-orange-100 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Fantasy Draft Wheel</h1>
            <p className="text-sm text-gray-600">Spin to determine your draft order!</p>
          </div>
        </div>
      </div>
    </header>
  )
}