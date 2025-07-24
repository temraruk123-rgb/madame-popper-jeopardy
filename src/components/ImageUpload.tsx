import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, X, Image } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadProps {
  value?: string;
  onChange: (imageUrl: string | undefined) => void;
  maxSize?: number; // in MB
}

export const ImageUpload = ({ value, onChange, maxSize = 5 }: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      toast({
        title: "File too large",
        description: `Please select an image smaller than ${maxSize}MB`,
        variant: "destructive"
      });
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    try {
      // Convert to base64 for local storage
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onChange(result);
        setIsUploading(false);
        toast({
          title: "Success",
          description: "Image uploaded successfully"
        });
      };
      reader.onerror = () => {
        setIsUploading(false);
        toast({
          title: "Error",
          description: "Failed to upload image",
          variant: "destructive"
        });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setIsUploading(false);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive"
      });
    }
  };

  const removeImage = () => {
    onChange(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {value ? (
        <Card className="p-3">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <img
                src={value}
                alt="Uploaded content"
                className="max-w-full h-auto max-h-32 rounded border"
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={removeImage}
              className="text-destructive hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors">
          <div className="p-6 text-center">
            <Button
              type="button"
              variant="ghost"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="h-auto p-4 flex-col gap-2"
            >
              {isUploading ? (
                <div className="animate-spin">
                  <Upload className="h-6 w-6" />
                </div>
              ) : (
                <Image className="h-6 w-6" />
              )}
              <span className="text-sm">
                {isUploading ? 'Uploading...' : 'Click to upload image'}
              </span>
              <span className="text-xs text-muted-foreground">
                Max {maxSize}MB, JPG, PNG, GIF
              </span>
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};