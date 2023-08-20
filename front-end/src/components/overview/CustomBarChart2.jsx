import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Button,
  Flex,
  Icon,
  NumberInput
} from "@tremor/react";
import { ChevronLeftIcon, ChevronRightIcon, DesktopComputerIcon } from "@heroicons/react/solid";

const CustomBarChart2 = (props) => {
  const [windowSize, setWindowSize] = useState(6);
  const [windowStart, setWindowStart] = useState(0);
  const [categories, setCategories] = useState([]);
  const [colors, setColors] = useState([]);

  // Define available colors
  const Colors = [
    "red",
    "lime",
    "indigo",
    "orange",
    "teal",
    "violet",
    "amber",
    "cyan",
    "pink",
    "green",
    "sky",
    "purple",
    "emerald",
    "blue",
    "rose",
    "slate",
    "yellow",
    "fuchsia"
  ];

  useEffect(() => {
    setWindowStart(0); // Reset the window start whenever the window size changes
  }, [windowSize]); // Only run this effect when windowSize changes

  useEffect(() => {
    // Extract all project names from the windowed data
    const allProjects = {};
    const windowedData = props.data.slice(windowStart, windowStart + windowSize);

    windowedData.forEach(item => {
      Object.keys(item).forEach(key => {
        if (key !== 'pi') {
          allProjects[key] = true;
        }
      });
    });

    const allCategories = Object.keys(allProjects);
    setCategories(allCategories);
    const allColors = allCategories.map((_, i) => Colors[i % Colors.length]);
    setColors(allColors);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [windowStart, windowSize]); // Run this effect when windowStart or windowSize changes


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

  const valueFormatter = (number) => `${Intl.NumberFormat("us").format(number).toString()}`;

  // Arguments to be passed to the BarChart component
  const barChartArgs = {
    categories: categories,
    animationDuration: 200,
    className: props.className + " select-none",
    data: windowedData,
    index: props.index,
    colors: colors,
    showLegend: props.showLegend,
    yAxisWidth: props.yAxisWidth,
    valueFormatter: valueFormatter,
    stack: true
  };

  return (
    <div className="flex flex-col space-y-2 h-full">
      <Flex className="gap-x-4 text-gray-500 hover:text-black h-[10%]" justifyContent='end' alignItems='center'>
        <NumberInput
          className='max-w-[5rem]'
          value={windowSize}
          icon={DesktopComputerIcon}
          step={6}
          enableStepper={true}
          min={0}
          onValueChange={(val) => setWindowSize(val)}
        />
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

export default CustomBarChart2
