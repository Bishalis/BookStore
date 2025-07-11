import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from '../components/Spinner';
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle, BsSearch } from 'react-icons/bs';
import { MdOutlineAddBox, MdOutlineDelete } from 'react-icons/md';
import { HiOutlineViewGrid, HiOutlineViewList } from 'react-icons/hi';
import BooksTable from '../components/home/BooksTable';
import BooksCard from '../components/home/BooksCard';
import { useSnackbar } from 'notistack';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showType, setShowType] = useState('card');
  const [searchTerm, setSearchTerm] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    const filtered = books.filter(book =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBooks(filtered);
  }, [searchTerm, books]);

  const fetchBooks = () => {
    setLoading(true);
    axios
      .get('http://localhost:5555/books')
      .then((response) => {
        setBooks(response.data.data);
        setFilteredBooks(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        enqueueSnackbar('Failed to fetch books', { variant: 'error' });
      });
  };

  const handleDeleteBook = async (id) => {
    try {
      await axios.delete(`http://localhost:5555/books/${id}`);
      enqueueSnackbar('Book deleted successfully', { variant: 'success' });
      fetchBooks(); // Refresh the list
    } catch (error) {
      console.log(error);
      enqueueSnackbar('Failed to delete book', { variant: 'error' });
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='bg-white rounded-2xl shadow-lg p-6 mb-8'>
          <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6'>
            <div>
              <h1 className='text-4xl font-bold text-gray-800 mb-2'>📚 BookShelf</h1>
              <p className='text-gray-600'>Manage your personal book collection</p>
            </div>
            
            <Link 
              to='/books/create'
              className='btn-primary flex items-center gap-2 px-6 py-3 text-lg'
            >
              <MdOutlineAddBox className='text-xl' />
              Add New Book
            </Link>
          </div>
        </div>

        {/* Search and Controls */}
        <div className='bg-white rounded-2xl shadow-lg p-6 mb-8'>
          <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
            {/* Search Bar */}
            <div className='relative flex-1 max-w-md'>
              <BsSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
              <input
                type='text'
                placeholder='Search books by title, author, or description...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='input-field pl-10 pr-4 py-3 w-full'
              />
            </div>

            {/* View Toggle */}
            <div className='flex items-center gap-2 bg-gray-100 rounded-lg p-1'>
              <button
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${
                  showType === 'card' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                onClick={() => setShowType('card')}
              >
                <HiOutlineViewGrid className='text-lg' />
                <span className='hidden sm:inline'>Cards</span>
              </button>
              <button
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${
                  showType === 'table' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                onClick={() => setShowType('table')}
              >
                <HiOutlineViewList className='text-lg' />
                <span className='hidden sm:inline'>Table</span>
              </button>
            </div>
          </div>

          {/* Results Count */}
          <div className='mt-4 pt-4 border-t border-gray-200'>
            <p className='text-gray-600'>
              Showing {filteredBooks.length} of {books.length} books
              {searchTerm && ` for "${searchTerm}"`}
            </p>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className='flex justify-center items-center py-20'>
            <Spinner />
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className='bg-white rounded-2xl shadow-lg p-12 text-center'>
            <div className='text-6xl mb-4'>📖</div>
            <h3 className='text-2xl font-semibold text-gray-800 mb-2'>
              {searchTerm ? 'No books found' : 'No books yet'}
            </h3>
            <p className='text-gray-600 mb-6'>
              {searchTerm 
                ? `No books match your search for "${searchTerm}"`
                : 'Start building your book collection by adding your first book!'
              }
            </p>
            {!searchTerm && (
              <Link to='/books/create' className='btn-primary'>
                Add Your First Book
              </Link>
            )}
          </div>
        ) : (
          <div className='bg-white rounded-2xl shadow-lg overflow-hidden'>
            {showType === 'table' ? (
              <BooksTable books={filteredBooks} onDelete={handleDeleteBook} />
            ) : (
              <BooksCard books={filteredBooks} onDelete={handleDeleteBook} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;