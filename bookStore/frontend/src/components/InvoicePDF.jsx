import { useEffect, useState } from "react";
import InvoiceDetail from "./InvoiceDetail";

export default function InvoicePage() {
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("invoice"));
    setInvoice(stored);
  }, []);

  if (!invoice) return <p>Loading...</p>;

  return (
    <div className="sm:p-6 bg-gray-200 min-h-screen ">
      <InvoiceDetail invoice={invoice} />
    </div>
  );
}