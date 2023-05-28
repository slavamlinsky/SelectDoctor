import React from 'react'

const ErrorWarning = (props) => {
  return (
    <div className='text-red-600 text-center text-sm'>{props.children}</div>
  )
}

export default ErrorWarning