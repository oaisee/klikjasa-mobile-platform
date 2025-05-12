
import { Upload } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface IdCardUploaderProps {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedFile: File | null;
}

export function IdCardUploader({ onFileChange, selectedFile }: IdCardUploaderProps) {
  return (
    <div>
      <Label htmlFor="idCard">ID Card (KTP)</Label>
      <div className="mt-1 flex items-center">
        <label className="block w-full cursor-pointer">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-klikjasa-purple transition-colors">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-2 text-sm text-gray-600">
              {selectedFile ? selectedFile.name : 'Upload a photo of your ID card (KTP)'}
            </div>
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
