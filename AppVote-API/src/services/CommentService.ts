import { Comment } from '../types/entities/Comment';
import { FirestoreCollections } from '../types/firestore';
import { IResBody } from '../types/api';
import { firestoreTimestamp } from '../utils/firestore-helpers';
import { Timestamp } from 'firebase/firestore';
import { categories } from '../constants/categories';

export class CommentService {
  private db: FirestoreCollections;

  constructor(db: FirestoreCollections) {
    this.db = db;
  }
async getPostById(postId: string): Promise<IResBody> {
    const postDoc = await this.db.posts.doc(postId).get();

    if (!postDoc.exists) {
      return {
        status: 404,
        message: 'Post not found!'
      };
    }

    const post: Comment = {
      id: postDoc.id,
      ...postDoc.data(),
      createdAt: (postDoc.data()?.createdAt as Timestamp)?.toDate(),
      updatedAt: (postDoc.data()?.updatedAt as Timestamp)?.toDate(),
    };

    return {
      status: 200,
      message: 'Post retrieved successfully!',
      data: post
    };
  }
async updatePost(postId: string, postData: Partial<Comment>): Promise<IResBody> {
    const postDoc = await this.db.posts.doc(postId).get();

    if (!postDoc.exists) {
      return {
        status: 404,
        message: 'Post not found!'
      };
    }

    await this.db.posts.doc(postId).update({
      ...postData,
      updatedAt: firestoreTimestamp.now(),
    });

    return {
      status: 200,
      message: 'Post updated successfully!'
    };
  }
async deletePost(postId: string): Promise<IResBody> {
    const postDoc = await this.db.posts.doc(postId).get();

    if (!postDoc.exists) {
      return {
        status: 404,
        message: 'Post not found!'
      };
    }

    await this.db.posts.doc(postId).delete();

    return {
      status: 200,
      message: 'Post deleted successfully!'
    };
  }
async getPostsByUserId(userId: string): Promise<IResBody> {
    const posts: Comment[] = [];
    const postsQuerySnapshot = await this.db.posts
      .where('createdBy', '==', userId)
      .get();

    for (const doc of postsQuerySnapshot.docs) {
      posts.push({
        id: doc.id,
        ...doc.data(),
        createdAt: (doc.data()?.createdAt as Timestamp)?.toDate(),
        updatedAt: (doc.data()?.updatedAt as Timestamp)?.toDate(),
      });
    }

    return {
      status: 200,
      message: 'Posts retrieved successfully!',
      data: posts
    };
  }
async getPostsByCategory(): Promise<IResBody> {
    const posts: Comment[] = [];
    const postsQuerySnapshot = await this.db.posts
      .where('categories', 'array-contains', 'sport')
      .get();

    for (const doc of postsQuerySnapshot.docs) {
      posts.push({
        id: doc.id,
        ...doc.data(),
        createdAt: (doc.data()?.createdAt as Timestamp)?.toDate(),
        updatedAt: (doc.data()?.updatedAt as Timestamp)?.toDate(),
      });
    }

    return {
      status: 200,
      message: 'Posts retrieved successfully!',
      data: posts
    };
  }

  async createPost(postData: Comment): Promise<IResBody> {
    const postRef = this.db.posts.doc();
    await postRef.set({
      ...postData,
      voteCount: 0,
      createdAt: firestoreTimestamp.now(),
      updatedAt: firestoreTimestamp.now(),
    });

    return {
      status: 201,
      message: 'Post created successfully!',
    };
  }

  async getComments(postId: string): Promise<IResBody> {
    const comments: Comment[] = [];
    const commentQuerySnapshot = await this.db.comments
      .where('postId', '==', postId)
      .get();

    for (const doc of commentQuerySnapshot.docs) {
      comments.push({
        id: doc.id,
        ...doc.data(),
        createdAt: (doc.data()?.createdAt as Timestamp)?.toDate(),
        updatedAt: (doc.data()?.updatedAt as Timestamp)?.toDate(),
      });
    }

    return {
      status: 200,
      message: 'comment retrieved successfully!',
      data: comments
    };
  }

  async addComment(postIdp: string, commentData: Partial<Comment>): Promise<IResBody> {
    const postDoc = await this.db.posts.doc(postIdp).get();

    if (!postDoc.exists) {
      return {
        status: 404,
        message: 'Post not found!'
      };
    }

    const comment: Comment = {
      ...commentData,
      postId: postIdp,
      voteCount: 0,
      createdAt: firestoreTimestamp.now().toDate(),
      updatedAt: firestoreTimestamp.now().toDate(),
    };

    const commentRef = await this.db.comments.add(comment);

    return {
      status: 201,
      message: 'Comment added successfully!',
      data: {
        id: commentRef.id,
        ...comment
      }
    };
  }  
async getCommentById(commentId: string): Promise<IResBody> {
    const commentDoc = await this.db.comments.doc(commentId).get();

    if (!commentDoc.exists) {
      return {
        status: 404,
        message: 'Comment not found!'
      };
    }

    const comment = {
      id: commentDoc.id,
      ...commentDoc.data(),
      createdAt: (commentDoc.data()?.createdAt as Timestamp)?.toDate(),
      updatedAt: (commentDoc.data()?.updatedAt as Timestamp)?.toDate(),
    };

    return {
      status: 200,
      message: 'Comment retrieved successfully!',
      data: comment
    };
  }
async updateComment(commentId: string, commentData: Partial<Comment>): Promise<IResBody> {
    const commentDoc = await this.db.comments.doc(commentId).get();

    if (!commentDoc.exists) {
      return {
        status: 404,
        message: 'Comment not found!'
      };
    }

    await this.db.comments.doc(commentId).update({
      ...commentData,
      updatedAt: firestoreTimestamp.now()
    });

    return {
      status: 200,
      message: 'Comment updated successfully!'
    };
  }
async deleteComment(commentId: string): Promise<IResBody> {
    const commentDoc = await this.db.comments.doc(commentId).get();

    if (!commentDoc.exists) {
      return {
        status: 404,
        message: 'Comment not found!'
      };
    }

    await this.db.comments.doc(commentId).delete();

    return {
      status: 200,
      message: 'Comment deleted successfully!'
    };
  }

async createComment(commentData: Comment): Promise<IResBody> {
    const commentRef = this.db.comments.doc();
    await commentRef.set({
      ...commentData,
      voteCount: 0,
      createdAt: firestoreTimestamp.now(),
      updatedAt: firestoreTimestamp.now(),
    });

    return {
      status: 201,
      message: 'Comment created successfully!',
    };
  }

}
