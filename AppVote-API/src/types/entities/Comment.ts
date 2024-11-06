import { Timestamp } from 'firebase/firestore';

export interface Comment {
  id?: string;
  description?: string;
  voteCount?: number;
  postId?: string;
  createdAt?: Timestamp | Date | undefined;
  updatedAt?: Timestamp | Date | undefined;
}
