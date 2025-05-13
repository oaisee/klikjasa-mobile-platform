
import { Upload } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';

interface IdCardUploaderProps {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedFile: File | null;
  error?: string | null;
}

export function IdCardUploader({ onFileChange, selectedFile, error }: IdCardUploaderProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Generate preview URL when file is selected
  useEffect(() => {
    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);
      
      // Clean up the URL when component unmounts or file changes
      return () => URL.revokeObjectURL(objectUrl);
    }
    return undefined;
  }, [selectedFile]);

  return (
    <div>
      <Label htmlFor="idCard">ID Card (KTP)</Label>
      <div className="mt-1 flex flex-col items-center">
        <label className={`block w-full cursor-pointer ${error ? 'border-red-300' : ''}`}>
          <div className={`border-2 border-dashed ${error ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-lg p-6 text-center hover:border-klikjasa-purple transition-colors`}>
            {!previewUrl ? (
              <>
                <Upload className={`mx-auto h-12 w-12 ${error ? 'text-red-400' : 'text-gray-400'}`} />
                <div className={`mt-2 text-sm ${error ? 'text-red-600' : 'text-gray-600'}`}>
                  Upload a photo of your ID card (KTP)
                </div>
                {error && (
                  <div className="mt-1 text-xs text-red-500">
                    Please select a valid image file
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center">
                <div className="relative w-full max-w-md mx-auto">
                  <img 
                    src={previewUrl} 
                    alt="ID Card preview" 
                    className="w-full h-auto object-contain rounded-md shadow-sm"
                  />
                  <div className="mt-2 text-sm text-gray-600">
                    {selectedFile?.name}
                  </div>
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setPreviewUrl(null);
                      const fileInput = document.getElementById('idCard') as HTMLInputElement;
                      if (fileInput) {
                        fileInput.value = '';
                        onFileChange({ target: { files: null } } as any);
                      }
                    }}
                    className="absolute top-2 right-2 bg-white bg-opacity-70 rounded-full p-1 shadow-sm hover:bg-opacity-100 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
          <input
            id="idCard"
            type="file"
            className="sr-only"
            accept="image/*"
            onChange={onFileChange}
            required
          />
        </label>
      </div>
    </div>
  );
}
