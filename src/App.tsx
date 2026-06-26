import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { ThemeScript } from "@/components/theme-script";
import Landing from "@/pages/Landing";
import AuditPage from "@/pages/Audit";

function App() {
  return (
    <BrowserRouter>
      <ThemeScript />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/audit/:username" element={<AuditPage />} />
      </Routes>
      <Toaster richColors position="top-right" />
    </BrowserRouter>
  );
}

export default App;
