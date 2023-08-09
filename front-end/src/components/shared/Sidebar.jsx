import React, { useState } from 'react'
import classNames from 'classnames'
import { useFilters, Filters } from '../../pages/Progress'
import { Accordion, AccordionList, AccordionHeader, Button, Divider, Icon } from '@tremor/react'
import { Link, useLocation } from 'react-router-dom'
import { TrendingUpIcon, ChartBarIcon, ChevronRightIcon, CogIcon, LogoutIcon, MenuIcon, XIcon, ChevronLeftIcon } from '@heroicons/react/solid'
const data = require('../../data/data0_updated.json');

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

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [filter, setFilter] = useState(false);
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
        {link.path === '/progress' && pathname === link.path && (<Button
          className={"mr-4 p-2 h-6 bg-slate-700 hover:bg-slate-500 border-none"}
          variant="primary"
          onClick={() => setFilter(true)}
        >
          <Icon
            className="text-white"
            variant="simple"
            icon={ChevronRightIcon}
          />
        </Button>)}
      </Link>
    )
  }
  return (
    <>
      <div className={classNames("bg-white font-cabin text-slate-800 w-72 h-screen py-6 flex flex-col justify-between", { 'hidden': !isOpen })}>
        {!filter && (
          <div className="flex flex-col">
            <div className="flex justify-between items-center px-4 mb-8">
              <h1 className="text-3xl font-bold">Sidra</h1>
              <XIcon className="h-6 w-6 cursor-pointer" onClick={() => setIsOpen(false)} />
            </div>
            <div className="flex-1 space-y-4">
              {DASHBOARD_SIDEBAR_LINKS.map((link) => (
                <SidebarLink key={link.key} link={link} />
              ))}
            </div>
          </div>
        )}
        {filter && (
          <Filters
            setFilter={setFilter}
            setIsOpen={setIsOpen}
          />
        )}
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
      {!isOpen && (<MenuIcon className="h-6 w-6 cursor-pointer fixed top-4 left-2 z-50" onClick={() => setIsOpen(true)} />)}
    </>
  )
}


