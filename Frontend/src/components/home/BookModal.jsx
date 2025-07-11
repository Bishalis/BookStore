import { AiOutlineClose } from 'react-icons/ai';
import { PiBookOpenTextLight } from 'react-icons/pi';
import { BiUserCircle } from 'react-icons/bi';
import { HiOutlineExternalLink } from 'react-icons/hi';
import { useState } from 'react';

const BookModal = ({ book, onClose }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className='fixed bg-black/60 backdrop-blur-sm top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center animate-fadeIn'
      onClick={onClose}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className='w-[600px] max-w-full h-[500px] bg-white rounded-2xl p-8 flex flex-col relative shadow-2xl animate-slideIn'
      >
        <button
          onClick={onClose}
          className='absolute right-6 top-6 p-2 hover:bg-gray-100 rounded-full transition-colors duration-200'
        >
          <AiOutlineClose className='text-2xl text-gray-600 hover:text-gray-800' />
        </button>

        <div className='flex items-center gap-2 mb-6'>
          <span className='px-4 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-sm font-semibold shadow-md'>
            {book.publishYear}
          </span>
        </div>

        {book.imageUrl && !imageError && (
          <div className='mb-6'>
            <img 
              src={book.imageUrl} 
              alt={book.title}
              className='w-full h-48 object-cover rounded-lg shadow-md'
              onError={() => setImageError(true)}
            />
          </div>
        )}

        <div className='flex flex-col h-full'>
          <div className='flex items-center gap-x-4 mb-4'>
            <div className='p-3 bg-blue-50 rounded-xl'>
              <PiBookOpenTextLight className='text-blue-600 text-2xl' />
            </div>
            <div>
              <h3 className='text-sm text-gray-500'>Title</h3>
              <h2 className='text-xl font-semibold text-gray-800'>{book.title}</h2>
            </div>
          </div>

          <div className='flex items-center gap-x-4 mb-4'>
            <div className='p-3 bg-purple-50 rounded-xl'>
              <BiUserCircle className='text-purple-600 text-2xl' />
            </div>
            <div>
              <h3 className='text-sm text-gray-500'>Author</h3>
              <h2 className='text-xl font-semibold text-gray-800'>{book.author}</h2>
            </div>
          </div>

          {book.link && (
            <div className='flex items-center gap-x-4 mb-4'>
              <div className='p-3 bg-indigo-50 rounded-xl'>
                <HiOutlineExternalLink className='text-indigo-600 text-2xl' />
              </div>
              <div>
                <h3 className='text-sm text-gray-500'>Link</h3>
                <a 
                  href={book.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className='text-indigo-600 hover:text-indigo-800 underline'
                >
                  View Book
                </a>
              </div>
            </div>
          )}

          <div className='flex-1 min-h-0'>
            <h3 className='text-sm text-gray-500 mb-2'>Description</h3>
            <div className='h-[120px] overflow-y-auto pr-2 custom-scrollbar'>
              <p className='text-gray-600 leading-relaxed'>
                {book.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookModal;