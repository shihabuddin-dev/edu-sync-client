import React from 'react';
import { FaEye, FaRegStickyNote, FaRegFileAlt, FaEdit } from 'react-icons/fa';
import Button from '../ui/Button';

const ViewNoteModal = ({ open, note, onClose, onEdit }) => {
  if (!open || !note) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-base-100 rounded-md shadow-lg p-6 w-full max-w-md relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-1 right-3 text-2xl font-black text-base-content/60 hover:text-error">&times;</button>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><FaEye className="text-primary" /> View Note</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-base-content/70">Title</label>
            <div className="px-0 py-2 text-base-content font-semibold break-words whitespace-pre-line text-lg">
              <FaRegStickyNote className="text-primary text-lg inline-block mr-2 align-text-top" />
              {note.title}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-base-content/70">Description</label>
            <div className="px-0 py-2 text-base-content break-words whitespace-pre-line min-h-[40px]">
              <FaRegFileAlt className="text-base-content/50 text-lg inline-block mr-2 align-text-top" />
              {note.description}
            </div>
          </div>
        </div>
        <div className="mt-6 flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="flex btn btn-sm"
            onClick={() => {
              onClose();
              onEdit(note);
            }}
          >
            <FaEdit className="mr-2" /> Edit Note
          </Button>
          <Button
            type="button"
            variant="primary"
            className="btn btn-sm"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ViewNoteModal; 