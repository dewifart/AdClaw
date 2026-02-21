import { Link } from "wouter";
import { Flame, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-[#FF2D55]/10 border border-[#FF2D55]/20 flex items-center justify-center mx-auto mb-6">
          <Flame className="w-8 h-8 text-[#FF2D55]" />
        </div>
        <h1 className="font-brand font-bold text-4xl uppercase gold-gradient mb-3">404</h1>
        <p className="text-sm text-white/50 mb-8">This soul has not been forged yet.</p>
        <Link href="/">
          <button
            className="flex items-center gap-2 bg-[#1a1a1a] text-white/80 font-medium rounded-lg px-6 py-3 text-sm mx-auto transition-all duration-200 hover:text-white"
            data-testid="button-go-home"
          >
            <ArrowLeft className="w-4 h-4" />
            Return Home
          </button>
        </Link>
      </div>
    </div>
  );
}