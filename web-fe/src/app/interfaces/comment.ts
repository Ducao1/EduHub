import { Attachment } from "./attachment";

export interface Comment {
    id: number;
    userId: number;
    userName: string;
    content: string;
    classId: number;
    parentCommentId?: number;
    likes: number;
    createdAt: string; // ISO Date string
    updatedAt: string; // ISO Date string
    subComments: Comment[];
    attachments: Attachment[];
    likedByCurrentUser?: boolean;
    likeCount?: number;
} 