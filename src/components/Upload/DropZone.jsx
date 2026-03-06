import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload as UploadIcon, File } from 'lucide-react'

export default function DropZone({ displayName, file, onDrop, onRemove }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
    maxFiles: 1,
  })

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors duration-200
        ${isDragActive ? 'border-emerald-500 bg-emerald-500/10'
          : displayName ? 'border-emerald-500 bg-gray-800/80'
          : 'border-gray-700 hover:border-emerald-500/50 hover:bg-gray-800/50'}
      `}
    >
      <input {...getInputProps()} />
      {displayName ? (
        <div className="flex flex-col items-center">
          <div className="h-16 w-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4">
            <File className="h-8 w-8 text-emerald-400" />
          </div>
          <p className="text-gray-300 text-sm break-all max-w-[400px] mx-auto font-medium">{displayName}</p>
          {file ? (
            <p className="text-sm text-gray-400 mt-1">{(file.size/1024/1024).toFixed(2)} MB · Click to change file</p>
          ) : (
            <p className="text-xs text-amber-400/70 mt-2 font-mono">⚠ Navigated away — click to re-select for re-analysis</p>
          )}
          <button
            onClick={e => { e.stopPropagation(); onRemove() }}
            className="mt-3 text-xs text-red-400 hover:text-red-300 border border-red-400/30 rounded-lg px-4 py-1.5 hover:bg-red-500/10 transition-colors"
          >
            ✕ Remove File
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="h-16 w-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <UploadIcon className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-lg font-medium text-white mb-2">Drag & drop your file here</p>
          <p className="text-sm text-gray-400">Supports .PDF, .CSV, and .XLSX up to 50MB</p>
        </div>
      )}
    </div>
  )
}