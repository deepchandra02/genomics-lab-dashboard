import React, { useState } from 'react'
import classNames from 'classnames'
import { Accordion, AccordionList, AccordionBody, MultiSelect, MultiSelectItem, AccordionHeader, Button, Divider, Icon } from '@tremor/react'
import { Link, useLocation } from 'react-router-dom'
import { TrendingUpIcon, ChartBarIcon, ChevronRightIcon, CogIcon, LogoutIcon, MenuIcon, XIcon, ChevronLeftIcon } from '@heroicons/react/solid'

const linkClass = 'flex justify-between items-center w-72 gap-2 font-semibold font-cabin py-3 ml-2 hover:bg-gray-300'

const FilterPanel = (props) => {
  return (
    <>
      <div className="bg-white font-cabin text-slate-800 min-h-screen h-full w-72 py-6 flex flex-col justify-between rounded-sm">
        <div className="flex items-center justify-between pl-4 mb-8">
          <h1 className="text-xl font-bold">Filters</h1>
          {/* <Icon
            icon={XIcon}
            size='lg'
            className="mr-4 cursor-pointer"
            onClick={() => props.setFilterPanelOpen(false)}
          /> */}
        </div>
        <div className="flex-1 space-y-4 w-72">
          <AccordionList className="mx-2">
            <Accordion>
              <AccordionHeader>
                Sample
              </AccordionHeader>
              <AccordionBody className="h-96">
                <MultiSelect
                  onValueChange={props.setFilterPoolingId}
                  placeholder="Pooling ID..."
                  className="text-sm"
                >
                  {Array.from(new Set(props.data.map((item) => item.pooling_id))).map((pooling_id) => (
                    <MultiSelectItem key={pooling_id} value={pooling_id} className="text-xs">
                      {pooling_id}
                    </MultiSelectItem>
                  ))}
                </MultiSelect>

                <MultiSelect
                  onValueChange={props.setFilterDataSample}
                  placeholder="Data Sample..."
                  className="text-sm"
                >
                  {Array.from(new Set(props.data.map((item) => item.data_sample))).map((data_sample) => (
                    <MultiSelectItem key={data_sample} value={data_sample} className="text-xs">
                      {data_sample}
                    </MultiSelectItem>
                  ))}
                </MultiSelect>
              </AccordionBody>
            </Accordion>
            <Accordion>
              <AccordionHeader>
                Sample
              </AccordionHeader>
              <AccordionBody className="h-96">
                <MultiSelect
                  onValueChange={props.setFilterPoolingId}
                  placeholder="Pooling ID..."
                  className="text-sm"
                >
                  {Array.from(new Set(props.data.map((item) => item.pooling_id))).map((pooling_id) => (
                    <MultiSelectItem key={pooling_id} value={pooling_id} className="text-xs">
                      {pooling_id}
                    </MultiSelectItem>
                  ))}
                </MultiSelect>

                <MultiSelect
                  onValueChange={props.setFilterDataSample}
                  placeholder="Data Sample..."
                  className="text-sm"
                >
                  {Array.from(new Set(props.data.map((item) => item.data_sample))).map((data_sample) => (
                    <MultiSelectItem key={data_sample} value={data_sample} className="text-xs">
                      {data_sample}
                    </MultiSelectItem>
                  ))}
                </MultiSelect>
              </AccordionBody>
            </Accordion>
          </AccordionList>
        </div>
      </div>
    </>
  )
}

export default FilterPanel
