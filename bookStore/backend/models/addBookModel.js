import mongoose from "mongoose";

const addBookSchema = new mongoose.Schema({
    bookName: {
        type: String,
        required: true,
    },
    authorName: {
        type: String,
        required: true,
    },
    language: {
        type: String,
        required: true,
    },
    publishYear: {
        type: Number,
        required: true,
        min: 1000,
        max: new Date().getFullYear(),
    },
    bookDesc: {
        type: String,
        required: true,
    },
    bookPrice: {
        type: Number,
        required: true,
        min: 0,
    },
    genre: {
        type: String,
        required: true,
    },
    bookStock: {
        type: Number,
        required: true,
        min: 0,
    },
    images: [
        { type: String, }
    ],
    category: [
        {
            name: { 
                type: String, 
                required: true, 
                index: true 
            },
            subCategory: { 
                type: String, 
                default: null,
                index: true 
            }
        }
    ]
}, {timestamps: true} );

export const AddBook = mongoose.model("AddBook", addBookSchema);