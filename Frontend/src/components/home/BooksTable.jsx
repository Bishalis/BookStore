import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { BiShow } from 'react-icons/bi';
import { MdOutlineDelete } from 'react-icons/md';
import { HiOutlineExternalLink } from 'react-icons/hi';

const BooksTable = ({ books, onDelete }) => {
  const handleDelete = (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      onDelete(id);
    }
  };

  return (
    <div className='overflow-x-auto'>
      <table className='w-full'>
        <thead>
          <tr className='bg-gray-50 border-b border-gray-200'>
            <th className='text-left py-4 px-6 font-semibold text-gray-700'>#</th>
            <th className='text-left py-4 px-6 font-semibold text-gray-700'>Book</th>
            <th className='text-left py-4 px-6 font-semibold text-gray-700 hidden md:table-cell'>Author</th>
            <th className='text-left py-4 px-6 font-semibold text-gray-700 hidden lg:table-cell'>Year</th>
            <th className='text-left py-4 px-6 font-semibold text-gray-700 hidden lg:table-cell'>Link</th>
            <th className='text-center py-4 px-6 font-semibold text-gray-700'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book, index) => (
            <tr 
              key={book._id} 
              className='border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200'
            >
              <td className='py-4 px-6 text-gray-600 font-medium'>
                {index + 1}
              </td>
              <td className='py-4 px-6'>
                <div className='flex items-center gap-3'>
                  {book.imageUrl ? (
                    <img
                      src={book.imageUrl}
                      alt={book.title}
                      className='w-12 h-16 object-cover rounded-lg shadow-sm'
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className='w-12 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center'>
                      <span className='text-blue-600 text-lg'>📚</span>
                    </div>
                  )}
                  <div>
                    <h3 className='font-semibold text-gray-800 line-clamp-1'>{book.title}</h3>
                    <p className='text-sm text-gray-500 line-clamp-1 md:hidden'>
                      {book.author} • {book.publishYear}
                    </p>
                  </div>
                </div>
              </td>
              <td className='py-4 px-6 text-gray-700 hidden md:table-cell'>
                {book.author}
              </td>
              <td className='py-4 px-6 text-gray-700 hidden lg:table-cell'>
                <span className='px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium'>
                  {book.publishYear}
                </span>
              </td>
              <td className='py-4 px-6 hidden lg:table-cell'>
                {book.link ? (
                  <a
                    href={book.link}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors duration-200'
                  >
                    <HiOutlineExternalLink className='text-sm' />
                    <span className='text-sm'>View</span>
                  </a>
                ) : (
                  <span className='text-gray-400 text-sm'>-</span>
                )}
              </td>
              <td className='py-4 px-6'>
                <div className='flex items-center justify-center gap-2'>
                  <Link 
                    to={`/books/details/${book._id}`}
                    className='p-2 hover:bg-green-100 rounded-lg transition-colors duration-200'
                    title='View Details'
                  >
                    <BiShow className='text-lg text-green-600' />
                  </Link>
                  
                  <Link 
                    to={`/books/edit/${book._id}`}
                    className='p-2 hover:bg-yellow-100 rounded-lg transition-colors duration-200'
                    title='Edit Book'
                  >
                    <AiOutlineEdit className='text-lg text-yellow-600' />
                  </Link>
                  
                  <button
                    onClick={() => handleDelete(book._id, book.title)}
                    className='p-2 hover:bg-red-100 rounded-lg transition-colors duration-200'
                    title='Delete Book'
                  >
                    <MdOutlineDelete className='text-lg text-red-600' />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {books.length === 0 && (
        <div className='text-center py-12 text-gray-500'>
          <p>No books found</p>
        </div>
      )}
    </div>
  );
};

export default BooksTable;
