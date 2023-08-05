import React, { useState } from 'react'
import classNames from 'classnames'
import { Divider } from '@tremor/react'
import { Link, useLocation } from 'react-router-dom'
import { TrendingUpIcon, ChartBarIcon, CogIcon, LogoutIcon, MenuIcon, XIcon } from '@heroicons/react/solid'

const DASHBOARD_SIDEBAR_LINKS = [
  {
    key: 'overview',
    label: 'Overview',
    path: '/',
    icon: <ChartBarIcon className="h-6 w-6" />
  },
  {
    key: 'progress',
    label: 'Progress',
    path: '/progress',
    icon: <TrendingUpIcon className="h-6 w-6" />
  }
]

const DASHBOARD_SIDEBAR_BOTTOM_LINKS = [
  {
    key: 'settings',
    label: 'Settings',
    path: '/settings',
    icon: <CogIcon className="h-6 w-6" />
  }
]

const linkClass = 'flex items-center w-52 gap-2 font-semibold text-base py-3 pl-4 transition-colors duration-200 ease-in-out hover:bg-neutral-500'

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      <div className={classNames("bg-white font-cabin text-slate-800 w-52 h-screen py-6 flex flex-col ", { 'hidden': !isOpen })}>
        <div className="flex justify-between items-center px-4 mb-8">
          <h1 className="text-3xl font-bold">Sidra</h1>
          <XIcon className="h-6 w-6 cursor-pointer" onClick={() => setIsOpen(false)} />
        </div>
        <div className="flex-1 space-y-4">
          {DASHBOARD_SIDEBAR_LINKS.map((link) => (
            <SidebarLink key={link.key} link={link} />
          ))}
        </div>
        <div className="mt-6">
          <div className="px-4">
            <Divider />
          </div>
          {DASHBOARD_SIDEBAR_BOTTOM_LINKS.map((link) => (
            <SidebarLink key={link.key} link={link} />
          ))}
          <div className={classNames(linkClass, 'cursor-pointer text-red-500 hover:text-red-400')}>
            <LogoutIcon className="h-6 w-6" />
            <span className="ml-2">Logout</span>
          </div>
        </div>
      </div>
      {!isOpen && (<MenuIcon className="h-6 w-6 cursor-pointer fixed top-4 left-4 z-50" onClick={() => setIsOpen(true)} />)}
    </>
  )
}

function SidebarLink({ link }) {
  const { pathname } = useLocation()

  return (
    <Link
      to={link.path}
      className={classNames(pathname === link.path ? 'bg-gray-100 text-teal-700' : 'text-teal-600', linkClass)}
    >
      {link.icon}
      <span className="ml-2">{link.label}</span>
    </Link>
  )
}
