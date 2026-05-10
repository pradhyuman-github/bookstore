import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import API from "../config/api";

const InvoiceDetail = () => {
  const pdfRef = useRef();
  const { state } = useLocation();
  const order = state?.order || JSON.parse(localStorage.getItem("latestOrder"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async() => {
      try {
        const res = await fetch(`${API}/users/user-profile`, 
          {
            method: "GET",
            credentials: "include"
          }
        );

        const data = await res.json();
        
        if(data.success) {
          setUser(data.user);
        }
      }
      catch(err) {
        console.log(err);
      }
      finally {
        setLoading(false);
      }
        
    };
    
    getUser();
  }, []);

  if (loading) {
    return <p className="text-center p-4 m-2">Loading...</p> ;
  }

  if (!order) {
    return <p className="text-center p-4 m-2">No invoice data</p> ;
  }

  if(!user) {
    return (
      <div className="flex flex-col items-center justify-center p-4 m-2 text-lg ">
        <p className="text-center bg-amber-400 p-4 mb-4"> User not logged in  !! </p>
        <p className="text-center bg-white rounded p-2 mt-4"> Login to continue</p> 
      </div>
    );
  }

  const handleDownload = async () => {
    const element = pdfRef.current;
    const canvas = await html2canvas(element, { scale: 2, backgroundColor: "#ffffff" });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    pdf.save(`Invoice-${order.orderId}.pdf`);
  };

  return (
    <div className="p-2 sm:p-6 min-h-screen" style={{ backgroundColor: "#f3f4f6" }}>

      <div ref={pdfRef} className="max-w-4xl mx-auto p-8 rounded shadow" style={{ backgroundColor: "#ffffff", color: "#000000" }}>

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between border-b pb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">BookStore Invoice</h1>
            <p className="text-xs mb-2 sm:text-sm" style={{ color: "#4b5563" }}>
              Bookstore Pvt Ltd <br />
              123, Main Street, India <br />
              support@bookstore.com <br />
              +91 9911991199
            </p>
          </div>

          <div className="sm:text-right text-xs sm:text-sm">
            <div className="flex flex-col sm:block pt-3 pb-2">
              <b>Invoice No: </b>
              <span>{order.invoiceNumber}</span>
            </div>

            <div className="flex flex-col sm:block pb-2">
              <b>Order ID: </b>
              <span>{order.orderId}</span>
            </div>

            <div className="flex flex-col sm:block">
              <b>Date: </b>
              <span>{new Date(order.createdAt).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* CUSTOMER + SHIPPING */}
        <div className="flex flex-col sm:grid grid-cols-2 gap-3 sm:gap-6 mt-6 border-b pb-4 text-sm">
          <div>
            <h2 className="font-semibold mb-2 text-sm sm:text-lg">Customer Details</h2>
            <p className="text-xs sm:text-sm">{order.customer?.name}</p>
            <p className="text-xs sm:text-sm">{order.customer?.email}</p>
            <p className="text-xs sm:text-sm">{order.customer?.contact}</p>
          </div>

          <div>
            <h2 className="font-semibold mb-2 text-sm sm:text-lg">Shipping Address</h2>
            <p className="text-xs sm:text-sm">{order.shippingAddress?.address1}</p>
            <p className="text-xs sm:text-sm">{order.shippingAddress?.address2}</p>
            <p className="text-xs sm:text-sm">
              {order.shippingAddress?.city} {", "} {order.shippingAddress?.state}
            </p>
            <p className="text-xs sm:text-sm">
              {order.shippingAddress?.country} - {order.shippingAddress?.pincode}
            </p>
          </div>
        </div>

        {/* desktop - ITEMS TABLE */}
        <div className="hidden md:block mt-6">
          <table className="w-full border text-sm" style={{ border: "1px solid #d1d5db" }}>
            <thead style={{ backgroundColor: "#BCAAA4" }}>
              <tr>
                <th style={{ border: "1px solid black", padding: "8px" }}>Sr No</th>
                <th style={{ border: "1px solid black", padding: "8px", textAlign: "left" }}>Item Name</th>
                <th style={{ border: "1px solid black", padding: "8px" }}>Qty</th>
                <th style={{ border: "1px solid black", padding: "8px" }}>Price</th>
                <th style={{ border: "1px solid black", padding: "8px" }}>Total</th>
              </tr>
            </thead>

            <tbody>
              {(order.purchasedItems || []).map((item, i) => (
                <tr key={i}>
                  <td style={{ border: "1px solid #000000", padding: "8px", textAlign: "center" }}>{i + 1}</td>
                  <td style={{ border: "1px solid #000000", padding: "8px" }}>{item.bookName}</td>
                  <td style={{ border: "1px solid #000000", padding: "8px", textAlign: "center" }}>{item.quantity}</td>
                  <td style={{ border: "1px solid #000000", padding: "8px", textAlign: "center" }}>₹{item.price}</td>
                  <td style={{ border: "1px solid #000000", padding: "8px", textAlign: "center" }}>
                    ₹{item.price * item.quantity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* mobile invoice */}
        <div className="md:hidden mt-6 space-y-4">
          {(order.purchasedItems || []).map((item, i) => (
            <div
              key={i}
              style={{ border: "1px solid #D1D5DB", padding: "16px", backgroundColor: "#FFFFFF"}}
            >              
              <div className="flex flex-col justify-between border-b py-2 gap-1">
                <span className="font-semibold text-sm">Item Name</span>
                <span className="text-start text-sm wrap-break-word">{item.bookName}</span>
              </div>

              <div className="flex flex-col justify-between border-b py-2">
                <span className="font-semibold text-sm">Qty & Price</span>
                <span className="text-sm">{item.quantity} × {item.price} </span>
              </div>

              <div className="flex flex-col justify-between pt-2">
                <span className="font-semibold text-sm">Subtotal</span>
                <span className="text-sm">₹{item.price * item.quantity}</span>
              </div>
            </div>
          ))}
        </div>

        {/* PRICING */}
        <div className="mt-6 flex justify-end">
          <div className="w-80 space-y-2 text-sm">

            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₹{order.pricing?.subtotal}</span>
            </div>

            <div className="flex justify-between">
              <span>Coupon:</span>
              <span>{order.coupon?.code || "N/A"}</span>
            </div>

            <div className="flex justify-between ">
              <span>Discount:</span>
              <span>-₹{order.pricing?.discount || 0}</span>
            </div>

            <div style={{backgroundColor: "#BCAAA4"}} className="flex justify-between border-t pt-2 font-bold text-lg px-4 py-2">
              <span>Total:</span>
              <span>₹{order.pricing?.total}</span>
            </div>

          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-10 border-t pt-4 text-center text-xs" style={{ color: "#6b7280" }}>
          <p>Thank you for your purchase!</p>
          <p>This is a computer-generated invoice.</p>
        </div>

      </div>

      {/* DOWNLOAD BUTTON */}
      <div className="text-center mt-6">
        <button
          onClick={handleDownload}
          className="px-6 py-2 rounded"
          style={{ backgroundColor: "#2563eb", color: "#ffffff" }}
        >
          Download PDF
        </button>
      </div>

    </div>
  );
};

export default InvoiceDetail;