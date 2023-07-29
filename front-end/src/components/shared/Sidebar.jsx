import React from 'react'
import classNames from 'classnames'
import { NavLink } from 'react-router-dom'

import { XCircleIcon, CogIcon } from '@heroicons/react/solid'

const DASHBOARD_SIDEBAR_LINKS = [
  {
    key: 'overview',
    label: 'Overview',
    path: '/',
    icon: <XCircleIcon />
  },
  {
    key: 'progress',
    label: 'Progress',
    path: '/progress',
    icon: <XCircleIcon />
  }
]

const DASHBOARD_SIDEBAR_BOTTOM_LINKS = [
  {
    key: 'settings',
    label: 'Settings',
    path: '/settings',
    icon: <CogIcon />
  }
]

const linkClass = 'flex items-center gap-2 font-light px-3 py-2 hover:bg-neutral-700 hover:no-underline active:bg-neutral-600 rounded-sm text-base'

export default function Sidebar() {
  return (
    <div className="bg-neutral-900 w-40 p-3 flex flex-col">
      <div className="flex items-center gap-2 px-1 py-3">
        <span className="text-neutral-200 text-lg">OpenShop</span>
      </div>
      <div className="py-8 flex flex-1 flex-col gap-0.5">
        {DASHBOARD_SIDEBAR_LINKS.map((link) => (
          <NavLink
            key={link.key}
            to={link.path}
            className={classNames('text-neutral-400', linkClass)}
            activeClassName='bg-neutral-700 text-white'
            exact
          >
            <span className="text-xl">{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </div>
      <div className="flex flex-col gap-0.5 pt-2 border-t border-neutral-700">
        {DASHBOARD_SIDEBAR_BOTTOM_LINKS.map((link) => (
          <NavLink
            key={link.key}
            to={link.path}
            className={classNames('text-neutral-400', linkClass)}
            activeClassName='bg-neutral-700 text-white'
            exact
          >
            <span className="text-xl">{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
        <div className={classNames(linkClass, 'cursor-pointer text-red-500')}>
          <span className="text-xl">
            <XCircleIcon />
          </span>
          Logout
        </div>
      </div>
    </div>
  )
}
