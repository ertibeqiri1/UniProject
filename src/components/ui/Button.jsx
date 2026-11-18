import clsx from 'clsx'

const variants = {
  primary:  'bg-primary-500 hover:bg-primary-600 text-white shadow-sm hover:shadow-md',
  secondary: 'bg-white hover:bg-gray-50 text-primary-600 border border-primary-500',
  outline:  'bg-transparent hover:bg-gray-50 text-gray-700 border border-gray-300',
  danger:   'bg-red-500 hover:bg-red-600 text-white shadow-sm',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3 text-base',
}

export default function Button({
  children,
  variant  = 'primary',
  size     = 'md',
  disabled = false,
  type     = 'button',
  onClick,
  className,
  ...props
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
        variants[variant],
        sizes[size],
        disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
