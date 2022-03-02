const router = require("express").Router()
const { models } = require("../model")
const validateJWT = require("../middleware/validate-session")

router.post("/", validateJWT, async (req, res) =>  {
    const {title, review, rating, bookId} = req.body;
    
try {
     await models.ReviewModel.create({
        title: title,
        review: review,
        rating: rating, 
        bookId: bookId, 
        userId: req.user.id
    })
    .then(
        review => {
            res.status(201).json({
                review: review,
                message: 'review created'
            })
        }
    )
    
} catch(err) {
    res.status(500).json({
        message: `Failed to create review`
    })
}

})

// review update

router.put("/:reviewId", validateJWT, async (req, res) => {
    const {reviewId} = req.params

    let query 
    if(req.user.isAdmin == true) {
        query = {
            where: {
                id: reviewId,

            }
        };
    } else {
        query = {
            where: {
                id: reviewId,
                userId: req.user.id
            }
        }
    }

      const {
        title, 
        review, 
        rating
          
      } = req.body 
  
      try {
          await models.ReviewModel.update(
              { title, review, rating},
              query //looking to update where the id in our database matches the id in our endpoint // return the effect that rose
          )
          .then((result) => {
              res.status(200).json({
                  message: "Review successfully updated.",
                  updatedReview: result 
              })
          })
      } catch (err) {
          res.status(500).json({
              message: `Failed to update review ${err}`
          })
      }
  })
  
// Get ALL reviews 

router.get("/", async (req, res) => {
    try {
     const allReviews = await models.ReviewModel.findAll()  
     console.log(allReviews)
 
     res.status(200).json(allReviews)
 
    } catch(err) {
 
        res.status(500).json({
            error: err
        })
 
    }
 }) 

 //get reviews by user
 
 router.get("/:userId", validateJWT, async (req, res) => {
    let {userId} = req.params;
    try {
        const userReviews = await models.ReviewModel.findAll({
            where: {
                userId: userId
            }
        });
        res.status(200).json(userReviews);
    } catch (err) {
        res.status(500).json({ error: err});
    }
});   

 // need a get review by bookid
router.get("/review/:bookId", validateJWT, async (req, res) => {
const {bookId} = req.params;

try {
    const bookReviews = await models.ReviewModel.findAll({
        where: {
            bookId: bookId
        }
    })
    res.status(200).json(bookReviews);
} catch (err) {
    res.status(500).json({error: err})
}

})
 //Delete Reviews 

 router.delete("/:reviewId", validateJWT, async (req, res) =>{
    const {reviewId} = req.params 
    

    let query 
    if(req.user.isAdmin == true) {
        query = {
            where: {
                id: reviewId,

            }
        };
    } else {
        query = {
            where: {
                id: reviewId,
                userId: req.user.id
            }
        }
    }


    try { 
      

      await models.ReviewModel.destroy(
          query
      )

      res.status(200).json({
          message: "Review successfully deleted"

      })
    } catch (err) {
        res.status(500).json({
            message: `Failed to delete review ${err}`
        })
    }

})


module.exports = router;