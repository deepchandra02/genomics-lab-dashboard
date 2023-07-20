import React from "react";
import { Bold, Badge, Flex, Text, ProgressBar } from "@tremor/react";
import { CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/react/solid";
import CustomAreaChart from "../components/overview/CustomAreaChart";
import Card2MultipleCharts from "../components/overview/Card2MultipleCharts";
import CustomDonutChart from "../components/overview/CustomDonutChart";


const data1 = require('../data/data1.json')

const data3 = require('../data/data3.json')
const data4 = require('../data/data4.json')
const data5 = require('../data/data5.json')
const data6 = require('../data/data6.json')
const data7 = require('../data/data7.json')


// This component is the overview page of the application
function Home() {

  const staged = data3.reduce((total, item) => total + item.quantity, 0);
  // Calculate percentages for each status
  const stagedPercentageArray = data3.map(item => {
    const percentage = ((item.quantity / staged) * 100).toFixed(1);
    return percentage;
  });

  return (
    <main className="flex flex-col h-screen p-5">
      <div className="flex justify-start items-center">
        <span className="font-cabin font-bold text-5xl">Overview</span>
        <div className="w-64 mx-auto">
          <Flex justifyContent="between">
            <Text><Bold>Staged</Bold> &bull; {stagedPercentageArray[1]}%</Text>
            <Badge
              className="font-cabin shadow-inner"
              size="lg"
              icon={stagedPercentageArray[1] < 100 ? ExclamationCircleIcon : CheckCircleIcon}
              color={stagedPercentageArray[1] < 100 ? "amber" : "green"}
            >
              {stagedPercentageArray[1] < 100 ? "Pending" : "Done"}
            </Badge>
          </Flex>
          <ProgressBar
            value={stagedPercentageArray[1]}
            color="blue"
            className="mt-3" />
        </div>
      </div>
      <div className="flex flex-col space-y-4 mt-4 pb-8 flex-grow">
        <div className="flex space-x-4">
          <div className="w-2/3">
            <CustomAreaChart
              title="1. Quantity processed over time"
              tooltip="Overview of the no. of samples/flowcells processed along with the cumulative no. of units in a daily/weekly/monthly/yearly view, over the specified date range"
              tabs={["Samples", "Flowcells"]}
              className="h-full"
              data={data1}
              index="date"
              colors={["cyan", "red"]}
              showLegend={true}
              yAxisWidth={56}
              kpis={["Samples", "Flowcells", "SamplesTotal", "FlowcellsTotal"]}
            />
          </div>
          <div className="flex flex-col w-1/3 space-y-4">
            <CustomDonutChart
              title="3. Flowcell - Type distribution"
              tooltip="Overview of the usage of different types of flowcells over the specified date range"
              className="h-full"
              data={data4}
              index="type"
              category="quantity"
              variant="donut"
              colors={["cyan", "indigo", "rose", "violet"]}
              label=" FC"
            />
            <CustomDonutChart
              title="4. Services distribution"
              tooltip="Overview of the different types of services requested among samples over the specified date range"
              className="h-full"
              data={data5}
              index="type"
              category="quantity"
              variant="donut"
              colors={["violet", "indigo", "rose", "cyan", "teal", "fuchsia", "red"]}
              label=" smpls"
            />
          </div>
        </div>
        <div className="flex space-x-4">
          <div className="w-2/3">
            <Card2MultipleCharts
              title="2. P.I. Overview"
              tooltips={["Overview of the distribution of sample requests per PI, over the specified date range",
                "Overview of the distribution of sample requests per PI, over the specified date range",
                "Overview of the distribution of sample requests per PI, over the specified date range"]}
            />
          </div>
          <div className="flex flex-col w-1/3 space-y-4">
            <CustomDonutChart
              title="5. Sequencer distribution"
              tooltip="Overview of the usage of sequencers over the specified date range"
              className="h-full"
              data={data6}
              index="type"
              category="quantity"
              variant="donut"
              colors={["pink", "blue"]}
              label=" FC"
            />
            <CustomDonutChart
              title="6. Reference Genome distribution"
              tooltip="Overview of the different types of reference genomes among samples over the specified date range"
              className="h-full"
              data={data7}
              index="type"
              category="quantity"
              variant="donut"
              colors={["pink", "teal", "cyan", "indigo"]}
              label=" smpls"
            />
          </div>
        </div>
      </div>
    </main>
  );
}

export default Home;