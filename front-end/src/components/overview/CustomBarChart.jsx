import React, { useState } from 'react'
import {
  BarChart,
  Card,
  Title,
  Flex,
  Icon,
  Subtitle
} from "@tremor/react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  InformationCircleIcon
} from "@heroicons/react/solid";

const CustomBarChart = (props) => {
  const [windowSize, setWindowSize] = useState(6);
  const [windowStart, setWindowStart] = useState(0); // Initial window start is 0
  const [toggleStacked, setToggleStacked] = useState(false);
  // const [colors, setColors] = useState([props.colors[0]]);

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

  // Arguments to be passed to the AreaChart component
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
    <Card decoration="top" decorationColor="teal">
      <>
        <Flex className="space-x-0.5 font-cabin" justifyContent="start" alignItems="center">
          <Title> {props.title} </Title>
          <Icon
            icon={InformationCircleIcon}
            variant="simple"
            className=" text-teal-600 hover:text-teal-400 "
            tooltip={props.tooltip}
          />
        </Flex>
        <Flex justifyContent='end' alignItems='center' className="gap-x-4 text-gray-500 hover:text-black">
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
        <div className="mt-8">
          <BarChart {...barChartArgs} />
          <Flex className="mt-2" justifyContent="center">
            <Icon
              className={"mx-2 bg-white hover:bg-slate-200 text-black border-[1.5px] border-gray-500 rounded-lg" + (windowStart === 0 ? " opacity-50 hover:bg-white" : "")}
              variant="solid"
              icon={ChevronLeftIcon}
              onClick={() => scrollData("backward")}
            />
            <Icon
              className={"mx-2 bg-white hover:bg-slate-200 text-black border-[1.5px] border-gray-500 rounded-lg" + (windowStart + windowSize >= props.data.length ? " opacity-50 hover:bg-white" : "")}
              variant="solid"
              icon={ChevronRightIcon}
              onClick={() => scrollData("forward")}
            />
          </Flex>
        </div>

      </>
    </Card>
  )
}

export default CustomBarChart
