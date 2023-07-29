import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

function Layout({ children }) {
  return (
    <div className="bg-neutral-100 h-screen w-screen overflow-hidden flex flex-row">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-x-auto">
        <div className="flex-1 p-4 min-h-0 ">
          {children || <Outlet />}
        </div>
      </div>
    </div>
  )
}

export default Layout
