'use client';
import { useState } from "react";
import CategoryBrowsePage from "./category/page";

export default function Home() {
  const [cartCount, setCartCount] = useState(0);
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans">

      <CategoryBrowsePage
        cartCount={cartCount}
        onCartCountChange={setCartCount}
        onBackToHome={() => {
          console.log('Back to home clicked');
        }}
      />

    
    </div>
  );
}
