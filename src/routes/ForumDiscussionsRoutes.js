const routes = require("express").Router()

const discussionController = require("../controllers/ForumDiscussionsController")
routes.get("/discussions",discussionController.getAllDiscussion)
routes.post("/discussion",discussionController.addDiscussion)


routes.delete("/discussion/:id",discussionController.deleteDiscussion)
routes.get("/discussion/:id",discussionController.getDiscussionById)



module.exports = routes