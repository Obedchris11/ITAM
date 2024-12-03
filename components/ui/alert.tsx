import { CheckCircle2, XCircle, X } from 'lucide-react'

type AlertPopupProps = {
  type: 'success' | 'error'
  message: string
  onClose?: () => void
}

export const AlertPopup = ({ type, message, onClose }: AlertPopupProps) => (
  <div
    className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg max-w-sm w-full mx-4 z-50 flex items-center justify-between
    ${type === 'success' ? 'bg-white border border-green-500' : 'bg-white border border-red-500'} 
    `}
  >
    <div className="flex items-start">
      {type === 'success' ? (
        <CheckCircle2 className="h-8 w-8 text-green-500 mr-3" />
      ) : (
        <XCircle className="h-8 w-8 text-red-500 mr-3" />
      )}
      <div>
        <span className={`text-lg font-bold ${type === 'success' ? 'text-green-700' : 'text-red-700'}`}>
          {type === 'success' ? 'Berhasil' : 'Gagal'}
        </span>
        <p className="text-sm text-gray-400">{message}</p>
      </div>
    </div>
    <button className="text-gray-400 hover:text-gray-600" onClick={onClose}>
      <X className="h-5 w-5" />
    </button>
  </div>
)