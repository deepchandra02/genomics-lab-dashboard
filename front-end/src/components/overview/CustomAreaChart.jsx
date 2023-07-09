import React, { useState } from "react";
import { InformationCircleIcon } from "@heroicons/react/solid";

import {
  Card,
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
        <div className="flex-col justify-between">

          <Flex className="space-x-0.5 font-cabin" justifyContent="start" alignItems="center">
            <Title> {props.title} </Title>
            <Icon
              icon={InformationCircleIcon}
              variant="simple"
              className=" text-green-600 hover:text-green-400 "
              tooltip={props.tooltip}
            />
          </Flex>

          <TabGroup className="ml-4" index={selectedIndex} onIndexChange={setSelectedIndex}>
            <TabList color="gray" variant="line">
              {props.tabs.map((tab, index) => (
                <Tab key={index}>{tab}</Tab>
              ))}
            </TabList>
          </TabGroup>

        </div>
        <div className="mt-8">
          <AreaChart {...areaChartArgs} />
        </div>
      </>
    </Card>
  )
}

export default CustomAreaChart
