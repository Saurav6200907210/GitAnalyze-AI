import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { AuditResult } from "@/lib/types";

export function PdfExportButton({ audit }: { audit: AuditResult }) {
  const [loading, setLoading] = useState(false);

  async function handle() {
    setLoading(true);
    try {
      const { pdf } = await import("@react-pdf/renderer");
      const { AuditPdf } = await import("@/lib/pdf");
      const blob = await pdf(<AuditPdf audit={audit} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `gitanalyze-ai-${audit.user.login}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("PDF report ready");
    } catch (err) {
      console.error(err);
      toast.error("PDF export failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button size="sm" onClick={handle} disabled={loading} className="gap-1.5">
      <Download className="size-4" />
      {loading ? "Building..." : "Export PDF"}
    </Button>
  );
}
