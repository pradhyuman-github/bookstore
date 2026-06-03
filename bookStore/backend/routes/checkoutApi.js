import express, { Router } from "express";
import { CheckoutDetail } from "../models/checkoutModel.js";
import { auth } from "../middleware/auth.js";
import { admin } from "../middleware/admin.js";

const checkoutRouter = express.Router();

// post - order form 
checkoutRouter.post("/", auth, async(req, res) => {
    try {
        const { userId, customer, shippingAddress, items, coupon, pricing } = req.body;

        if (!customer || !shippingAddress || !items || items.length === 0 || !pricing) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        // invoice number
        const year = new Date().getFullYear();
        const invoiceNumber = `INV-${year}-${Date.now()}`;

        // create order
        const newCheckout = new CheckoutDetail({
            orderId: "ORD-" + Date.now(),
            invoiceNumber,
            userId,
            customer,
            shippingAddress: {...shippingAddress},
            purchasedItems: items,
            coupon: coupon || null,
            pricing
        });

        await newCheckout.save();

        res.status(201).json({
            success: true,
            message: "Order placed successfully",
            order: newCheckout
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// for all orders 
checkoutRouter.get("/all-orders", auth, admin, async(req, res) => {
    try {
        const orders = await CheckoutDetail.find().sort({ createdAt: -1 });
        console.log(orders);

        res.status(200).json({
            success: true,
            orders
        });
    }
    catch(err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// for user order only
checkoutRouter.get("/user/:userId", auth,  async (req, res) => {
    try {
        const { userId } = req.params;

        const orders = await CheckoutDetail
            .find({ userId })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            orders
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// for fetching order status
checkoutRouter.put("/update-status/:orderId", auth, admin, async(req, res) => {
    try {
        const {orderId} = req.params;
        const {status} = req.body;
        console.log("Incoming:", orderId, status);
        
        const normalizedStatus = status.toLowerCase();
        const allowedStatus = ["placed", "pending", "shipped", "delivered"];

        if(!allowedStatus.includes(normalizedStatus)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status"
            });
        }

        const updatedOrder = await CheckoutDetail.findByIdAndUpdate(
            orderId,
            {orderStatus: normalizedStatus},
            {new: true}
        );

        if(!updatedOrder) {
            return res.status(400).json({
                success: false,
                message: "Order not found"
            });
        }

        res.status(200).json({
            success: true,
            order: updatedOrder
        });
    }
    catch(err) {
        console.log("Status update error: ", err);
        res.status(500).json({
            success: false,
            message: "Status update Server error"
        })
    }
});

// for cancel 
checkoutRouter.put("/cancel-request/:id", auth, async(req, res) => {
    try {
        const {reason} = req.body;

        const cancelReq = await CheckoutDetail.findByIdAndUpdate(
            req.params.id, 
            { 
                cancelRequest: true,
                cancelRequestStatus: "pending",
                cancelReason: reason,
                cancelRequestedAt: new Date()
            },
            {new: true}
        );

        res.status(200).json({
            success: true,
            cancelReq
        });
    }
    catch(err) {
        console.log(err);

        res.status(500).json({
            success: false,
            message: "Cancel request failed"
        });
    }
});

// for return 
checkoutRouter.put("/return-request/:id", auth, async(req, res) => {
    try {
        const {reason} = req.body;

        const returnReq = await CheckoutDetail.findByIdAndUpdate(
            req.params.id,
            {   
                returnRequest: true,
                returnRequestStatus: "pending",
                returnReason: reason,
                returnRequestedAt: new Date()
            },
            { new: true }
        );

        res.status(200).json({
            success: true,
            returnReq
        });
    }
    catch(err) {
        console.log(err);

        res.status(500).json({
            success: false,
            message: "Return request failed"
        });
    }
});

// admin approve/reject cancel request
checkoutRouter.put("/cancel-decision/:id", auth, admin, async(req, res) => {
    try {
        const { decision } = req.body;

        const updateData = {};

        // if approved -> cancel order
        if (decision === "approved") {
            updateData.cancelRequestStatus = "approved";
            updateData.orderStatus = "cancelled";
            updateData.cancelApprovedAt = new Date();
        }

        if (decision === "rejected") {
            updateData.cancelRequest = false;
            updateData.cancelRequestStatus = "rejected";
        }

        const updatedOrder = await CheckoutDetail.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        res.status(200).json({
            success: true,
            updatedOrder
        });

    } catch(err) {
        console.log("Cancel decision api error: ",err);

        res.status(500).json({
            success: false,
            message: "Cancel decision failed"
        });
    }
});

// admin approve/reject return request 
checkoutRouter.put("/return-decision/:id", auth, admin, async(req, res) => {
    try {
        const { decision } = req.body;

        let updateData = {};

        // if approved -> returned
        if (decision === "approved") {
            updateData.returnRequestStatus = "approved";
            updateData.orderStatus = "returned";
            updateData.returnApprovedAt = new Date();
        }

        if (decision === "rejected") {
            updateData.returnRequest = false;
            updateData.returnRequestStatus = "rejected";
        }

        const updatedOrder = await CheckoutDetail.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        res.status(200).json({
            success: true,
            updatedOrder
        });

    } catch(err) {
        console.log("Return decision api error: ",err);

        res.status(500).json({
            success: false,
            message: "Return decision failed"
        });
    }
});

export default checkoutRouter;