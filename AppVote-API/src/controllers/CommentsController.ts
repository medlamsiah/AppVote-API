import { Request, Response } from 'express';
import { CommentService, UsersService } from '../services';
import { validationResult } from 'express-validator';

export class CommentsController {
  private commentService: CommentService;

  constructor(commentService: CommentService) {
    this.commentService = commentService;
  }

  async getCommentsByPostId(req: Request, res: Response): Promise<void> {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          res.status(400).json({ errors: errors.array() });
          return;
        }
  
        const postId = req.params.postId;
        const comments = await this.commentService.getComments(postId);
        
        res.status(200).json(comments);
      } catch (error) {
        res.status(500).json({ message: 'Error fetching comments', error });
      }
    }
  
    async deleteComment(req: Request, res: Response): Promise<void> {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          res.status(400).json({ errors: errors.array() });
          return;
        }

        const commentId = req.params.commentId;
        const deletedComment = await this.commentService.deleteComment(commentId);

        res.status(200).json(deletedComment);
      } catch (error) {
        res.status(500).json({ message: 'Error deleting comment', error });
      }
    }
async getCommentById(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const commentId = req.params.commentId;
      const comment = await this.commentService.getCommentById(commentId);

      if (!comment) {
        res.status(404).json({ message: 'Comment not found' });
        return;
      }

      res.status(200).json(comment);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching comment', error });
    }
  }
async addComment(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const postId = req.params.postId;
      const { content } = req.body;
      const comment = await this.commentService.addComment(postId, content);

      res.status(201).json(comment);
    } catch (error) {
      res.status(500).json({ message: 'Error adding comment', error });
    }
  }
async updateComment(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const commentId = req.params.commentId;
      const { content } = req.body;
      const updatedComment = await this.commentService.updateComment(commentId, content);

      if (!updatedComment) {
        res.status(404).json({ message: 'Comment not found' });
        return;
      }

      res.status(200).json(updatedComment);
    } catch (error) {
      res.status(500).json({ message: 'Error updating comment', error });
    }
  }

 
 

}
