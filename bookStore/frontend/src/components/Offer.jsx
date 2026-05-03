import { useEffect, useState } from "react";

export default function Offer() {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await fetch("http://localhost:5000/coupon/view-coupon");
        const data = await res.json();

        // only active + not expired
        const validOffers = (data.data || []).filter(
          (c) => c.isActive && new Date(c.expiryDate) > new Date()
        );

        const latestOffers = validOffers.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt) )[0];

        setOffers(latestOffers ? [latestOffers] : []);
      } catch (err) {
        console.log("Offer fetch error:", err);
      }
    };

    fetchOffers();
  }, []);

  return (
    <div className="w-full my-10 sm:my-14 lg:my-16 px-4 sm:px-6 lg:px-8">
      <div className="w-full bg-linear-to-r from-amber-300 via-yellow-300 to-orange-400 text-zinc-800 rounded-xl flex flex-col lg:flex-row justify-between items-center gap-8 p-6 sm:p-8 lg:p-10">
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
          <h2 className="text-3xl sm:text-4xl font-semibold mb-4"> Latest Offer </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-700">Grab the deal before it's gone!</p>
        </div>


        {offers.length === 0 ? (
          <p className="text-gray-600 text-base sm:text-lg">No offers available</p>
        ) : (
          <div className="w-full flex flex-col items-center">
            {offers.map((offer) => (
              <div
                key={offer._id}
                className="w-full max-w-xs sm:max-w-md md:max-w-2xl border-2 border-amber-500 rounded-xl p-4 sm:p-6 bg-linear-to-br from-white to-yellow-400 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* TOP: Coupon Code */}
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-emerald-600 tracking-wide mb-2 wrap-break-word">
                    {offer.code}
                  </h3>

                  {/* Discount Info */}
                  <p className="text-base sm:text-lg font-medium text-zinc-800">
                    {offer.discountType === "percentage"
                      ? `${offer.discountValue}% OFF`
                      : offer.discountType === "bxgy"
                      ? `Buy ${offer.buyQuantity} Get ${offer.getQuantity}`
                      : `₹${offer.discountValue} OFF`}
                  </p>

                  {/* Category / Genre */}
                  <div className="mt-3 text-sm sm:text-base text-stone-500 wrap-break-word">
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
                    ) : offer.applicableGenre ? (
                      <p>Genre: {offer.applicableGenre}</p>
                    ) : (
                      <p>All items</p>
                    )}
                  </div>
                </div>

                {/* BOTTOM: Expiry */}
                <div className="text-xs sm:text-sm text-rose-500 font-medium mt-4">
                  Expires:{" "}
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