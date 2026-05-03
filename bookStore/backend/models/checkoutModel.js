import mongoose from "mongoose";

const checkoutSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true
    },

    invoiceNumber: {
        type: String,
        unique: true
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    customer: {
        name: String,
        email: String,
        contact: String,
    },

    shippingAddress: {
        address1: String,
        address2: String,
        city: String,
        state: String,
        country: String,
        pincode: String,
    },

    purchasedItems: [
        {
            bookName: String,
            price: Number,
            quantity: Number
        }
    ],

    coupon: {
        code: String,
        discountType: String,
        discountValue: Number
    },

    pricing: {
        subtotal: Number,
        discount: Number,
        total: Number,
    },

    paymentStatus: {
        type: String,
        default: "pending"
    },

    orderStatus: {
        type: String,
        enum: ["placed", "pending", "shipped", "delivered", "cancelled", "returned"] ,
        default: "placed"
    },

    cancelRequest: {
        type: Boolean,
        default: false
    },

    cancelRequestStatus: {
        type: String,
        enum: ["none", "pending", "approved", "rejected"],
        default: "none"
    },

    cancelReason: {
        type: String,
        default: ""
    },

    cancelRequestedAt: {
        type: Date
    },

    cancelApprovedAt: {
        type: Date
    },

    returnRequest: {
        type: Boolean,
        default: false
    },

    returnRequestStatus: {
        type: String,
        enum: ["none", "pending", "approved", "rejected"],
        default: "none"
    },

    returnReason: {
        type: String,
        default: ""
    },

    returnRequestedAt: {
        type: Date
    },

    returnApprovedAt: {
        type: Date
    }
    
}, {timestamps: true} );

export const CheckoutDetail = mongoose.model("checkout", checkoutSchema); 