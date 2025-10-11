export interface Note {
  id: string;
  title: string;
  content: string;
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export type NoteInput = Pick<Note, 'title' | 'content' | 'pinned'>;
