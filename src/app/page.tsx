'use client';
import { useState } from "react";
import MembershipPage from "./components/MembershipPage";

export default function Home() {
  const [cartCount, setCartCount] = useState(0);
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans">

      <MembershipPage
        cartCount={cartCount}
        onCartCountChange={setCartCount}
        onBackToHome={() => {
          console.log("Back to home");
        }}
        onCartClick={() => {
          console.log("Cart clicked");
        }}
        onBrandClick={() => console.log("Brand clicked")}
        onBuyingGuideClick={() => console.log("Buying guide clicked")}
        onEventsClick={() => console.log("Events clicked")}
        onFreebiesClick={() => console.log("Freebies clicked")}
        onBestSellerClick={() => console.log("Best seller clicked")}
        onClinicSetupClick={() => console.log("Clinic setup clicked")}
      />
    </div>
  );
}
