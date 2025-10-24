import mongoose, { Types, Document, HydratedDocument } from "mongoose";

export interface IBook {
  title: string;
  caption: string;
  image: string;
  rating: number;
  user: Types.ObjectId; // creator
}

// Extend IBook with Document to represent a full Mongoose Document
export type BookDocument = HydratedDocument<IBook>;
const bookSchema = new mongoose.Schema<IBook>(
  {
    title: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

const Book = mongoose.model<IBook>("Book", bookSchema);

export default Book;
