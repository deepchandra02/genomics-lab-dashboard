import React from 'react'
import { Card, Title, DonutChart, Flex, Icon, Legend } from "@tremor/react";
import { InformationCircleIcon } from "@heroicons/react/solid";

// This component is a wrapper around the DonutChart component from @tremor/react
const CustomDonutChart = (props) => {
  // Calculate the total units across all categories by using the reduce method
  const totalUnits = props.data.reduce((total, item) => total + item.quantity, 0);
  const valueFormatter = (number) => {
    const percentage = ((number / totalUnits) * 100).toFixed(2);
    return `${percentage}% | ${Intl.NumberFormat("us").format(number).toString()}`;
  };
  // Arguments to be passed to the DonutChart component
  const donutChartArgs = {
    animationDuration: 500, // Animation duration in milliseconds
    showLabel: true, // To show the label at the centre of the donut chart

    // Data and configurations received as props
    data: props.data,
    category: props.category,
    index: props.index,
    variant: props.variant,
    className: props.className + " w-1/2",
    colors: props.colors,
    valueFormatter: valueFormatter,
    // The label is the total units formatted as a US number + the label received as prop
    label: Intl.NumberFormat("us").format(totalUnits).toString() + props.label,
  };

  // Arguments to be passed to the Legend component
  const legendArgs = {
    className: "flex flex-col justify-end",
    categories: props.data.map((item) => item.type), // Categories are the type of each data item
    colors: props.colors // Colors received as props
  };

  // Return the JSX to render
  return (
    <Card decoration="top" decorationColor="teal" className="flex flex-col space-y-2 h-full">
      <Flex className="space-x-0.5 font-cabin h-[5%]" justifyContent="start" alignItems="center">
        <Title> {props.title} </Title> {/* Display the title received as prop */}
        <Icon
          icon={InformationCircleIcon}
          variant="simple"
          className=" text-teal-600 hover:text-teal-400 "
          tooltip={props.tooltip}
        />
      </Flex>
      <div className="pt-4 h-[82%] flex items-center space-x-16">
        <DonutChart {...donutChartArgs} /> {/* Render the DonutChart component with prepared props */}
        <Legend {...legendArgs} /> {/* Render the Legend component with prepared props */}
      </div>
    </Card>
  )
}

export default CustomDonutChart
