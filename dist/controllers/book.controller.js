import cloudinary from "../config/cloudinary.js";
import Book from "../models/Book.models.js";
export const createBook = async (req, res) => {
    try {
        const { title, caption, image, rating } = req.body;
        //    check for empty fields
        if (!title || !caption || !image || !rating) {
            return res.status(400).json({ message: "Please fill in all fields" });
        }
        //   upload image to cloudinary
        const uploadResponse = await cloudinary.uploader.upload(image);
        const cloudinaryImageUrl = uploadResponse.secure_url;
        //   ensure user is present from auth middleware
        const userId = req.user?._id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        //   save to database
        const newBook = new Book({
            title,
            caption,
            image: cloudinaryImageUrl,
            rating,
            user: userId,
        });
        await newBook.save();
        res
            .status(201)
            .json({ message: "Book created successfully", book: newBook });
    }
    catch (e) {
        console.log("Error in createBook: ", e);
        return res.status(400).json({ message: "Internal Server Error" });
    }
};
export const deleteBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book)
            return res.status(404).json({ message: "Book not found" });
        // ensure user is present
        const userId = req.user?._id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        // check if user is the creator of the book
        if (book.user.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Forbidden" });
        }
        // delete image from cloudinary as well
        if (book.image && book.image.includes("cloudinary")) {
            try {
                const lastSegment = book.image.split("/").pop();
                const publicId = lastSegment ? lastSegment.split(".")[0] : "";
                if (publicId) {
                    await cloudinary.uploader.destroy(publicId);
                }
            }
            catch (deleteError) {
                console.log("Error deleting image from cloudinary", deleteError);
            }
        }
        await book.deleteOne();
        return res.status(200).json({ message: "Book deleted successfully" });
    }
    catch (e) {
        console.log("Error in deleteBook:", e);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
//# sourceMappingURL=book.controller.js.map