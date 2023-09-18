import React, { useState } from 'react'
import {
  Card,
  Title,
  Flex,
  Icon,
  Tab,
  TabGroup,
  TabList,
} from "@tremor/react";
import { InformationCircleIcon } from "@heroicons/react/solid";

import CustomBarChart1 from './CustomBarChart1'
import CustomBarChart2 from './CustomBarChart2'
import CustomBarChart3 from './CustomBarChart3'

const Card2MultipleCharts = (props) => {
  // State to keep track of the selected KPI
  const [selectedTab, setSelectedTab] = useState(0);

  // Arguments to be passed to CustomBarChart1
  const props1 = {
    className: "h-full",
    data: props.data2a,
    index: "pi",
    colors: ["sky", "violet", "fuchsia"],
    showLegend: true,
    yAxisWidth: 56,
    categories: ["New", "Top up", "Repeat"]
  };

  // Arguments to be passed to CustomBarChart2
  const props2 = {
    className: "h-full",
    data: props.data2b,
    index: "pi",
    showLegend: false,
    yAxisWidth: 56
  };

  // Arguments to be passed to CustomBarChart3
  const props3 = {
    cardSize: "w-auto h-[12vh]",
    rowSize: 4,
    data: props.data2c
  };
  return (
    <Card decoration="top" decorationColor="teal" className="flex flex-col space-y-2 h-full">
      <Flex className="space-x-0.5 font-cabin h-[5%]" justifyContent="start" alignItems="center">
        <Title> {props.title} </Title>
        <Icon
          icon={InformationCircleIcon}
          variant="simple"
          className=" text-teal-600 hover:text-teal-400 "
          tooltip={props.tooltip}
        />
      </Flex>
      <Flex className="select-none h-[10%]" justifyContent="between" alignItems="center">
        <TabGroup className="flex justify-start"
          index={selectedTab}
          onIndexChange={setSelectedTab}>
          <TabList color={"green"} variant="line">
            <Tab key={0}>Data Sample Status</Tab>
            <Tab key={1}>Projects</Tab>
            <Tab key={2}>Reference Genome</Tab>
          </TabList>
        </TabGroup>
      </Flex>
      <div className="mt-4 h-[75%]">
        {
          selectedTab === 0 && props.data2a && <CustomBarChart1 {...props1} />
        }
        {
          selectedTab === 1 && props.data2b && <CustomBarChart2 {...props2} />
        }
        {
          selectedTab === 2 && props.data2c && <CustomBarChart3 {...props3} />
        }
      </div>
    </Card>
  )
}

export default Card2MultipleCharts