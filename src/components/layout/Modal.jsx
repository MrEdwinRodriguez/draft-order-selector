export function Modal({ open, onClose, title, children, actionLabel = "OK" }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg rounded-xl bg-white shadow-2xl">
        {title && (
          <div className="px-5 py-4 border-b border-gray-200">
            <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          </div>
        )}
        <div className="px-5 py-4">{children}</div>
        <div className="px-5 py-4 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center rounded-md bg-gradient-to-r from-orange-500 to-red-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-orange-600 hover:to-red-600"
          >
            {actionLabel}
          </button>
        </div>
      </div>
    </div>
  )
} 