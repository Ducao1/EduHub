export interface Attachment {
    id: number;
    fileName: string;
    filePath: string;
    commentId?: number;
    createdAt: string; // ISO Date string
    updatedAt: string; // ISO Date string
} 