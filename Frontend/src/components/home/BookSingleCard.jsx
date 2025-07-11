import { Link } from 'react-router-dom';
import { PiBookOpenTextLight } from 'react-icons/pi';
import { BiUserCircle, BiShow } from 'react-icons/bi';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineDelete } from 'react-icons/md';
import { HiOutlineExternalLink } from 'react-icons/hi';
import { useState } from 'react';
import BookModal from './BookModal';

const BookSingleCard = ({ book, onDelete }) => {
  const [showModal, setShowModal] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${book.title}"?`)) {
      onDelete(book._id);
    }
  };

  return (
    <div className='bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 card-hover'>
      {/* Image Section */}
      <div className='relative h-64 overflow-hidden'>
        {book.imageUrl && !imageError ? (
          <img 
            src={book.imageUrl} 
            alt={book.title}
            className='w-full h-full object-cover transition-transform duration-300 hover:scale-105'
            onError={() => setImageError(true)}
          />
        ) : (
          <div className='w-full h-full bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center'>
            <PiBookOpenTextLight className='text-6xl text-gray-400' />
          </div>
        )}
        <div className='absolute top-3 right-3'>
          <span className='px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-sm font-semibold shadow-md'>
            {book.publishYear}
          </span>
        </div>
      </div>
      
      {/* Content Section */}
      <div className='p-6'>
        {/* Title */}
        <div className='mb-4'>
          <h2 className='text-xl font-bold text-gray-800 line-clamp-2 leading-tight'>{book.title}</h2>
        </div>
        
        {/* Author */}
        <div className='flex items-center gap-x-3 mb-4'>
          <div className='p-2 bg-purple-50 rounded-lg'>
            <BiUserCircle className='text-purple-600 text-xl' />
          </div>
          <h3 className='text-lg text-gray-600 font-medium'>{book.author}</h3>
        </div>

        {/* Description */}
        {book.description && (
          <div className='mb-4'>
            <p className='text-gray-600 line-clamp-2 text-sm leading-relaxed'>
              {book.description}
            </p>
          </div>
        )}

        {/* Link Section */}
        {book.link && (
          <div className='mb-4 p-3 bg-indigo-50 rounded-lg border border-indigo-100'>
            <div className='flex items-center justify-between'>
              <span className='text-sm text-indigo-700 font-medium'>Book Link</span>
              <a 
                href={book.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className='flex items-center gap-2 px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200 text-sm font-medium'
              >
                <HiOutlineExternalLink className='text-sm' />
                View
              </a>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className='flex justify-between items-center pt-4 border-t border-gray-100'>
          <div className='flex gap-2'>
            <button
              onClick={() => setShowModal(true)}
              className='p-2 hover:bg-blue-50 rounded-lg transition-colors duration-200'
              title='View Details'
            >
              <BiShow className='text-xl text-blue-600 hover:text-blue-700' />
            </button>
            
            <Link to={`/books/details/${book._id}`} className='p-2 hover:bg-green-50 rounded-lg transition-colors duration-200' title='More Info'>
              <BsInfoCircle className='text-xl text-green-600 hover:text-green-700' />
            </Link>
          </div>
          
          <div className='flex gap-2'>
            <Link to={`/books/edit/${book._id}`} className='p-2 hover:bg-yellow-50 rounded-lg transition-colors duration-200' title='Edit Book'>
              <AiOutlineEdit className='text-xl text-yellow-600 hover:text-yellow-700' />
            </Link>
            
            <button
              onClick={handleDelete}
              className='p-2 hover:bg-red-50 rounded-lg transition-colors duration-200'
              title='Delete Book'
            >
              <MdOutlineDelete className='text-xl text-red-600 hover:text-red-700' />
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <BookModal book={book} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};

export default BookSingleCard;