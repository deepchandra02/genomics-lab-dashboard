import React from "react";

import {
  Card,
  Grid,
  Title,
  Text,
  BadgeDelta,
  Flex,
  Metric,
  ProgressBar,
  Col,
} from "@tremor/react";

import CustomAreaChart from "../components/overview/CustomAreaChart";

const data1 = require('../updated_data.json')

var kpiData = [
  {
    title: "Card 1",
    metric: "$ 12,699",
    progress: 15.9,
    target: "$ 80,000",
    delta: "13.2%",
    deltaType: "moderateIncrease",
  },
  {
    title: "Card 2",
    metric: "$ 45,564",
    progress: 36.5,
    target: "$ 125,000",
    delta: "23.9%",
    deltaType: "increase",
  },
  {
    title: "Card 3",
    metric: "1,072",
    progress: 53.6,
    target: "2,000",
    delta: "10.1%",
    deltaType: "moderateDecrease",
  },
  {
    title: "Card 4",
    metric: "1,072",
    progress: 53.6,
    target: "2,000",
    delta: "10.1%",
    deltaType: "moderateDecrease",
  },
];

var kpis = {
  Samples: "Samples",
  Flowcells: "Flowcells",
  SamplesTotal: "SamplesTotal",
  FlowcellsTotal: "FlowcellsTotal"
};

var tabs1 = [kpis.Samples, kpis.Flowcells];



export default function Home() {

  return (
    <main className="px-8 py-8 h-[100vh]">
      <Title className="font-cabin font-bold text-[2.25rem] ">Overview</Title>
      <Grid numItemsLg={3} className="mt-6 gap-6">
        <Col numColSpan={2}>
          <div>
            <CustomAreaChart
              title="1. Quantity processed over time"
              tooltip="This chart gives an overview of the no. of samples/flowcells processed along with the cumulative no. of units in a daily/weekly/monthly/yearly view, over the specified date range."
              tabs={tabs1}
              className="mt-5 h-72"
              data={data1}
              index="date"
              colors={["cyan", "red"]}
              showLegend={true}
              yAxisWidth={56}
              kpis={["Samples", "Flowcells", "SamplesTotal", "FlowcellsTotal"]}
            />
          </div>
          <Grid numItemsLg={2} className="gap-6">
            <div className="mt-6">
              <CustomAreaChart
                title="2. Quantity processed over time"
                tooltip="This chart gives an overview of the no. of samples/flowcells processed along with the cumulative no. of units in a daily/weekly/monthly/yearly view, over the specified date range."
                tabs={tabs1}
                className="mt-5 h-72"
                data={data1}
                index="date"
                colors={["orange"]}
                showLegend={true}
                yAxisWidth={56}
                kpis={["Samples", "Flowcells", "SamplesTotal", "FlowcellsTotal"]}
              />
            </div>
            <div className="mt-6">
              <CustomAreaChart
                title="3. Quantity processed over time"
                tooltip="This chart gives an overview of the no. of samples/flowcells processed along with the cumulative no. of units in a daily/weekly/monthly/yearly view, over the specified date range."
                tabs={tabs1}
                className="mt-5 h-72"
                data={data1}
                index="date"
                colors={["green"]}
                showLegend={true}
                yAxisWidth={56}
                kpis={["Samples", "Flowcells", "SamplesTotal", "FlowcellsTotal"]}
              />
            </div>
          </Grid>
        </Col>

        <Flex flexDirection="col" >
          {kpiData.map((item) => (
            <Card key={item.title}>
              <Flex alignItems="start">
                <div className="truncate">
                  <Text>{item.title}</Text>
                  <Metric className="truncate">{item.metric}</Metric>
                </div>
                <BadgeDelta deltaType={item.deltaType}>{item.delta}</BadgeDelta>
              </Flex>
              <Flex className="mt-4 space-x-2">
                <Text className="truncate">{`${item.progress}% (${item.metric})`}</Text>
                <Text>{item.target}</Text>
              </Flex>
              <ProgressBar value={item.progress} className="mt-2" />
              <ProgressBar value={item.progress} className="mt-2" />
            </Card>
          ))}
        </Flex>
      </Grid>
    </main>
  );
}