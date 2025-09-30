import React, { useState, useEffect } from 'react';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { PiBookOpenTextLight } from 'react-icons/pi';
import { BiUserCircle, BiCalendar } from 'react-icons/bi';
import { HiOutlineExternalLink } from 'react-icons/hi';

const DeleteBook = () => {
  const [loading, setLoading] = useState(false);
  const [book, setBook] = useState({});
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    setLoading(true);
    axios.get(`http://3.27.5.126:3000/books/${id}`)
      .then((response) => {
        setBook(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar('Failed to load book details', { variant: 'error' });
        console.log(error);
      });
  }, [id, enqueueSnackbar]);

  const handleDeleteBook = () => {
    setLoading(true);
    axios
      .delete(`http://3.27.5.126:3000/books/${id}`)
      .then(() => {
        setLoading(false);
        enqueueSnackbar('Book deleted successfully', { variant: 'success' });
        navigate('/');
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar('Failed to delete book', { variant: 'error' });
        console.log(error);
      });
  };
  
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4'>
      <div className='max-w-4xl mx-auto'>
        <BackButton />
        
        <div className='bg-white rounded-2xl shadow-lg overflow-hidden mt-6'>
          {/* Header */}
          <div className='bg-gradient-to-r from-red-600 to-pink-600 p-8 text-white'>
            <div className='flex items-center gap-4 mb-4'>
              <div className='p-3 bg-white/20 rounded-xl'>
                <PiBookOpenTextLight className='text-3xl' />
              </div>
              <div>
                <h1 className='text-3xl font-bold'>Delete Book</h1>
                <p className='text-red-100'>Remove book from your collection</p>
              </div>
            </div>
          </div>

          <div className='p-8'>
            {loading ? (
              <div className='flex justify-center items-center py-20'>
                <Spinner />
              </div>
            ) : (
              <div className='text-center'>
                {/* Warning Icon */}
                <div className='mb-8'>
                  <div className='w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                    <span className='text-4xl'>⚠️</span>
                  </div>
                  <h2 className='text-2xl font-bold text-gray-800 mb-2'>
                    Are you sure you want to delete this book?
                  </h2>
                  <p className='text-gray-600'>
                    This action cannot be undone. The book will be permanently removed from your collection.
                  </p>
                </div>

                {/* Book Details */}
                <div className='bg-gray-50 rounded-xl p-6 mb-8 max-w-2xl mx-auto'>
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                    {/* Book Image */}
                    <div className='md:col-span-1'>
                      {book.imageUrl && !imageError ? (
                        <img
                          src={book.imageUrl}
                          alt={book.title}
                          className='w-full h-48 object-cover rounded-lg shadow-md'
                          onError={() => setImageError(true)}
                        />
                      ) : (
                        <div className='w-full h-48 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg shadow-md flex items-center justify-center'>
                          <PiBookOpenTextLight className='text-6xl text-gray-400' />
                        </div>
                      )}
                    </div>

                    {/* Book Info */}
                    <div className='md:col-span-2 space-y-4'>
                      <div>
                        <h3 className='text-xl font-bold text-gray-800 mb-2'>{book.title}</h3>
                        <div className='flex items-center gap-2 text-gray-600'>
                          <BiUserCircle className='text-lg' />
                          <span>{book.author}</span>
                        </div>
                      </div>

                      <div className='flex items-center gap-2'>
                        <BiCalendar className='text-gray-600' />
                        <span className='px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium'>
                          {book.publishYear}
                        </span>
                      </div>

                      {book.description && (
                        <div>
                          <p className='text-gray-600 text-sm line-clamp-3'>
                            {book.description}
                          </p>
                        </div>
                      )}

                      {book.link && (
                        <div className='flex items-center gap-2'>
                          <HiOutlineExternalLink className='text-gray-600' />
                          <a
                            href={book.link}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-blue-600 hover:text-blue-800 text-sm underline'
                          >
                            View Book Link
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                  <button
                    onClick={() => navigate('/')}
                    className='btn-secondary flex items-center justify-center gap-2 px-8 py-3'
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteBook}
                    disabled={loading}
                    className='btn-danger flex items-center justify-center gap-2 px-8 py-3'
                  >
                    {loading ? (
                      <>
                        <Spinner />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <span>🗑️</span>
                        Yes, Delete Book
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteBook;
