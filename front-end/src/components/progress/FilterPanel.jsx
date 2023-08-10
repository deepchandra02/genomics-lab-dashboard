import React, { useState } from 'react'
import { Accordion, AccordionList, AccordionBody, MultiSelect, MultiSelectItem, AccordionHeader, Button, Divider, Icon } from '@tremor/react'
import { TrendingUpIcon, ChartBarIcon, ChevronRightIcon, CogIcon, LogoutIcon, MenuIcon, XIcon, ChevronLeftIcon } from '@heroicons/react/solid'
import Slider from '@mui/material/Slider';

function valuetext(value) {
  return `${value}°C`;
}

const FilterPanel = (props) => {
  const [value, setValue] = React.useState([20, 37]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <>
      <div className="transition  ease-in-out duration-1000 sticky top-0 bg-white resize-x font-cabin text-slate-800 min-h-screen h-full max-w-72 py-6 flex flex-col justify-between rounded-sm">
        <div className="flex items-center justify-between pl-4 mb-8">
          <h1 className="text-xl font-bold">Filters</h1>
          <Icon
            icon={XIcon}
            size='lg'
            className="mr-4 cursor-pointer"
            onClick={() => props.setFilterPanelOpen(false)}
          />
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
                <Slider
                  getAriaLabel={() => 'Temperature range'}
                  step={1}
                  marks
                  value={value}
                  min={0}
                  max={10}
                  onChange={handleChange}
                  valueLabelDisplay="auto"
                  getAriaValueText={valuetext}
                />
                <MultiSelect
                  onValueChange={props.setFilterQpcr}
                  placeholder="QPCR..."
                  className="text-sm z-10"
                >
                  {Array.from(new Set(props.data.map((item) => (item.qpcr !== null ? item.qpcr : "Missing"))))
                    .sort((a, b) => (a === "Missing" ? -1 : b === "Missing" ? 1 : a.localeCompare(b)))
                    .map((qpcr) => (
                      <MultiSelectItem key={qpcr} value={qpcr} className="text-xs">
                        {qpcr}
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
