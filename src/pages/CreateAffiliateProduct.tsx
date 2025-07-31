import { useState, useEffect, useRef, ChangeEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import config from '../config/config';
import { Upload, Check, AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import affiliateService, { UploadUrlData } from '../services/affiliateService';

// Helper: convert any image file to JPEG (returns a new File object)
const convertImageFileToJpeg = (file: File, quality = 0.9): Promise<File> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      if (!e.target) return reject(new Error('Failed to read file'));
      img.src = e.target.result as string;
    };

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Canvas not supported'));
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error('JPEG conversion failed'));
          const jpegFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.jpg'), {
            type: 'image/jpeg',
            lastModified: Date.now(),
          });
          resolve(jpegFile);
        },
        'image/jpeg',
        quality
      );
    };

    img.onerror = (err) => reject(err);

    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
};

// Using UploadUrlData from affiliateService

type Step = 'upload' | 'details';

const CreateAffiliateProduct = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState<Step>('upload');
  const [uploadData, setUploadData] = useState<UploadUrlData | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [generalError, setGeneralError] = useState('');
  
  // Form state for step 2
  const [name, setName] = useState('');
  const [affiliateLink, setAffiliateLink] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Get upload data from navigation state
  useEffect(() => {
    if (location.state && location.state.uploadData) {
      setUploadData(location.state.uploadData);
    } else {
      setGeneralError('Missing upload information. Please try again.');
    }
  }, [location.state]);
  
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file type - only allow common image formats
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setUploadError('Please select a valid image file (JPEG, PNG, GIF, WebP)');
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('File size exceeds 5MB limit');
        return;
      }
      
      console.log(`Selected file: ${file.name}, type: ${file.type}, size: ${(file.size / 1024).toFixed(1)}KB`);
      setSelectedFile(file);
      setUploadError('');
    }
  };
  
  const getUploadUrl = async () => {
    try {
      setIsUploading(true);
      setUploadError('');
      
      // Use affiliate service to get upload URL
      const data = await affiliateService.getUploadUrl();
      setUploadData(data);
      
      return data;
    } catch (error) {
      console.error('Error getting upload URL:', error);
      
      // Handle unauthorized error
      if (error instanceof Error && error.message === 'Unauthorized') {
        navigate('/admin/login');
        return null;
      }
      
      setUploadError('Failed to get upload URL. Please try again.');
      return null;
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleUpload = async () => {
    if (!selectedFile || !uploadData) {
      setUploadError('Please select a file to upload');
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    setUploadError('');
    
    try {
      // Get a fresh upload URL using the affiliate service
      const freshUploadData = await affiliateService.getUploadUrl();
      
      // If we couldn't get a fresh URL, use the existing one as fallback
      const urlToUse = freshUploadData || uploadData;
      
      if (freshUploadData) {
        // Update the upload data with fresh values
        setUploadData(freshUploadData);
      }
      
      console.log('Starting upload to:', urlToUse.uploadUrl);
      
      console.log('Preparing for direct binary upload to S3...');
      
      // Strip out query parameters from the URL for logging purposes
      const baseUrl = urlToUse.uploadUrl.split('?')[0];
      console.log(`Upload destination: ${baseUrl}`);
      
      // Log the file details
      console.log(`File: ${selectedFile.name}, Type: ${selectedFile.type}, Size: ${selectedFile.size} bytes`);
      
      // Ensure we upload JPEG regardless of original type
      let fileToUpload: File = selectedFile;
      if (selectedFile.type !== 'image/jpeg') {
        try {
          console.log('Converting image to JPEG before upload...');
          fileToUpload = await convertImageFileToJpeg(selectedFile);
        } catch (convErr) {
          console.error('JPEG conversion failed:', convErr);
          setUploadError('Image conversion failed. Please try a different image.');
          setIsUploading(false);
          return;
        }
      }

      // Use XMLHttpRequest for better control over the upload process
      const xhr = new XMLHttpRequest();
      
      // Setup progress tracking
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          console.log(`Upload progress: ${percentComplete}%`);
          setUploadProgress(percentComplete);
        }
      };
      
      // Create a promise to handle the XHR request
      const uploadPromise = new Promise((resolve, reject) => {
        xhr.open('PUT', urlToUse.uploadUrl);
        
        // Set minimal headers for S3 - DO NOT set x-amz-acl header
        // The presigned URL already includes the necessary permissions
        xhr.setRequestHeader('Content-Type', 'image/jpeg');
        
        // Handle successful response
        xhr.onload = () => {
          console.log(`Upload completed with status: ${xhr.status}`);
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(xhr.response);
          } else {
            reject(new Error(`Upload failed with status: ${xhr.status} - ${xhr.statusText}`));
          }
        };
        
        // Handle network errors
        xhr.onerror = () => {
          console.error('Network error during upload');
          reject(new Error('Network error during upload'));
        };
        
        // Log any unexpected errors
        xhr.onabort = () => console.log('Upload aborted');
        xhr.ontimeout = () => console.log('Upload timed out');
        
        // Send the file as raw binary data
        console.log('Sending file to S3...');
        xhr.send(fileToUpload);
      });
      
      console.log('Waiting for upload to complete...');
      
      // Wait for upload to complete
      await uploadPromise;
      
      // Verify the image is accessible
      console.log(`Verifying image is accessible at: ${urlToUse.imageUrl}`);
      try {
        const verifyResponse = await fetch(urlToUse.imageUrl, { method: 'HEAD' });
        if (verifyResponse.ok) {
          console.log('Image verified successfully!');
        } else {
          console.warn(`Image verification returned status ${verifyResponse.status}`);
          // Continue anyway, as the upload might still have worked
        }
      } catch (verifyError) {
        console.warn('Image verification failed, but continuing:', verifyError);
        // Continue anyway as this might just be a CORS issue with the HEAD request
      }
      
      // If we get here, the upload was successful
      console.log('Upload successful!');
      
      setUploadSuccess(true);
      setUploadProgress(100);
      
      // Move to the next step after a short delay
      setTimeout(() => {
        setCurrentStep('details');
      }, 1000);
    } catch (error) {
      console.error('Error uploading image to S3:', error);
      
      // Check if we're in mock mode - proceed anyway for demo purposes
      if (config.features.useMockData) {
        console.log('MOCK MODE: Simulating successful upload despite error');
        // In mock mode, we'll pretend the upload succeeded even if it failed
        setUploadSuccess(true);
        setUploadProgress(100);
        
        setTimeout(() => {
          setCurrentStep('details');
        }, 1000);
      } else {
        // In real mode, show the error
        setUploadError(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!uploadData) {
      setGeneralError('Missing upload data. Please start over.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare product data
      const productData = {
        name,
        imageUrl: uploadData.imageUrl,
        affiliateLink
      };
      
      console.log('Creating product with data:', productData);
      
      // Use affiliate service to create the product
      const createdProduct = await affiliateService.createProduct(productData);
      
      console.log('Product created successfully:', createdProduct);
      setSubmitSuccess(true);
      
      // Navigate back to affiliate dashboard after a delay
      setTimeout(() => {
        navigate('/admin/dashboard', { state: { view: 'affiliatesDashboard' } });
      }, 2000);
    } catch (error) {
      console.error('Error creating affiliate product:', error);
      
      // Handle unauthorized error
      if (error instanceof Error && error.message === 'Unauthorized') {
        navigate('/admin/login');
        return;
      }
      
      setGeneralError('Failed to create product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCancel = () => {
    navigate('/admin/dashboard', { state: { view: 'affiliatesDashboard' } });
  };
  
  if (generalError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {generalError}
          </div>
          <button
            onClick={() => navigate('/admin/dashboard', { state: { view: 'affiliatesDashboard' } })}
            className="w-full bg-dokirana-primary text-white py-2 px-4 rounded-md hover:bg-dokirana-secondary transition-colors"
          >
            Back to Affiliate Dashboard
          </button>
        </div>
      </div>
    );
  }
  
  // Step indicator
  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-6">
      <div className="flex items-center">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'upload' ? 'bg-dokirana-primary text-white' : 'bg-green-500 text-white'}`}>
          {uploadSuccess ? <Check size={18} /> : '1'}
        </div>
        <div className={`h-1 w-16 ${uploadSuccess ? 'bg-green-500' : 'bg-gray-300'}`}></div>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'details' ? 'bg-dokirana-primary text-white' : 'bg-gray-300 text-gray-600'}`}>
          2
        </div>
      </div>
    </div>
  );
  
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-dokirana-primary text-white py-4 px-6 shadow-md">
        <div className="container-custom flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            {currentStep === 'upload' ? 'Upload Product Image' : 'Create New Affiliate Product'}
          </h1>
          <button
            onClick={handleCancel}
            className="bg-white text-dokirana-primary px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
        </div>
      </header>
      
      <main className="container-custom py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          {renderStepIndicator()}
          
          {!uploadData ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500">Loading upload data...</p>
            </div>
          ) : currentStep === 'upload' ? (
            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-semibold mb-4">Upload Product Image</h3>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-4 text-center cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => fileInputRef.current?.click()}>
                <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                <p className="text-gray-600 mb-1">Click to select an image file</p>
                <p className="text-xs text-gray-500">Max size: 5MB</p>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                  accept="image/*"
                />
              </div>
              
              {selectedFile && (
                <div className="mb-4">
                  <p className="text-sm font-medium">Selected file:</p>
                  <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <span className="text-sm truncate">{selectedFile.name}</span>
                    <span className="text-xs text-gray-500">{(selectedFile.size / 1024).toFixed(1)} KB</span>
                  </div>
                </div>
              )}
              
              {uploadError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
                  <div className="flex items-center">
                    <AlertCircle size={16} className="mr-2" />
                    {uploadError}
                  </div>
                </div>
              )}
              
              {isUploading && (
                <div className="mb-4">
                  <p className="text-sm font-medium mb-1">Uploading...</p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-dokirana-primary h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                  </div>
                </div>
              )}
              
              {uploadSuccess ? (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex items-center">
                  <Check size={18} className="mr-2" />
                  Image uploaded successfully!
                </div>
              ) : (
                <button
                  onClick={handleUpload}
                  disabled={!selectedFile || isUploading}
                  className={`w-full flex items-center justify-center bg-dokirana-primary text-white py-2 px-4 rounded-md hover:bg-dokirana-secondary transition-colors ${(!selectedFile || isUploading) ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isUploading ? 'Uploading...' : 'Upload Image'}
                  {!isUploading && <ArrowRight size={16} className="ml-2" />}
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Product Image</h3>
                <div className="border rounded-lg overflow-hidden h-64 flex items-center justify-center bg-gray-50">
                  <img 
                    src={uploadData.imageUrl} 
                    alt="Affiliate product" 
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2 truncate">Image URL: {uploadData.imageUrl}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Product Details</h3>
                
                {submitSuccess ? (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-6 rounded text-center">
                    <Check size={48} className="mx-auto mb-2" />
                    <h4 className="font-bold text-lg mb-1">Product Created Successfully!</h4>
                    <p>Redirecting to affiliate dashboard...</p>
                  </div>
                ) : (
                  <form onSubmit={handleCreateProduct}>
                    <div className="mb-4">
                      <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                        Product Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-dokirana-primary"
                        placeholder="Enter product name"
                        required
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="affiliateLink" className="block text-gray-700 font-medium mb-2">
                        Affiliate Link
                      </label>
                      <input
                        type="url"
                        id="affiliateLink"
                        value={affiliateLink}
                        onChange={(e) => setAffiliateLink(e.target.value)}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-dokirana-primary"
                        placeholder="https://affiliate-link-url.com"
                        required
                      />
                    </div>
                    
                    <div className="mb-6">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="isActive"
                          checked={isActive}
                          onChange={(e) => setIsActive(e.target.checked)}
                          className="h-4 w-4 text-dokirana-primary focus:ring-dokirana-primary border-gray-300 rounded"
                        />
                        <label htmlFor="isActive" className="ml-2 block text-gray-700">
                          Active Product
                        </label>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => setCurrentStep('upload')}
                        className="flex items-center justify-center bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
                      >
                        <ArrowLeft size={16} className="mr-2" />
                        Back
                      </button>
                      
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`flex-grow flex items-center justify-center bg-dokirana-primary text-white py-2 px-4 rounded-md hover:bg-dokirana-secondary transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                      >
                        {isSubmitting ? 'Creating...' : 'Create Product'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CreateAffiliateProduct;
