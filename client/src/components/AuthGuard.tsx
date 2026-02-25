import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { GraduationCap, Loader2 } from "lucide-react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F0F0F0' }}>
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" style={{ color: '#001F3F' }} />
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F0F0F0' }}>
        <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center" style={{ background: '#001F3F' }}>
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: '#001F3F' }}>Sign In Required</h1>
          <p className="text-gray-500 mb-8">Please sign in to access your dashboard and start learning.</p>
          <Button
            size="lg"
            className="w-full text-white font-semibold py-5 rounded-xl"
            style={{ background: '#001F3F' }}
            onClick={() => window.location.href = getLoginUrl()}
          >
            Sign In to Continue
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
