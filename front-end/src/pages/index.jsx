import React from "react";

import CustomAreaChart from "../components/overview/CustomAreaChart";
import CustomBarChart from "../components/overview/CustomBarChart";
import CustomDonutChart from "../components/overview/CustomDonutChart";

const data1 = require('../data/data1.json')
const data2 = require('../data/data2.json')
const data4 = require('../data/data4.json')
const data5 = require('../data/data5.json')
const data6 = require('../data/data6.json')
const data7 = require('../data/data7.json')

// This component is the overview page of the application
function Home() {
  // Calculate total units across all categories
  const totalUnits2 = data4.reduce((total, item) => total + item.quantity, 0);
  const donutValueFormatterFlowcellUsage = (number) => {
    const percentage = ((number / totalUnits2) * 100).toFixed(2);
    return `${percentage}% | ${Intl.NumberFormat("us").format(number).toString()} flowcells`;
  };
  return (
    <main className="flex flex-col h-screen p-5">
      <span className="font-cabin font-bold text-4xl">Overview</span>
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
              valueFormatter={donutValueFormatterFlowcellUsage}
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
              valueFormatter={donutValueFormatterFlowcellUsage}
              label=" smpls"
            />
          </div>
        </div>
        <div className="flex space-x-4">
          <div className="w-2/3">
            <CustomBarChart
              title="2. Sample - P.I. distribution"
              tooltip="Overview of the distribution of sample requests per PI, over the specified date range"
              className="h-full"
              data={data2}
              index="pi"
              colors={["sky", "violet", "fuchsia"]}
              showLegend={true}
              yAxisWidth={56}
              categories={["New", "Top up", "Repeat"]}
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
              valueFormatter={donutValueFormatterFlowcellUsage}
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
              valueFormatter={donutValueFormatterFlowcellUsage}
              label=" smpls"
            />
          </div>
        </div>
      </div>
    </main>
  );
}

export default Home;