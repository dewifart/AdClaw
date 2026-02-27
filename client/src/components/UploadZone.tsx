import { Upload, FileText, X } from "lucide-react";
import { useCallback, useState, type DragEvent } from "react";

interface UploadZoneProps {
  label: string;
  accept?: string;
  file: File | null;
  onFile: (file: File | null) => void;
  testId: string;
}

export function UploadZone({ label, accept, file, onFile, testId }: UploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      onFile(droppedFile);
    }
  }, [onFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      onFile(selectedFile);
    }
  }, [onFile]);

  if (file) {
    return (
      <div className="glass-panel rounded-xl p-4" data-testid={testId}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#6B7B8D]/10 border border-[#6B7B8D]/20 flex items-center justify-center">
              <FileText className="w-5 h-5 text-[#8A9AAD]" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">{file.name}</p>
              <p className="text-xs text-white/40">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
          </div>
          <button
            onClick={() => onFile(null)}
            className="w-8 h-8 rounded-full bg-[#1a1a1a] flex items-center justify-center text-white/40 hover:text-white transition-all duration-200"
            data-testid={`button-remove-${testId}`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <label
      className={`glass-panel rounded-xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-300 border ${
        isDragOver
          ? "border-[#6B7B8D]/40 bg-[#6B7B8D]/5 shadow-[0_0_25px_rgba(107,123,141,0.15)]"
          : "border-[#1a1a1a] hover:border-[#6B7B8D]/20 hover:bg-[#0a0a0a] hover:shadow-[0_0_20px_rgba(107,123,141,0.08)]"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      data-testid={testId}
    >
      <input
        type="file"
        className="hidden"
        accept={accept}
        onChange={handleFileInput}
        data-testid={`input-file-${testId}`}
      />
      <div className="w-12 h-12 rounded-full bg-[#6B7B8D]/10 border border-[#6B7B8D]/20 flex items-center justify-center">
        <Upload className="w-5 h-5 text-[#6B7B8D]" />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-white">{label}</p>
        <p className="text-xs text-white/40 mt-1">Drag & drop or click to browse</p>
      </div>
    </label>
  );
}
