import { RouterProvider } from "react-router/dom";
import { router } from "./router";
import { Toaster } from "./components/ui/sonner";
import { useEffect, useState } from "react";

function App() {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  const handleResize = () => {
    setIsDesktop(window.innerWidth >= 768);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (!isDesktop) {
    return (
      <div className="flex items-center justify-center h-screen px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold">
            Hanya bisa di akses melalui desktop, silahkan beralih ke desktop
          </h1>
        </div>
      </div>
    );
  }

  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors />
    </>
  );
}

export default App;
