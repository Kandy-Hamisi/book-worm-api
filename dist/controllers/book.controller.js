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
        //   save to database
        const newBook = new Book({
            title,
            caption,
            image: cloudinaryImageUrl,
            rating,
        });
        await newBook.save();
    }
    catch (e) { }
};
//# sourceMappingURL=book.controller.js.map