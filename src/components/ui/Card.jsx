import clsx from 'clsx'

export default function Card({ children, className, onClick }) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  )
}
