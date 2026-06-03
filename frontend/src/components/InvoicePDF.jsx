import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import InvoiceDetail from "./InvoiceDetail";

export default function InvoicePage() {
  const location = useLocation();
  const [invoice, setInvoice] = useState(undefined);

  useEffect(() => {
    try {
      if(location.state?.order) {
        setInvoice(location.state.order);

        localStorage.setItem("latestOrder", JSON.stringify(location.state.order));

        return;
      }

      const stored = localStorage.getItem("latestOrder");

      if (stored) {
        setInvoice(JSON.parse(stored));
      }
      else {
        setInvoice(null);
      }
    }
    catch (err) {
      console.log(err);
      setInvoice(null);
    }

  }, [location.state]);

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
    <div className="min-h-screen">
      <InvoiceDetail invoice={invoice} />
    </div>
  );
}