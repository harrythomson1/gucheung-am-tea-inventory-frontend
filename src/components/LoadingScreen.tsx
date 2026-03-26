import { Leaf } from 'lucide-react'

export function LoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <Leaf
        size={32}
        className="text-[#2a5034] animate-spin"
        style={{ animationDuration: '2s' }}
      />
      <p className="text-sm text-gray-400">{}</p>
    </div>
  )
}
