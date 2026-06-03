import { useEffect, useState } from "react";
import InvoiceDetail from "./InvoiceDetail";

export default function InvoicePage() {
  const [invoice, setInvoice] = useState(undefined);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("latestOrder");

      if (stored) {
        setInvoice(JSON.parse(stored));
      } 
      else {
        setInvoice(null);
      }  
    }
    catch(err) {
      console.log(err);
      setInvoice(null);
    }

  }, []);

  // still checking localStorage
  if (invoice === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Loading...
      </div>
    );
  }
  
  // no invoice found
  if (invoice === null) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        No invoice found
      </div>
    );
  }


  return (
    <div className="sm:p-6 bg-gray-200 min-h-screen ">
      <InvoiceDetail invoice={invoice} />
    </div>
  );
}