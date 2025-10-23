import type { Request, Response } from "express";
import cloudinary from "../config/cloudinary.js";
import Book from "../models/Book.models.js";

export const createBook = async (req: Request, res: Response) => {
  try {
    const { title, caption, image, rating } = req.body;

    //    check for empty fields
    if (!title || !caption || !image || !rating) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    //   upload image to cloudinary
    const uploadResponse = await cloudinary.uploader.upload(image);
    const cloudinaryImageUrl = uploadResponse.secure_url;

    //   save to database
    const newBook = new Book({
      title,
      caption,
      image: cloudinaryImageUrl,
      rating,
    });

    await newBook.save();
    res
      .status(201)
      .json({ message: "Book created successfully", book: newBook });
  } catch (e: any) {
    console.log("Error in createBook: ", e);
    return res.status(400).json({ message: "Internal Server Error" });
  }
};

export const deleteBook = async (req: Request, res: Response) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    //     check if user is the creator of the book
    if (book.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    //     delete image from cloudinary as well
    if (book.image && book.image.includes("cloudinary")) {
      try {
        const publicId = book.image.split("/").pop()?.split(".")[0] ?? "";
        await cloudinary.uploader.destroy(publicId);
      } catch (deleteError: any) {
        console.log("Error deleting image e from cloudinary", deleteError);
      }
    }

    await book.deleteOne();
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (e: any) {}
};
