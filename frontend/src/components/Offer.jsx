import { useEffect, useState } from "react";
import API from "../config/api";

export default function Offer() {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await fetch(`${API}/coupon/view-coupon`);
        const data = await res.json();

        // only active + not expired
        const validOffers = (data.data || []).filter(
          (c) => c.isActive && new Date(c.expiryDate) > new Date()
        );

        const latestOffers = validOffers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

        setOffers(latestOffers ? [latestOffers] : []);
      } catch (err) {
        console.log("Offer fetch error:", err);
      }
    };

    fetchOffers();
  }, []);

  return (
    <div className="w-full flex items-center justify-center my-10 sm:my-8 lg:my-16 px-4 sm:px-6 lg:px-8">
      <div className="w-full md:max-w-xl lg:max-w-5xl bg-none md:bg-linear-to-br from-primaryColor to-primaryDarkColor text-black rounded-xl md:border border-borderColor flex flex-col lg:flex-row justify-between items-center gap-2 p-4 lg:p-10">
        <div className="hidden md:flex flex-col items-center lg:items-start text-center lg:text-left">
          <h2 className="text-3xl lg:text-4xl font-semibold sm:mb-1 lg:mb-4"> Latest Offer </h2>
          <p className="sm:text-base lg:text-xl">Grab the deal before it's gone!</p>
        </div>


        {offers.length === 0 ? (
          <p className="text-textColor text-base sm:text-lg p-4 bg-primaryColor md:bg-transparent rounded">New Offers coming soon...</p>
        ) : (
          <div className="lg:w-full flex flex-col items-center">
            {offers.map((offer) => (
              <div
                key={offer._id}
                className="w-full sm:max-w-md md:max-w-xl border-2 border-primaryDarkColor md:border-borderColor rounded-xl p-4 sm:p-6 bg-cardColor shadow-sm hover:bg-cardHoverColor hover:border-starColor hover:scale-105 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* TOP: Coupon Code */}
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-emerald-600 tracking-wide mb-2 wrap-break-word">
                    <span className="text-headingColor"> CODE </span> {offer.code}
                  </h3>

                  {/* Discount Info */}
                  <p className="text-base sm:text-lg font-medium text-textColor">
                    {offer.discountType === "percentage"
                      ? `${offer.discountValue}% OFF`
                      : offer.discountType === "bxgy"
                        ? `Buy ${offer.buyQuantity} Get ${offer.getQuantity}`
                        : `₹${offer.discountValue} OFF`}
                  </p>

                  {/* Category / Genre */}
                  <div className="mt-3 text-sm sm:text-base text-textColor wrap-break-word">
                    {offer.applicableCategories?.length > 0 ? (
                      <p>
                        Applies to:{" "}
                        {offer.applicableCategories
                          .map((c) =>
                            c.subCategory
                              ? `${c.name} → ${c.subCategory}`
                              : c.name
                          )
                          .join(", ")}
                      </p>
                    ) : offer.description ? (
                      <p> {offer.description} </p>
                    ) : (
                      <p>Applies on all items</p>
                    )
                    }
                  </div>
                </div>

                {/* BOTTOM: Expiry */}
                <div className="text-xs sm:text-sm text-red-500 font-medium mt-4">
                  Ends On:{" "}
                  {new Date(offer.expiryDate).toLocaleDateString("en-GB")}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
}