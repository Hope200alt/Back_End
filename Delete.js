import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DeleteBook = ({ bookId, onBookDeleted }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this book? This action cannot be undone.')) {
      return;
    }
    
    setIsDeleting(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/books/${bookId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (onBookDeleted) {
        onBookDeleted(bookId);
      } else {
        // If no callback provided, navigate to books list
        navigate('/books');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete book. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="mt-4">
      <button 
        onClick={handleDelete} 
        disabled={isDeleting}
        className={`px-4 py-2 rounded text-white ${
          isDeleting ? 'bg-gray-500' : 'bg-red-600 hover:bg-red-700'
        }`}
        aria-label="Delete book"
      >
        {isDeleting ? (
          <>
            <span className="animate-spin inline-block mr-2">↻</span>
            Deleting...
          </>
        ) : 'Delete Book'}
      </button>
      {error && (
        <p className="mt-2 text-red-600">
          ⚠️ {error}
        </p>
      )}
    </div>
  );
};

export default DeleteBook;