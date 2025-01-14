import React from 'react'
import { FaChevronLeft } from 'react-icons/fa6'

const NotePage = () => {
  return (
    <div className='note'>
        <div className='note-header'>
            <h3>
                <FaChevronLeft />
            </h3>
            
        </div>
        <textarea></textarea>
    </div>
  )
}

export default NotePage
