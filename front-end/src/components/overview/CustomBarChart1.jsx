import React, { useState } from 'react'
import {
  BarChart,
  Button,
  Flex,
  Icon,
  Subtitle
} from "@tremor/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";

const CustomBarChart1 = (props) => {
  const [windowSize, setWindowSize] = useState(6);
  const [windowStart, setWindowStart] = useState(0); // Initial window start is 0
  const [toggleStacked, setToggleStacked] = useState(true);

  // Create a "windowed" subset of the data
  const windowedData = props.data.slice(windowStart, windowStart + windowSize);

  // Update the window start index to scroll through the data
  const scrollData = (direction) => {
    if (direction === "forward" && windowStart + windowSize < props.data.length) {
      setWindowStart(windowStart => windowStart + windowSize);
    } else if (direction === "backward" && windowStart - windowSize >= 0) {
      setWindowStart(windowStart => windowStart - windowSize);
    }
  };

  // Function to format the numbers to be displayed in US format
  const valueFormatter = (number) => `${Intl.NumberFormat("us").format(number).toString()}`;

  // Arguments to be passed to the BarChart component
  const barChartArgs = {
    categories: props.categories,
    animationDuration: 500,
    autoMinValue: true,
    className: props.className + " select-none",
    data: windowedData,
    index: props.index,
    colors: props.colors,
    showLegend: props.showLegend,
    yAxisWidth: props.yAxisWidth,
    valueFormatter: valueFormatter,
    stack: toggleStacked
  };

  return (
    <div className="flex flex-col space-y-2 h-full">
      <Flex className="gap-x-4 text-gray-500 hover:text-black h-[10%]" justifyContent='end' alignItems='center'>
        <input
          type="number"
          id="windowSizeStepper"
          className="text-center w-[4rem] h-9 p-2 border border-gray-200 shadow-tremor-input rounded-lg "
          value={windowSize}
          step="6"
          min="0"
          max={props.data.length}
          onChange={(e) => setWindowSize(parseInt(e.target.value))}
        />
        <div className='flex justify-end items-center'>
          <input
            type="checkbox"
            id="checkbox1"
            className="h-4 w-4 mx-2 rounded-sm"
            checked={toggleStacked}
            onChange={() => setToggleStacked(!toggleStacked)} />
          <Subtitle>Stacked</Subtitle>
        </div>
      </Flex>
      <div className="mt-4 h-[85%]">
        <BarChart {...barChartArgs} />
        <Flex className="space-x-4" justifyContent="center">
          <Button
            className={"p-2 h-6 bg-slate-700 hover:bg-slate-500 border-none " + (windowStart === 0 ? " opacity-50 bg-slate-500" : "")}
            variant="primary"
            onClick={() => scrollData("backward")}
          >
            <Icon
              className="text-white"
              variant="simple"
              icon={ChevronLeftIcon}
            />
          </Button>
          <Button
            className={"p-2 h-6 bg-slate-700 hover:bg-slate-500 border-none " + (windowStart + windowSize >= props.data.length ? " opacity-50 bg-slate-500" : "")}
            variant="primary"
            onClick={() => scrollData("forward")}
          >
            <Icon
              className="text-white"
              variant="simple"
              icon={ChevronRightIcon}
            />
          </Button>
        </Flex>
      </div>
    </div>
  )
}

export default CustomBarChart1
