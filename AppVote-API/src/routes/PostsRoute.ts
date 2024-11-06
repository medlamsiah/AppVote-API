import { Router } from 'express';
import { PostsController } from '../controllers';
import { validateCreatePost } from '../middlewares/dataValidator';
import authJwt from '../middlewares/authJwt';
import isAdmin from '../middlewares/isAdmin';

export class PostsRoute {
  private postsController: PostsController;
  
  constructor(postsController: PostsController) {
    this.postsController = postsController;
    
  }

  createRouter(): Router {
    const router = Router();

    router.post('/posts', authJwt.verifyToken, validateCreatePost, this.postsController.createPost.bind(this.postsController));
    router.get('/posts', this.postsController.getPosts.bind(this.postsController));
    router.get('/posts/:postId', this.postsController.getPostById.bind(this.postsController));
    router.put('posts/:id',isAdmin, this.postsController.updatePostById.bind(this.postsController))
    router.get('/categories', this.postsController.getCategories.bind(this.postsController));
    router.delete('/posts/:id',this.postsController.updatePostById.bind(this.postsController))
    router.get('/users/:userId/posts',this.postsController.getPostsByUserId.bind(this.postsController))
   

    

    return router;
  }
}
