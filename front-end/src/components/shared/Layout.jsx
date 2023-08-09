import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import { Icon } from '@tremor/react'
import { MenuIcon } from '@heroicons/react/solid'

function Layout({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-neutral-100 h-screen w-screen overflow-hidden flex flex-row">
      <div>
        {!isOpen && (
          <Icon
            onClick={() => setIsOpen(true)}
            icon={MenuIcon}
            variant='shadow'
            size='lg'
            tooltip='Open Navigation Panel'
            className='m-4 cursor-pointer'
          />
        )}
        {isOpen && (
          <Sidebar setIsOpen={setIsOpen} />
        )}
      </div>
      <div className="flex flex-col flex-1 overflow-x-auto">
        <div className="flex-1 px-4 pb-4 min-h-0 ">
          {children || <Outlet />}
        </div>
      </div>
    </div>
  )
}

export default Layout
