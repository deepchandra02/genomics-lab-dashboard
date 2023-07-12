import React, { useState, useEffect } from "react";
import { preprocessData } from "../utils.js";
import {
  Card,
  Select,
  SelectItem,
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

const CustomAreaChart = (props) => {

  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedKpi = props.kpis[selectedIndex];
  const cumulativeSelectedKpi = props.kpis[selectedIndex + 2];
  const [value, setValue] = useState(3);
  const [preprocessedData, setPreprocessedData] = useState(props.data);

  const [toggleCumulative, setToggleCumulative] = useState(true);

  const x = toggleCumulative
    ? [selectedKpi, cumulativeSelectedKpi]
    : [selectedKpi];

  useEffect(() => {
    let newData = preprocessData(props.data, value);
    setPreprocessedData(newData);

  }, [props.data, value, toggleCumulative]);

  const areaChartArgs = {
    categories: x,
    animationDuration: 500,
    autoMinValue: true,
    className: props.className + " select-none",
    data: preprocessedData,
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
            <Select className="max-w-[14rem] justify-end"
              value={value}
              defaultValue={3}
              placeholder="Select a time period"
              onValueChange={val => {
                setValue(val);
                let newData = preprocessData(props.data, val);
                setPreprocessedData(newData);
                console.log("data", props.data.length)
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
          <div style={{ width: "100%", overflowX: "auto" }}>
            <AreaChart {...areaChartArgs} />
          </div>

        </div>

      </>
    </Card>
  )
}

export default CustomAreaChart
