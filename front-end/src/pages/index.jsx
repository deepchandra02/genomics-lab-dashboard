import React from "react";
import { Grid, Title, Col } from "@tremor/react";

import CustomAreaChart from "../components/overview/CustomAreaChart";
import CustomDonutChart from "../components/overview/CustomDonutChart";

const data1 = require('../data/data1.json')
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
    <main className="px-8 py-8 text-gray-700">
      <span className="font-cabin font-bold text-4xl">Overview</span>
      <Grid numItemsLg={9} className="my-8 gap-6">
        <Col numColSpan={6}>
          <section>
            <CustomAreaChart
              title="1. Quantity processed over time"
              tooltip="Overview of the no. of samples/flowcells processed along with the cumulative no. of units in a daily/weekly/monthly/yearly view, over the specified date range"
              tabs={["Samples", "Flowcells"]}
              className="h-96"
              data={data1}
              index="date"
              colors={["cyan", "red"]}
              showLegend={true}
              yAxisWidth={56}
              kpis={["Samples", "Flowcells", "SamplesTotal", "FlowcellsTotal"]}
            />
          </section>
        </Col>

        <Col numColSpan={3}>
          <div className="grid grid-cols-1 grid-rows-2 gap-[3.75rem]">
            <div>
              <CustomDonutChart
                title="4. Flowcell - Type distribution"
                tooltip="Overview of the usage of different types of flowcells over the specified date range"
                className="w-1/2 h-44"
                data={data4}
                index="type"
                category="quantity"
                variant="donut"
                colors={["cyan", "indigo", "rose", "violet"]}
                valueFormatter={donutValueFormatterFlowcellUsage}
                label=" FC"
              />
            </div>
            <div>
              <CustomDonutChart
                title="5. Services distribution"
                tooltip="Overview of the different types of services requested among samples over the specified date range"
                className="w-1/2 h-44"
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
        </Col>
      </Grid>
      <Grid numItemsLg={9} className="my-8 gap-6">
        <Col numColSpan={6}>
          <section>
            <CustomAreaChart
              title="2. Quantity processed over time"
              tooltip="Overview of the no. of samples/flowcells processed along with the cumulative no. of units in a daily/weekly/monthly/yearly view, over the specified date range"
              tabs={["Samples", "Flowcells"]}
              className="h-96"
              data={data1}
              index="date"
              colors={["cyan", "red"]}
              showLegend={true}
              yAxisWidth={56}
              kpis={["Samples", "Flowcells", "SamplesTotal", "FlowcellsTotal"]}
            />
          </section>
        </Col>

        <Col numColSpan={3}>
          <div className="grid grid-cols-1 grid-rows-2 gap-[3.75rem]">
            <div>
              <CustomDonutChart
                title="6. Sequencer distribution"
                tooltip="Overview of the usage of sequencers over the specified date range"
                className="w-1/2 h-44"
                data={data6}
                index="type"
                category="quantity"
                variant="donut"
                colors={["pink", "blue"]}
                valueFormatter={donutValueFormatterFlowcellUsage}
                label=" FC"
              />
            </div>
            <div>
              <CustomDonutChart
                title="7. Reference Genome distribution"
                tooltip="Overview of the different types of reference genomes among samples over the specified date range"
                className="w-1/2 h-44"
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
        </Col>
      </Grid>
    </main>
  );
}

export default Home;