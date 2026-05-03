import express from "express";
import { AddBook } from "../models/addBookModel.js";
import { upload } from "../middleware/addBookImg.js";
import { auth } from "../middleware/auth.js";
import { admin } from "../middleware/admin.js";

const addBookRouter = express.Router();

// post method - save form data in db
addBookRouter.post("/add-book", auth, admin, upload.array("bookImg", 3), async(req, res) => {
    try {
        const {bookName, authorName, language, publishYear, bookDesc, bookPrice, genre, bookStock, category} = req.body;
        console.log(bookName, authorName, language, publishYear, bookDesc, bookPrice, genre, bookStock, category);
        
        let parsedCategory;
        try {
            parsedCategory = typeof category == "string" ? JSON.parse(category) : category;
        }
        catch(err) {
            return res.status(400).json({
                success: false,
                message: "Invalid category format"
            });
        }

        if (!Array.isArray(parsedCategory)) {
            return res.status(400).json({
                success: false,
                message: "Category must be array"
            });
        }

        if (!parsedCategory || parsedCategory.length === 0 || !parsedCategory[0].name) {
            return res.status(400).json({
                success: false,
                message: "Category is required"
            });
        }

        // extract img paths
        const imagePaths = req.files?.map(file => file.path) || [];

        const newBook = new AddBook(
            {
                bookName, authorName, language, publishYear, bookDesc, bookPrice, genre, bookStock, 
                images: imagePaths, 
                category: parsedCategory
            }
        );

        await newBook.save();

        res.status(201).json({
            success: true,
            message: "Book added successfully",
            data: newBook
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// get method - display data from db
addBookRouter.get("/view-book", async(req, res) => {
    try {
        const books = await AddBook.find().sort({createdAt: -1 });

        res.status(200).json({
            success: true,
            data: books
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// get method - all books by category/sub
addBookRouter.get("/", async(req,res) => {
    try{
        const {category, sub, search, genre, author, price, lang} = req.query;
        let query = {};

        if(search) {
            query.bookName = { $regex: search, $options: "i"};
        }
 
        if(category && sub) {
            query["category.name"] = category;
            query["category.subCategory"] = sub;
        }
        else if(category) {
            query["category.name"] = category;
        }

        if(genre && !genre.startsWith("select")) {
            query.genre = { $regex: genre, $options: "i" };
        }

        if (author && !author.startsWith("select")) {
            query.authorName = author;
        }

        if (lang && !lang.startsWith("select")) {
            query.language = lang;
        }

        if (price) {
            switch(price) {
                case "range1": 
                    query.bookPrice = {$gte: 100, $lte: 200};
                    break;
                case "range2":
                    query.bookPrice = {$gte: 200, $lte: 500};
                    break;
                case "range3":
                    query.bookPrice = { $gte: 500, $lte: 1000 };
                    break;
                case "range4":
                    query.bookPrice = { $gte: 1000, $lte: 2000 };
                    break;
                case "range5":
                    query.bookPrice = { $gt: 2000 };
                    break;
            }
        }

        const books = await AddBook.find(query).sort({createdAt: -1});

        res.status(200).json({
            success: true,
            data: books
        });
    }
    catch(err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// get method - book slider
addBookRouter.get("/book-slider", async(req, res) => {
    try {
        const sliderBooks = await AddBook.find().sort({createdAt: -1}).limit(20);
        res.status(200).json({
            success: true,
            data: sliderBooks
        });
    }
    catch(err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// get method - dashboard book stats
addBookRouter.get("/book-stats", async(req, res) => {
    try {
        const totalBooks = await AddBook.countDocuments();

        // greater than 0
        const availableBooks = await AddBook.countDocuments({
            bookStock: { $gt: 0}
        });

        const outOfStockBooks = await AddBook.countDocuments({
            bookStock: 0
        });

        res.json({
            success: true,
            data: { totalBooks, availableBooks, outOfStockBooks }
        });
    }
    catch(err) {
        res.status(500).json( {success: false, message: err.message} );
    }
});

// get method - product pg
addBookRouter.get("/:id", async(req, res) => {
    try {
        const { id } = req.params;
        
        const book = await AddBook.findById(id);
        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Book not found"
            });
        }

        res.json({
            success: true,
            data: book
        });
    }
    catch(err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
});

// delete method
addBookRouter.delete("/delete-book/:id", auth, admin, async (req, res) => {
    try {
        const { id } = req.params;

        const deletedBook = await AddBook.findByIdAndDelete(id);

        if(!deletedBook) {
            return res.status(404).json( {message: "Book not found"} );
        }

        res.status(200).json({
            success: true,
            message: "Book deleted successfully"
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// update method
addBookRouter.put("/update-book/:id", auth, admin, upload.array("bookImg", 3), async(req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        if (updatedData.category) {
            try {
                updatedData.category = JSON.parse(updatedData.category);
            } catch (err) {
                console.log("Category parse error", err);
            }
        }

        if (!updatedData.category || !updatedData.category.name) {
            return res.status(400).json({
                success: false,
                message: "Category is required"
            });
        }

        // if img uploaded
        if (req.files && req.files.length > 0) {
            const imagePaths = req.files?.map(file => file.path) || [];
            updatedData.images = imagePaths;
        }

        const updatedBook = await AddBook.findByIdAndUpdate(
            id,
            updatedData, 
            {new: true}
        );

        res.status(200).json({
            success: true,
            data: updatedBook
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});



export default addBookRouter;