const router = require("express").Router();
const { validate } = require("../db");
let validateJWT = require("../middleware/validate-session")
const { models } = require("../model")
const {BookModel} = require("../model")

// CREATE BOOK

router.post('/', validateJWT, async (req, res) => {
    const {title, author, genre, summary, image, list } = req.body;

    try {
         await models.BookModel.create({
            title: title,
            author: author,
            genre: genre,
            summary: summary,
            image: image,
            list: list,
            userId: req.user.id
        })
        .then(
            book => {
                res.status(201).json({
                    book: book,
                    message: 'book created',
                    
                });
            }
        )
    } catch (err) {
        res.status(500).json({
            error: `Failed to create book: ${err}`
        });
    };
});




// router.post("/", validateJWT, async (req, res) => {
//     const {id} = req.body

//     try {
//         const createBook = await BookModel.create({
//             title: req.body.title,
//             author: req.body.author,
//             genre: req.body.genre,
//             summary: req.body.summary,
//             image: req.body.image,
//             list: req.body.list,
//             userId: id
//         })
//         console.log(createBook)

//         res.status(201).json({
//             message: "Book successfully created",
//             createBook
//         })
//     } catch (err) {
//         res.status(500).json({
//             message: `Failed to create Book ${err}`
//         })
//     }

// })


// book update

router.put("/:bookId", validateJWT, async (req, res) => {
    const {bookId} = req.params
    const {
        title,
        author,
        genre,
        summary,
        image,
        list,

    } = req.body

    try {
        await models.BookModel.update(
            {title, author, genre, summary, image, list},
            {where: {id: bookId, userId: req.user.id} }
        )
        .then((result) => {
            res.status(200).json({
                message: "Book succesfully updated.",
                updatedBook: result
            })
        })
    } catch (err) {
        res.status(500).json({
            message: `Failed to update book  ${err}`
        })
    }
})

// Get ALL books
router.get("/", async (req, res) => { //
    try {
     const allBooks = await models.BookModel.findAll()
     console.log(allBooks)

     res.status(200).json(allBooks)

    } catch(err) {

        res.status(500).json({
            error: err
        })

    }
 })

 // get books by user

 router.get("/:userId", validateJWT, async (req, res) => {
    let {userId} = req.params;
    try {
     await models.BookModel.findAll({
            where: {userId: userId}
})
.then((result) => {
    res.status(200).json({
        message: "user books:",
        books: result
    })
})

    } catch (err) {
        res.status(500).json({ error: err});
    }
});

// get books by genre

router.get("/genre/:genre", async (req, res) => {
    const {genre} = req.params;
    try {
        const results = await models.BookModel.findAll({
            where: { genre: genre }
        });
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ error: err});
    }
});

//get books by list 
router.get("/list/:list", async (req, res) => {
    const {list} = req.params;

    try {
        const results = await models.BookModel.findAll({
            where: {list : list}
        });
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ error: err})
    }
});

// Delete book
router.delete("/:bookId", validateJWT, async (req, res) =>{
    const {bookId} = req.params;

    try {

      await models.BookModel.destroy({
          where: {id: bookId, userId: req.user.id}
      })

      res.status(200).json({
          message: "Book successfully deleted"

      })
    } catch (err) {
        res.status(500).json({
            message: `Failed to delete book ${err}`
        })
    }

})


module.exports = router;