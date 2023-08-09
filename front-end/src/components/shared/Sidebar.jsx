import React, { useState } from 'react'
import classNames from 'classnames'
import { Divider } from '@tremor/react'
import { Link, useLocation } from 'react-router-dom'
import { TrendingUpIcon, ChartBarIcon, CogIcon, LogoutIcon, XIcon } from '@heroicons/react/solid'

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

const linkClass = 'flex justify-between items-center w-72 gap-2 font-semibold font-cabin py-3 pl-4 hover:bg-gray-300'

export default function Sidebar(props) {

  function SidebarLink({ link }) {
    const { pathname } = useLocation()

    return (
      <Link
        to={link.path}
        className={classNames(pathname === link.path ? 'bg-gray-100 text-teal-700' : 'text-teal-600', linkClass)}
      >
        <div className="flex">
          {link.icon}
          <span className="ml-2">{link.label}</span>
        </div>
      </Link>
    )
  }
  return (
    <>
      <div className="bg-white font-cabin text-slate-800 w-72 h-screen py-6 flex flex-col justify-between">
        <div className="flex flex-col">
          <div className="flex justify-between items-center px-4 mb-8">
            <XIcon className="h-6 w-6 cursor-pointer" onClick={() => props.setIsOpen(false)} />
            <h1 className="text-xl font-bold">Navigation Panel</h1>
          </div>
          <div className="flex-1 space-y-4">
            {DASHBOARD_SIDEBAR_LINKS.map((link) => (
              <SidebarLink key={link.key} link={link} />
            ))}
          </div>
        </div>
        <div className="mt-6">
          <div className="px-4">
            <Divider />
          </div>
          {DASHBOARD_SIDEBAR_BOTTOM_LINKS.map((link) => (
            <SidebarLink key={link.key} link={link} />
          ))}
          <div className={classNames(linkClass, 'cursor-pointer text-red-500 hover:text-red-400')}>
            <div className="flex">
              <LogoutIcon className="h-6 w-6" />
              <span className="ml-2">Logout</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}


