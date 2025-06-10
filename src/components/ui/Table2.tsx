import React, { useState } from 'react'

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'

interface TableColumn<T> {
  header: string
  accessor: keyof T | ((data: T) => React.ReactNode)
  className?: string
}

interface TableProps<T> {
  data: T[]
  columns: TableColumn<T>[]
  pageSize?: number
  className?: string
}

function Table<T extends Record<string, any>>({ data, columns, pageSize = 5, className = '' }: TableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(data.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const currentData = data.slice(startIndex, endIndex)

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  const renderCell = (item: T, column: TableColumn<T>) => {
    if (typeof column.accessor === 'function') {
      return column.accessor(item)
    }

    
return item[column.accessor]
  }

  return (
    <div className='flex flex-col'>
      <div className='overflow-x-auto'>
        <table className={`min-w-full divide-y divide-gray-200 ${className}`}>
          <thead className='bg-gray-50'>
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  scope='col'
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${column.className || ''}`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {currentData.length > 0 ? (
              currentData.map((item, rowIndex) => (
                <tr key={rowIndex} className='hover:bg-gray-50'>
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className={`px-6 py-4 whitespace-nowrap text-sm text-gray-500 ${column.className || ''}`}
                    >
                      {renderCell(item, column)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center'>
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className='flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6'>
          <div className='flex-1 flex justify-between sm:hidden'>
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className='relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              Previous
            </button>
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className='ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              Next
            </button>
          </div>
          <div className='hidden sm:flex-1 sm:flex sm:items-center sm:justify-between'>
            <div>
              <p className='text-sm text-gray-700'>
                Showing <span className='font-medium'>{startIndex + 1}</span> to{' '}
                <span className='font-medium'>{Math.min(endIndex, data.length)}</span> of{' '}
                <span className='font-medium'>{data.length}</span> results
              </p>
            </div>
            <div>
              <nav className='relative z-0 inline-flex rounded-md shadow-sm -space-x-px' aria-label='Pagination'>
                <button
                  onClick={() => goToPage(1)}
                  disabled={currentPage === 1}
                  className='relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  <span className='sr-only'>First</span>
                  <ChevronsLeft className='h-5 w-5' />
                </button>
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className='relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  <span className='sr-only'>Previous</span>
                  <ChevronLeft className='h-5 w-5' />
                </button>

                {/* Page numbers */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum

                  if (totalPages <= 5) {
                    pageNum = i + 1
                  } else if (currentPage <= 3) {
                    pageNum = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = currentPage - 2 + i
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => goToPage(pageNum)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === pageNum
                          ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className='relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  <span className='sr-only'>Next</span>
                  <ChevronRight className='h-5 w-5' />
                </button>
                <button
                  onClick={() => goToPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className='relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  <span className='sr-only'>Last</span>
                  <ChevronsRight className='h-5 w-5' />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Table
