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

  const windowSize = 6; // Define your window size here

  const [windowStart, setWindowStart] = useState(0); // Initial window start is 0
  const [preprocessedData, setPreprocessedData] = useState(props.data);

  useEffect(() => {
    let newData = preprocessData(props.data, value);
    setPreprocessedData(newData);

    // Calculate the initial window start index to be the last possible window after preprocessing
    const initialWindowStart = Math.max(0, newData.length - windowSize);
    setWindowStart(initialWindowStart);
  }, [props.data, value]);

  // Create a "windowed" subset of the data
  const windowedData = preprocessedData.slice(windowStart, windowStart + windowSize);

  // Update the window start index to scroll through the data
  const scrollData = (direction) => {
    if (direction === "forward" && windowStart + windowSize < preprocessedData.length) {
      setWindowStart(windowStart + windowSize);
      console.log(windowStart);
    } else if (direction === "backward" && windowStart - windowSize >= 0) {
      setWindowStart(windowStart - windowSize);
      console.log(windowStart);
    }
  };

  const areaChartArgs = {
    categories: [selectedKpi],
    animationDuration: 500,
    // autoMinValue: true,

    className: props.className + " select-none",
    data: windowedData,
    index: props.index,
    colors: props.colors,
    showLegend: props.showLegend,
    yAxisWidth: props.yAxisWidth,
  };

  return (
    <Card>
      <>
        <div className="flex justify-between">

          <Flex className="space-x-0.5 font-cabin" justifyContent="start" alignItems="center">
            <Title> {props.title} </Title>
            <Icon
              icon={InformationCircleIcon}
              variant="simple"
              className=" text-green-600 hover:text-green-400 "
              tooltip={props.tooltip}
            />
          </Flex>
        </div>
        <div className="flex justify-around text-sele select-none">
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
          <Flex justifyContent="center">
            <Icon
              className={"mx-2 bg-white hover:bg-slate-200 text-black border-1 border-gray-300 rounded-lg" + (windowStart <= windowSize ? " opacity-50 hover:bg-white" : "")}
              variant="solid"
              icon={ChevronLeftIcon}
              onClick={() => scrollData("backward")}
            />
            <Icon
              className={"mx-2 bg-white hover:bg-slate-200 text-black border-1 border-gray-300 rounded-lg" + (windowStart + windowSize >= preprocessedData.length ? " opacity-50 hover:bg-white" : "")}
              variant="solid"
              icon={ChevronRightIcon}
              onClick={() => scrollData("forward")}
            />
          </Flex>
          <Select className="max-w-[14rem] text-center"
            value={value}
            defaultValue={3}
            placeholder="Select a time period"
            onValueChange={val => {
              setValue(val);
              let newData = preprocessData(props.data, val);
              setPreprocessedData(newData); //<-- You'd set the state here
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
        </div>
        <div className="mt-8">
          <AreaChart {...areaChartArgs} />
        </div>
      </>
    </Card >
  )
}

export default CustomAreaChart
