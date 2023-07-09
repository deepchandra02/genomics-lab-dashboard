import React, { useState } from "react";
import { EyeIcon, InformationCircleIcon } from "@heroicons/react/solid";


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


const CustomAreaChart = (props) => {

  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedKpi = props.tabs[selectedIndex];

  const [value, setValue] = useState(3);

  const areaChartArgs = {
    categories: [selectedKpi],
    animationDuration: 500,

    className: props.className,
    data: props.data,
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

          <Select className="max-w-[14rem] text-center"
            value={value}
            defaultValue={3}
            placeholder="Select a time period"
            onValueChange={setValue}
            icon={EyeIcon}
          >
            <SelectItem value="1">
              Daily
            </SelectItem>
            <SelectItem value="2">
              Weekly
            </SelectItem>
            <SelectItem value="3">
              Monthly
            </SelectItem>
            <SelectItem value="4">
              Yearly
            </SelectItem>
          </Select>
        </div>
        <TabGroup className="flex justify-start" index={selectedIndex} onIndexChange={setSelectedIndex}>
          <TabList color="gray" variant="line">
            {props.tabs.map((tab, index) => (
              <>
                <Tab key={index}>{tab}</Tab>
              </>
            ))}
          </TabList>
        </TabGroup>
        <div className="mt-8">
          <AreaChart {...areaChartArgs} />
        </div>
      </>
    </Card>
  )
}

export default CustomAreaChart
