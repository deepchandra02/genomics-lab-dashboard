import React, { useState, useEffect } from "react";
import { preprocessData } from "../utils.js";
import {
  Card,
  Select,
  SelectItem,
  Subtitle,
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

// This component is a wrapper around the AreaChart component from @tremor/react
const CustomAreaChart = (props) => {

  // State to keep track of the selected KPI
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedKpi = props.kpis[selectedIndex];
  const cumulativeSelectedKpi = props.kpis[selectedIndex + 2];
  // State to keep track of the selected view (monthly by deafult)
  const [view, setView] = useState(3);
  // State to keep track of the window size (number of days/months etc. to display in a window)
  const [windowSize, setWindowSize] = useState(6);
  const [windowStart, setWindowStart] = useState(0); // Initial window start is 0
  const [preprocessedData, setPreprocessedData] = useState(props.data);
  const [toggleCumulative, setToggleCumulative] = useState(false);

  const categories = toggleCumulative
    ? [cumulativeSelectedKpi]
    : [selectedKpi];
  const [colors, setColors] = useState([props.colors[0]]);

  // Update the preprocessed data based on the selected view
  useEffect(() => {
    const newData = preprocessData(props.data, view);
    setPreprocessedData(newData);
  }, [props.data, view]);

  // Update the window size based on the selected view
  useEffect(() => {
    // Calculate the initial window start index to be the last possible window after preprocessing
    const initialWindowStart = Math.max(0, preprocessedData.length - windowSize);
    setWindowStart(initialWindowStart);
  }, [preprocessedData, windowSize]);

  // Update the colors based on the toggleCumulative state
  useEffect(() => {
    if (toggleCumulative) {
      setColors([props.colors[1]]);
    } else {
      setColors([props.colors[0]]);
    }
  }, [props.colors, toggleCumulative]);

  // Create a "windowed" subset of the data
  const windowedData = preprocessedData.slice(windowStart, windowStart + windowSize);

  // Update the window start index to scroll through the data
  const scrollData = (direction) => {
    if (direction === "forward" && windowStart + windowSize < preprocessedData.length) {
      setWindowStart(windowStart => windowStart + windowSize);
    } else if (direction === "backward" && windowStart - windowSize >= 0) {
      setWindowStart(windowStart => windowStart - windowSize);
    }
  };

  // Function to format the numbers to be displayed in US format
  const valueFormatter = (number) => `${Intl.NumberFormat("us").format(number).toString()}`;

  // Arguments to be passed to the AreaChart component
  const areaChartArgs = {
    categories: categories,
    animationDuration: 500,
    autoMinValue: true,
    className: props.className + " select-none",
    data: windowedData,
    index: props.index,
    colors: colors,
    showLegend: props.showLegend,
    yAxisWidth: props.yAxisWidth,
    valueFormatter: valueFormatter,
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
        <div className="flex justify-between select-none">
          <TabGroup className="flex justify-start"
            index={selectedIndex}
            onIndexChange={setSelectedIndex}>
            <TabList color={colors} variant="line">
              {props.tabs.map((tab, index) => (
                <Tab key={index}>{tab}</Tab>
              ))}
            </TabList>
          </TabGroup>

          <div className="flex gap-x-4">
            <Select className="max-w-[14rem] justify-end text-gray-500 hover:text-black"
              value={view}
              defaultValue={3}
              placeholder="Select a time period"
              onValueChange={val => {
                setView(val);
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

            <Flex className="items-center text-gray-500 hover:text-black">
              <input
                type="number"
                id="windowSizeStepper"
                className="text-center w-[4rem] h-9 p-2 border border-gray-200 shadow-tremor-input rounded-lg "
                value={windowSize}
                step="6"
                min="0"
                max={preprocessedData.length}
                onChange={(e) => setWindowSize(parseInt(e.target.value))}
              />
            </Flex>

            <Flex className="items-center ">
              <input
                type="checkbox"
                id="checkbox1"
                className="h-4 w-4 mx-2 rounded-sm"
                checked={toggleCumulative}
                onChange={() => setToggleCumulative(!toggleCumulative)} />
              <Subtitle>Cumulative</Subtitle>
            </Flex>

          </div>
        </div>
        <div className="mt-8">
          <AreaChart {...areaChartArgs} />
          <Flex className="mt-2" justifyContent="center">
            <Icon
              className={"mx-2 bg-white hover:bg-slate-200 text-black border-[1.5px] border-gray-500 rounded-lg" + (windowStart === 0 ? " opacity-50 hover:bg-white" : "")}
              variant="solid"
              icon={ChevronLeftIcon}
              onClick={() => scrollData("backward")}
            />
            <Icon
              className={"mx-2 bg-white hover:bg-slate-200 text-black border-[1.5px] border-gray-500 rounded-lg" + (windowStart + windowSize >= preprocessedData.length ? " opacity-50 hover:bg-white" : "")}
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
