import { Button } from "@components/ui/button";
import { Link } from "@mui/material";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "react-router-dom";

export default function NotFound() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const urlBack = isAdminRoute ? "/admin/dashboard" : "/";
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl animate-in fade-in slide-in-from-top-4 duration-1000">
          404
        </h1>
        <h2 className="text-3xl font-semibold tracking-tight lg:text-4xl animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
          Page Not Found
        </h2>
        <p className="text-muted-foreground animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
          Oops! The page you're looking for doesn't exist.
        </p>
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
          <Button asChild>
            <Link
              href={urlBack}
              className="inline-flex items-center justify-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
