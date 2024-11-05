import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F3F4F6] text-[#1F2937]">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold text-[#1E40AF] font-inter">PostSync</h1>
        <p className="text-xl mb-8 font-roboto">Seamlessly bridge your social presence</p>
        <div className="space-x-4">
          <Button asChild className="bg-[#1E40AF] hover:bg-[#1E3A8A] text-white font-roboto">
            <Link href="/signup">Sign Up</Link>
          </Button>
          <Button asChild variant="outline" className="border-[#1E40AF] text-[#1E40AF] hover:bg-[#1E40AF] hover:text-white font-roboto">
            <Link href="/login">Login</Link>
          </Button>
        </div>
      </div>
      <div className="mt-16 flex space-x-8">
        <div className="w-12 h-12 rounded-full bg-[#38BDF8] animate-bounce"></div>
        <div className="w-12 h-12 rounded-full bg-[#FF6B6B] animate-bounce delay-100"></div>
      </div>
    </div>
  )
}