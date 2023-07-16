import React from "react";
import { Grid, Title, Flex, Col } from "@tremor/react";

import CustomAreaChart from "../components/overview/CustomAreaChart";
import CustomDonutChart from "../components/overview/CustomDonutChart";

const data1 = require('../data/data1.json')
const data4 = require('../data/data4.json')

// This component is the overview page of the application
function Home() {
  // Calculate total units across all categories
  const totalUnits2 = data4.reduce((total, item) => total + item.quantity, 0);
  const donutValueFormatterFlowcellUsage = (number) => {
    const percentage = ((number / totalUnits2) * 100).toFixed(2);
    return `${percentage}% | ${Intl.NumberFormat("us").format(number).toString()} flowcells`;
  };
  return (
    <main className="px-8 py-8">
      <Title className="font-cabin font-bold text-[2rem] ">Overview</Title>
      <Grid numItemsLg={3} className="my-8 gap-6">
        <Col numColSpan={2}>
          <section>
            <CustomAreaChart
              title="1. Quantity processed over time"
              tooltip="Overview of the no. of samples/flowcells processed along with the cumulative no. of units in a daily/weekly/monthly/yearly view, over the specified date range."
              tabs={["Samples", "Flowcells"]}
              className="mt-5 h-[15rem]"
              data={data1}
              index="date"
              colors={["cyan", "red"]}
              showLegend={true}
              yAxisWidth={56}
              kpis={["Samples", "Flowcells", "SamplesTotal", "FlowcellsTotal"]}
            />
          </section>
          <Grid numItemsLg={2} className="gap-6">
            <section className="mt-6">
              <CustomAreaChart
                title="2. Quantity processed over time"
                tooltip="This chart gives an overview of the no. of samples/flowcells processed along with the cumulative no. of units in a daily/weekly/monthly/yearly view, over the specified date range."
                tabs={["Samples", "Flowcells"]}
                className="mt-5 h-72"
                data={data1}
                index="date"
                colors={["orange"]}
                showLegend={true}
                yAxisWidth={56}
                kpis={["Samples", "Flowcells", "SamplesTotal", "FlowcellsTotal"]}
              />
            </section>
            <section className="mt-6">
              <CustomAreaChart
                title="3. Quantity processed over time"
                tooltip="Overview of the no. of samples/flowcells processed along with the cumulative no. of units in a daily/weekly/monthly/yearly view, over the specified date range."
                tabs={["Samples", "Flowcells"]}
                className="mt-5 h-72"
                data={data1}
                index="date"
                colors={["green"]}
                showLegend={true}
                yAxisWidth={56}
                kpis={["Samples", "Flowcells", "SamplesTotal", "FlowcellsTotal"]}
              />
            </section>
          </Grid>
        </Col>

        <Flex flexDirection="col" >
          <CustomDonutChart
            title="4. Flowcell-Type distribution"
            tooltip="Overview of the usage of different types of flowcells over the specified date range."
            className="w-1/2 select-none"
            data={data4}
            index="type"
            category="quantity"
            variant="donut"
            colors={["violet", "indigo", "rose", "cyan"]}
            valueFormatter={donutValueFormatterFlowcellUsage}
            label=" flowcells"
          />
        </Flex>
      </Grid>
    </main>
  );
}

export default Home;