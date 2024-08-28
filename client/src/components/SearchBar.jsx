import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

function SearchBar() {
  return (
    <div className='flex w-[95%] mx-auto mt-2 justify-center items-center py-1 rounded-full h-fit bg-[#6c6c6c39] backdrop-blur-lg px-2'>
        <input type="text" className='w-[90%] h-full text-white  pl-2 rounded-full outline-none border-none text-xl placeholder:text-lg placeholder:text-white placeholder:text-opacity-20 bg-transparent '  placeholder='Search' />
        <div className='bg-green-600 rounded-full px-4 flex justify-center items-center hover:cursor-pointer h-9'>
        <FontAwesomeIcon icon={faSearch} className='h-5 w-5 text-white' />
        </div>
        
        
      
    </div>
  )
}

export default SearchBar
