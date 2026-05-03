import express from "express";
import { CouponDetail } from "../models/couponModel.js";
import { auth } from "../middleware/auth.js";
import { admin } from "../middleware/admin.js";

const couponRouter = express.Router();

// post - add coupon
couponRouter.post("/create-coupon", auth, admin, async(req, res) => {
    try {
        const {code, discountType, startDate, expiryDate, buyQuantity, getQuantity} = req.body;
        console.log(code, discountType, startDate, expiryDate, buyQuantity, getQuantity);

        // validate dates
        if (new Date(startDate) >= new Date(expiryDate)) {
            return res.status(400).json({
                success: false,
                message: "Start date must be before Expiry date",
            });
        }
        
        // auto inactive
        if (new Date(expiryDate) < new Date()) {
            req.body.isActive = false;
        }

        if(!code || !discountType || !startDate || !expiryDate) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        if(discountType === "bxgy") {
            if(!buyQuantity || !getQuantity) {
                return res.status(400).json({ error: "Buy and Get quantity required for BXGY" });
            }
        }

        const existing = await CouponDetail.findOne({ code: code.toUpperCase() });
        if(existing) {
            return res.status(400).json({ error: "Coupon already exists" });
        }

        const coupon = new CouponDetail({
            ...req.body,
            code: code.toUpperCase(),
        });

        await coupon.save();

        res.status(201).json({
            success: true,
            message: "Coupon created successfully",
            coupon,
        });
    }
    catch(err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
});

// get - view coupon
couponRouter.get("/view-coupon", async(req, res) => {
    try {
        const coupons = await CouponDetail.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: coupons
        });
    }
    catch(err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
});

// put - update coupon
couponRouter.put("/update-coupon/:id", auth, admin, async(req, res) => {
    try {
        const { id } = req.params;

        const { startDate, expiryDate } = req.body;
        if(startDate && expiryDate) {
            if( new Date(startDate) >= new Date(expiryDate) ) {
                return res.status(400).json({
                    success: false,
                    message: "Start date must be before expiry date"
                });
            }
        }

        if(expiryDate && new Date(expiryDate) < new Date() ) {
            req.body.isActive = false;
        }

        const updated = await CouponDetail.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );

        if(!updated) {
            return res.status(404).json({ message: "Coupon not found" });
        }

        res.status(200).json({
            success: true,
            message: "Coupon updated successfully",
            data: updated
        });
    } 
    catch(err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// delete - delete coupon
couponRouter.delete("/delete-coupon/:id", auth, admin, async(req,res) => {
    try {
        const { id } = req.params;

        const deleted = await CouponDetail.findByIdAndDelete(id);

        if(!deleted) {
            return res.status(404).json({ message: "Coupon not found" });
        }

        res.status(200).json({
            success: true,
            message: "Coupon deleted successfully"
        });
    }
    catch(err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

export default couponRouter;