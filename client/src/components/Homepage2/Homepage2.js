import Slideshow from "../Homepage/Slideshow";
import NewYearCountdown from "../Homepage/CommingSoon";
import AgeGroups from "./Age";
import BestSellers from "./BestSeller";
import FeaturedCategories from "./Categories";
import NewArrivals from "./NewItem";
import { Toaster } from "react-hot-toast";
import { toastConfig } from "helper/toast.config";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 space-y-12">
        <Slideshow />
        <BestSellers />
        <FeaturedCategories />
        <NewArrivals />
        <AgeGroups />
        <NewYearCountdown />
        <Toaster
          position={toastConfig.position}
          toastOptions={{
            duration: toastConfig.duration,
          }}
        />
      </div>
    </main>
  );
}
