import React, { useState, useEffect } from "react";
import { preprocessData } from "../utils.js";
import {
  Card,
  Select,
  SelectItem,
  Title,
  Tab,
  TabList,
  TabGroup,
  Flex,
  AreaChart,
  Icon,
} from "@tremor/react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon,
  InformationCircleIcon
} from "@heroicons/react/solid";

const CustomAreaChart = (props) => {

  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedKpi = props.tabs[selectedIndex];

  const [value, setValue] = useState(3);

  // array of window sizes
  const windowSizes = [3, 6, 9, 12];

  // Use state for window size index
  const [windowSizeIndex, setWindowSizeIndex] = useState(1); // Default window size index is 1 (6)

  const [windowStart, setWindowStart] = useState(0); // Initial window start is 0
  const [preprocessedData, setPreprocessedData] = useState(props.data);

  useEffect(() => {
    let newData = preprocessData(props.data, value);
    setPreprocessedData(newData);

    // Calculate the initial window start index to be the last possible window after preprocessing
    const initialWindowStart = Math.max(0, newData.length - windowSizes[windowSizeIndex]);
    setWindowStart(initialWindowStart);
  }, [props.data, value, windowSizeIndex]);

  // Create a "windowed" subset of the data
  const windowedData = preprocessedData.slice(windowStart, windowStart + windowSizes[windowSizeIndex]);

  // Update the window start index to scroll through the data
  const scrollData = (direction) => {
    if (direction === "forward" && windowStart + windowSizes[windowSizeIndex] < preprocessedData.length) {
      setWindowStart(windowStart + windowSizes[windowSizeIndex]);
    } else if (direction === "backward" && windowStart - windowSizes[windowSizeIndex] >= 0) {
      setWindowStart(windowStart - windowSizes[windowSizeIndex]);
    }
  };

  const areaChartArgs = {
    categories: [selectedKpi],
    animationDuration: 500,
    className: props.className + " select-none",
    data: windowedData,
    index: props.index,
    colors: props.colors,
    showLegend: props.showLegend,
    yAxisWidth: props.yAxisWidth,
  };

  return (
    <Card decoration="top" decorationColor="teal">
      <>
        <div className="flex justify-between">

          <Flex className="space-x-0.5 font-cabin" justifyContent="start" alignItems="center">
            <Title> {props.title} </Title>
            <Icon
              icon={InformationCircleIcon}
              variant="simple"
              className=" text-teal-600 hover:text-teal-400 "
              tooltip={props.tooltip}
            />
          </Flex>
        </div>
        <div className="flex justify-between select-none">
          <TabGroup className="flex justify-start"
            index={selectedIndex}
            onIndexChange={setSelectedIndex}>
            <TabList color="gray" variant="line">
              {props.tabs.map((tab, index) => (
                <>
                  <Tab key={index}>{tab}</Tab>
                </>
              ))}
            </TabList>
          </TabGroup>
          <div className="flex gap-x-4">
            <Select className="flex max-w-[14rem] justify-end"
              value={value}
              defaultValue={3}
              placeholder="Select a time period"
              onValueChange={val => {
                setValue(val);
                let newData = preprocessData(props.data, val);
                setPreprocessedData(newData);
              }}
              icon={EyeIcon}
            >
              <SelectItem value={1}>
                Daily
              </SelectItem>
              <SelectItem value={2}>
                Weekly
              </SelectItem>
              <SelectItem value={3}>
                Monthly
              </SelectItem>
              <SelectItem value={4}>
                Yearly
              </SelectItem>
            </Select>
            <TabGroup className="flex justify-end"
              index={windowSizeIndex}
              onIndexChange={setWindowSizeIndex}>
              <TabList color="gray" variant="solid">
                {windowSizes.map((size, index) => (
                  <Tab key={index}>{size}</Tab>
                ))}
              </TabList>
            </TabGroup>
          </div>
        </div>
        <div className="mt-8">
          <AreaChart {...areaChartArgs} />
          <Flex className="mt-2" justifyContent="center">
            <Icon
              className={"mx-2 bg-white hover:bg-slate-200 text-black border-[1.5px] border-gray-500 rounded-lg" + (windowStart <= windowSizes[windowSizeIndex] ? " opacity-50 hover:bg-white" : "")}
              variant="solid"
              icon={ChevronLeftIcon}
              onClick={() => scrollData("backward")}
            />
            <Icon
              className={"mx-2 bg-white hover:bg-slate-200 text-black border-[1.5px] border-gray-500 rounded-lg" + (windowStart + windowSizes[windowSizeIndex] >= preprocessedData.length ? " opacity-50 hover:bg-white" : "")}
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

export default CustomAreaChart
