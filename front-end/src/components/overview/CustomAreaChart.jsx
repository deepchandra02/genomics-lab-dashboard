import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { preprocessData } from "../utils.js";
import {
  Button,
  Card,
  Select,
  SelectItem,
  Text,
  Title,
  Tab,
  Text,
  TabList,
  TabGroup,
  Flex,
  AreaChart,
  Icon,
  Button,
} from "@tremor/react";
import {
  EyeIcon,
  InformationCircleIcon
} from "@heroicons/react/solid";

const DEFAULT_WINDOW_SIZE_INDEX = 1;
const DEFAULT_VALUE = 3;
const WINDOW_SIZES = [3, 6, 9, 12];



const CustomAreaChart = (props) => {

  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedKpi = props.kpis[selectedIndex];
  const cumulativeSelectedKpi = props.kpis[selectedIndex + 2];
  const [value, setValue] = useState(DEFAULT_VALUE);

  // Use state for window size index
  const [windowSizeIndex, setWindowSizeIndex] = useState(DEFAULT_WINDOW_SIZE_INDEX);

  const [windowStart, setWindowStart] = useState(0); // Initial window start is 0
  const [preprocessedData, setPreprocessedData] = useState(props.data);
  const [toggleCumulative, setToggleCumulative] = useState(false);
  const categories = toggleCumulative
    ? [cumulativeSelectedKpi]
    : [selectedKpi];
  const [colors, setColors] = useState([props.colors[0]]);

  const [toggleCumulative, setToggleCumulative] = useState(true);

  const x = toggleCumulative
    ? [selectedKpi, cumulativeSelectedKpi]
    : [selectedKpi];

  useEffect(() => {
    const newData = preprocessData(props.data, value);
    setPreprocessedData(newData);
  }, [props.data, value]);

  useEffect(() => {
    // Calculate the initial window start index to be the last possible window after preprocessing
    const initialWindowStart = Math.max(0, preprocessedData.length - WINDOW_SIZES[windowSizeIndex]);
    setWindowStart(initialWindowStart);
  }, [preprocessedData, windowSizeIndex]);

  useEffect(() => {
    if (toggleCumulative) {
      setColors([props.colors[1]]);
    } else {
      setColors([props.colors[0]]);
    }
  }, [props.colors, toggleCumulative]);

  // Create a "windowed" subset of the data
  const windowedData = preprocessedData.slice(windowStart, windowStart + WINDOW_SIZES[windowSizeIndex]);

  // Update the window start index to scroll through the data
  const scrollData = (direction) => {
    if (direction === "forward" && windowStart + WINDOW_SIZES[windowSizeIndex] < preprocessedData.length) {
      setWindowStart(windowStart => windowStart + WINDOW_SIZES[windowSizeIndex]);
    } else if (direction === "backward" && windowStart - WINDOW_SIZES[windowSizeIndex] >= 0) {
      setWindowStart(windowStart => windowStart - WINDOW_SIZES[windowSizeIndex]);
    }
  };

  const areaChartArgs = {
    categories: categories,
    animationDuration: 500,
    autoMinValue: true,
    className: props.className + " select-none",
    data: preprocessedData,
    index: props.index,
    colors: colors,
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
            <Select className="max-w-[14rem] justify-end"
              value={value}
              defaultValue={3}
              placeholder="Select a time period"
              onValueChange={val => {
                setValue(val);
                let newData = preprocessData(props.data, val);
                setPreprocessedData(newData);
                console.log(props.data.length)
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
                {WINDOW_SIZES.map((size, index) => (
                  <Tab key={index}>{size}</Tab>
                ))}
              </TabList>
            </TabGroup>
            <Button variant="light">
              <Flex className="items-center">
                <input
                  type="checkbox"
                  id="checkbox1"
                  className="h-4 w-4 mx-2 shrink-0 rounded-sm border-1  checked:bg-gray-500 hover:ring hover:ring-gray-300 focus:outline-none"
                  checked={toggleCumulative}
                  onChange={() => setToggleCumulative(!toggleCumulative)} />
                <Text className="text-gray-500">Cumulative</Text>
              </Flex>
            </Button>
          </div>
        </div>
        <div className="mt-8">
          <AreaChart {...areaChartArgs} />
          <Flex className="mt-2" justifyContent="center">
            <Icon
              className={"mx-2 bg-white hover:bg-slate-200 text-black border-[1.5px] border-gray-500 rounded-lg" + (windowStart <= WINDOW_SIZES[windowSizeIndex] ? " opacity-50 hover:bg-white" : "")}
              variant="solid"
              icon={ChevronLeftIcon}
              onClick={() => scrollData("backward")}
            />
            <Icon
              className={"mx-2 bg-white hover:bg-slate-200 text-black border-[1.5px] border-gray-500 rounded-lg" + (windowStart + WINDOW_SIZES[windowSizeIndex] >= preprocessedData.length ? " opacity-50 hover:bg-white" : "")}
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

CustomAreaChart.propTypes = {
  kpis: PropTypes.array.isRequired,
  colors: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  className: PropTypes.string,
  index: PropTypes.number.isRequired,
  showLegend: PropTypes.bool.isRequired,
  yAxisWidth: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  tooltip: PropTypes.string.isRequired,
  tabs: PropTypes.array.isRequired
}

export default CustomAreaChart
