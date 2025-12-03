import express from 'express';

import cloudinary from '../lib/cloudinary.js';

import protectroute from '../src/middleware/auth.middleware.js';
import Book from '../models/book.js';

const router = express.Router();



router.post('/addbook', protectroute, async (req, res) => {

    try {


        const { title, rating, caption, image, user } = req.body;

        if (!title || !rating || !caption || !image || !user) {
            return res.status(400).json({ message: "All fields are required" });

        }

        const uploadres = await cloudinary.uploader.upload(image);

        const imageUrl = uploadres.secure_url;

        const newBook = new Book({
            title,
            rating,
            image: imageUrl,
            caption,
            user: req.user._id
        });

        await newBook.save();

        res.status(201).json(newBook);









    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });

    }



});


router.post('/', protectroute, async (req, res) => {

    try {

        const page = req.query.page || 1;

        const limit = req.query.limit || 10;

        const skip = (page - 1) * limit;


        const book = await Book.find(req.body).sort({ createdAt: -1 }).limit(limit).skip(skip).populate('user', 'username profileimage');

        const totalbooks = await Book.countDocuments();

        res.send({

            book,
            currentpage: page,
            totalpages: Math.ceil(totalbooks / limit),
            totalbooks
        })



    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }

});


router.delete("/:id", protectroute, async (req, res) => {


    try {

        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }


        if (book.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized action" });

        }

        if (book.image && book.image.includes("cloudinary")) {
            try {


                const publicId = book.image.split("/").pop().split(".")[0];

                await cloudinary.uploader.destroy(publicId);

                res.status(200).json({ message: "Book image deleted successfully" });

            } catch (error) {
                console.log(error);


                res.status(500).json({ message: "Error deleting the book image " })
            }


        }

        await book.deleteOne();

        res.status(200).json({ message: "Book deleted successfully" });


    } catch (error) {
        console.log(error);

        res.status(500).json({ message: "Internal server error" });
    }
});






export default router;