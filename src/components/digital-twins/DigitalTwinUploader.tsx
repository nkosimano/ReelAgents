import React, { useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { apiClient } from '../../lib/apiClient';

const DigitalTwinUploader: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/digital-twins/create', {
        method: 'POST',
        body: formData,
        headers: { Authorization: 'Bearer YOUR_TOKEN' }, // Replace with your actual token
      });
      const data = await response.json();
      return data;
    },
    onMutate: async (file) => {
      setStatus('uploading');
      setError(null);
    },
    onSuccess: (data) => {
      setStatus('success');
      setSelectedFile(null);
      queryClient.invalidateQueries({ queryKey: ['digital-twins'] });
    },
    onError: (err: any) => {
      setStatus('error');
      setError(err?.response?.data?.message || 'Upload failed.');
    },
    onSettled: () => {
      setTimeout(() => setStatus('idle'), 2000);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      mutation.mutate(selectedFile);
    }
  };

  return (
    <Card className="max-w-lg mx-auto border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-primary">Upload Digital Twin</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <input
            type="file"
            accept=".zip,.tar,.tar.gz,.json,.csv,.txt,.pdf,.docx,.png,.jpg,.jpeg"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="w-full"
            disabled={mutation.status === 'pending'}
          />
          {selectedFile && (
            <div className="text-neutral-700 dark:text-neutral-300">
              Selected: <span className="font-medium">{selectedFile.name}</span>
            </div>
          )}
          <Button
            variant="primary"
            onClick={handleUpload}
            disabled={!selectedFile || mutation.status === 'pending'}
            className="w-full"
          >
            {mutation.status === 'pending' ? 'Uploading...' : 'Begin AI Training'}
          </Button>
          {status === 'success' && (
            <div className="text-success text-sm">Upload successful! Training started.</div>
          )}
          {status === 'error' && (
            <div className="text-danger text-sm">{error}</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DigitalTwinUploader;
export { DigitalTwinUploader };
