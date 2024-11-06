import { Router } from 'express';

import isAdmin from '../middlewares/isAdmin';
import { CommentsController } from '../controllers/CommentsController';

export class PostsRoute {
  
  private commentConroler: CommentsController;
  constructor(commentConroler: CommentsController) {
  
    this.commentConroler = commentConroler;
  }

  createRouter(): Router {
    const router = Router();

  
    router.get('/posts/:postId/comments',this.commentConroler.getCommentsByPostId.bind(this.commentConroler))
    router.get('/comments/:id',this.commentConroler.getCommentById.bind(this.commentConroler))

        router.post('/posts/:postId/comments',this.commentConroler.addComment.bind(this.commentConroler))
        router.put('/comments/:id',isAdmin,this.commentConroler.addComment.bind(this.commentConroler))
        router.delete('/comments/:id',isAdmin,this.commentConroler.deleteComment.bind(this.commentConroler))



    

    return router;
  }
}
