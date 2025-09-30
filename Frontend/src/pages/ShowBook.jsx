import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import { PiBookOpenTextLight } from 'react-icons/pi';
import { BiUserCircle, BiCalendar } from 'react-icons/bi';
import { HiOutlineExternalLink } from 'react-icons/hi';
import { AiOutlineEdit } from 'react-icons/ai';
import { MdOutlineDelete } from 'react-icons/md';
import { useSnackbar } from 'notistack';

const ShowBook = () => {
  const [book, setBook] = useState({});
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:3000/books/${id}`)
      .then((response) => {
        setBook(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        enqueueSnackbar('Failed to load book details', { variant: 'error' });
      });
  }, [id, enqueueSnackbar]);

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${book.title}"?`)) {
      try {
        await axios.delete(`http://localhost:3000/books/${id}`);
        enqueueSnackbar('Book deleted successfully', { variant: 'success' });
        // Navigate back to home
        window.location.href = '/';
      } catch (error) {
        console.log(error);
        enqueueSnackbar('Failed to delete book', { variant: 'error' });
      }
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4'>
        <div className='max-w-4xl mx-auto'>
          <BackButton />
          <div className='flex justify-center items-center py-20'>
            <Spinner />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4'>
      <div className='max-w-4xl mx-auto'>
        <BackButton />
        
        <div className='bg-white rounded-2xl shadow-lg overflow-hidden mt-6'>
          {/* Header */}
          <div className='bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white'>
            <div className='flex items-center gap-4 mb-4'>
              <div className='p-3 bg-white/20 rounded-xl'>
                <PiBookOpenTextLight className='text-3xl' />
              </div>
              <div>
                <h1 className='text-3xl font-bold'>{book.title}</h1>
                <p className='text-blue-100'>Book Details</p>
              </div>
            </div>
          </div>

          <div className='p-8'>
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
              {/* Left Column - Image */}
              <div className='lg:col-span-1'>
                <div className='sticky top-8'>
                  {book.imageUrl && !imageError ? (
                    <img
                      src={book.imageUrl}
                      alt={book.title}
                      className='w-full h-96 object-cover rounded-xl shadow-lg'
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className='w-full h-96 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-lg flex items-center justify-center'>
                      <PiBookOpenTextLight className='text-8xl text-gray-400' />
                    </div>
                  )}
                  
                  {/* Action Buttons */}
                  <div className='flex gap-3 mt-6'>
                    <Link
                      to={`/books/edit/${book._id}`}
                      className='flex-1 btn-primary flex items-center justify-center gap-2'
                    >
                      <AiOutlineEdit className='text-lg' />
                      Edit Book
                    </Link>
                    <button
                      onClick={handleDelete}
                      className='flex-1 btn-danger flex items-center justify-center gap-2'
                    >
                      <MdOutlineDelete className='text-lg' />
                      Delete
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column - Details */}
              <div className='lg:col-span-2 space-y-6'>
                {/* Author */}
                <div className='bg-gray-50 rounded-xl p-6'>
                  <div className='flex items-center gap-3 mb-3'>
                    <div className='p-2 bg-purple-100 rounded-lg'>
                      <BiUserCircle className='text-purple-600 text-xl' />
                    </div>
                    <h3 className='text-lg font-semibold text-gray-800'>Author</h3>
                  </div>
                  <p className='text-gray-700 text-lg'>{book.author}</p>
                </div>

                {/* Publish Year */}
                <div className='bg-gray-50 rounded-xl p-6'>
                  <div className='flex items-center gap-3 mb-3'>
                    <div className='p-2 bg-blue-100 rounded-lg'>
                      <BiCalendar className='text-blue-600 text-xl' />
                    </div>
                    <h3 className='text-lg font-semibold text-gray-800'>Publish Year</h3>
                  </div>
                  <span className='px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium'>
                    {book.publishYear}
                  </span>
                </div>

                {/* Description */}
                {book.description && (
                  <div className='bg-gray-50 rounded-xl p-6'>
                    <h3 className='text-lg font-semibold text-gray-800 mb-3'>Description</h3>
                    <p className='text-gray-700 leading-relaxed'>{book.description}</p>
                  </div>
                )}

                {/* Book Link */}
                {book.link && (
                  <div className='bg-gray-50 rounded-xl p-6'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-3'>
                        <div className='p-2 bg-indigo-100 rounded-lg'>
                          <HiOutlineExternalLink className='text-indigo-600 text-xl' />
                        </div>
                        <h3 className='text-lg font-semibold text-gray-800'>Book Link</h3>
                      </div>
                      <a
                        href={book.link}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='btn-primary flex items-center gap-2'
                      >
                        <HiOutlineExternalLink className='text-lg' />
                        View Book
                      </a>
                    </div>
                  </div>
                )}

                {/* Metadata */}
                <div className='bg-gray-50 rounded-xl p-6'>
                  <h3 className='text-lg font-semibold text-gray-800 mb-4'>Book Information</h3>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
                    <div>
                      <span className='text-gray-600'>Book ID:</span>
                      <p className='font-mono text-gray-800 break-all'>{book._id}</p>
                    </div>
                    <div>
                      <span className='text-gray-600'>Created:</span>
                      <p className='text-gray-800'>
                        {book.createdAt ? new Date(book.createdAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <span className='text-gray-600'>Last Updated:</span>
                      <p className='text-gray-800'>
                        {book.updatedAt ? new Date(book.updatedAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowBook;
