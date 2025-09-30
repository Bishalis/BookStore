import React, { useState } from 'react';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { PiBookOpenTextLight, PiUploadSimple } from 'react-icons/pi';

const CreateBooks = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('');
  const [publishYear, setPublishYear] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [link, setLink] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploadMethod, setUploadMethod] = useState('url');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const validateForm = () => {
    const newErrors = {};
    
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!author.trim()) newErrors.author = 'Author is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    if (!publishYear) newErrors.publishYear = 'Publish year is required';
    else if (publishYear < 1800 || publishYear > new Date().getFullYear() + 1) {
      newErrors.publishYear = 'Please enter a valid year';
    }
    
    if (uploadMethod === 'url' && imageUrl && !isValidUrl(imageUrl)) {
      newErrors.imageUrl = 'Please enter a valid image URL';
    }
    
    if (link && !isValidUrl(link)) {
      newErrors.link = 'Please enter a valid link URL';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        enqueueSnackbar('File size must be less than 5MB', { variant: 'error' });
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      enqueueSnackbar('Please select a file first', { variant: 'error' });
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await axios.post('http://3.27.5.126:3000/books/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setImageUrl(response.data.imageUrl);
      enqueueSnackbar('Image uploaded successfully!', { variant: 'success' });
    } catch (error) {
      console.error('Upload error:', error);
      enqueueSnackbar('Failed to upload image', { variant: 'error' });
    } finally {
      setUploading(false);
    }
  };

  const handleSaveBook = () => {
    if (!validateForm()) {
      enqueueSnackbar('Please fix the errors in the form', { variant: 'error' });
      return;
    }

    const data = {
      title: title.trim(),
      author: author.trim(),
      description: description.trim(),
      publishYear: parseInt(publishYear),
      imageUrl: imageUrl.trim() || undefined,
      link: link.trim() || undefined,
    };
    
    setLoading(true);
    axios
      .post('http://3.27.5.126:3000/books', data)
      .then(() => {
        setLoading(false);
        enqueueSnackbar('Book created successfully!', { variant: 'success' });
        navigate('/');
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar(error.response?.data?.message || 'Failed to create book', { variant: 'error' });
        console.log(error);
      });
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4'>
      <div className='max-w-4xl mx-auto'>
        <BackButton />
        
        <div className='bg-white rounded-2xl shadow-lg p-8 mt-6'>
          <div className='flex items-center gap-3 mb-8'>
            <div className='p-3 bg-blue-100 rounded-xl'>
              <PiBookOpenTextLight className='text-3xl text-blue-600' />
            </div>
            <div>
              <h1 className='text-3xl font-bold text-gray-800'>Add New Book</h1>
              <p className='text-gray-600'>Fill in the details to add a new book to your collection</p>
            </div>
          </div>

          {loading && (
            <div className='flex justify-center mb-6'>
              <Spinner />
            </div>
          )}

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            {/* Left Column - Basic Info */}
            <div className='space-y-6'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Title <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`input-field ${errors.title ? 'border-red-500' : ''}`}
                  placeholder='Enter book title'
                />
                {errors.title && <p className='text-red-500 text-sm mt-1'>{errors.title}</p>}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Author <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className={`input-field ${errors.author ? 'border-red-500' : ''}`}
                  placeholder='Enter author name'
                />
                {errors.author && <p className='text-red-500 text-sm mt-1'>{errors.author}</p>}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Publish Year <span className='text-red-500'>*</span>
                </label>
                <input
                  type='number'
                  value={publishYear}
                  onChange={(e) => setPublishYear(e.target.value)}
                  className={`input-field ${errors.publishYear ? 'border-red-500' : ''}`}
                  placeholder='e.g., 2023'
                  min='1800'
                  max={new Date().getFullYear() + 1}
                />
                {errors.publishYear && <p className='text-red-500 text-sm mt-1'>{errors.publishYear}</p>}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Book Link (Optional)
                </label>
                <input
                  type='url'
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  className={`input-field ${errors.link ? 'border-red-500' : ''}`}
                  placeholder='https://example.com/book-link'
                />
                {errors.link && <p className='text-red-500 text-sm mt-1'>{errors.link}</p>}
              </div>
            </div>

            {/* Right Column - Description & Image */}
            <div className='space-y-6'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Description <span className='text-red-500'>*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={`input-field h-32 resize-none ${errors.description ? 'border-red-500' : ''}`}
                  placeholder='Enter book description...'
                />
                {errors.description && <p className='text-red-500 text-sm mt-1'>{errors.description}</p>}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Book Cover Image
                </label>
                
                <div className='space-y-4'>
                  <div className='flex gap-4'>
                    <label className='flex items-center'>
                      <input
                        type='radio'
                        value='url'
                        checked={uploadMethod === 'url'}
                        onChange={(e) => setUploadMethod(e.target.value)}
                        className='mr-2'
                      />
                      Image URL
                    </label>
                    <label className='flex items-center'>
                      <input
                        type='radio'
                        value='file'
                        checked={uploadMethod === 'file'}
                        onChange={(e) => setUploadMethod(e.target.value)}
                        className='mr-2'
                      />
                      Upload File
                    </label>
                  </div>
                  
                  {uploadMethod === 'url' ? (
                    <input
                      type='url'
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className={`input-field ${errors.imageUrl ? 'border-red-500' : ''}`}
                      placeholder='https://example.com/image.jpg'
                    />
                  ) : (
                    <div className='space-y-3'>
                      <input
                        type='file'
                        accept='image/*'
                        onChange={handleFileSelect}
                        className='input-field'
                      />
                      {selectedFile && (
                        <div className='flex items-center gap-3'>
                          <button
                            onClick={handleFileUpload}
                            disabled={uploading}
                            className='btn-primary flex items-center gap-2'
                          >
                            <PiUploadSimple className='text-lg' />
                            {uploading ? 'Uploading...' : 'Upload Image'}
                          </button>
                          {uploading && <Spinner />}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {errors.imageUrl && <p className='text-red-500 text-sm mt-1'>{errors.imageUrl}</p>}
                  
                  {/* Image Preview */}
                  {(imagePreview || imageUrl) && (
                    <div className='mt-4'>
                      <p className='text-sm text-gray-600 mb-2'>Preview:</p>
                      <img
                        src={imagePreview || imageUrl}
                        alt='Book cover preview'
                        className='w-32 h-32 object-cover rounded-lg border shadow-sm'
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className='flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200'>
            <button
              onClick={() => navigate('/')}
              className='btn-secondary'
            >
              Cancel
            </button>
            <button
              onClick={handleSaveBook}
              disabled={loading}
              className='btn-primary flex items-center gap-2'
            >
              {loading ? (
                <>
                  <Spinner />
                  Creating...
                </>
              ) : (
                <>
                  <PiBookOpenTextLight className='text-lg' />
                  Create Book
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBooks;