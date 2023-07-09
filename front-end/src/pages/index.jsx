"use client";
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

var Kpis = {
  Samples: "Samples",
  Flowcells: "Flowcells",
};

var tabs1 = [Kpis.Samples, Kpis.Flowcells];

var data1 = [
  {
    "date": "Jan/23",
    "Samples": 1086,
    "Flowcells": 35
  },
  {
    "date": "Feb/23",
    "Samples": 926,
    "Flowcells": 57
  },
  {
    "date": "Mar/23",
    "Samples": 1151,
    "Flowcells": 21
  },
  {
    "date": "Apr/23",
    "Samples": 1112,
    "Flowcells": 28
  },
  {
    "date": "May/23",
    "Samples": 1028,
    "Flowcells": 44
  },
  {
    "date": "Jun/23",
    "Samples": 838,
    "Flowcells": 24
  },
  {
    "date": "Jul/23",
    "Samples": 873,
    "Flowcells": 45
  },
  {
    "date": "Aug/23",
    "Samples": 1425,
    "Flowcells": 51
  },
  {
    "date": "Sep/23",
    "Samples": 1241,
    "Flowcells": 41
  },
  {
    "date": "Oct/23",
    "Samples": 558,
    "Flowcells": 34
  },
  {
    "date": "Nov/23",
    "Samples": 917,
    "Flowcells": 59
  },
  {
    "date": "Dec/23",
    "Samples": 1262,
    "Flowcells": 42
  }
];

export default function Home() {

  return (
    <main className="px-8 py-8">
      <Title className="font-cabin font-bold text-[2rem] ">Overview</Title>
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
              colors={["cyan"]}
              showLegend={true}
              yAxisWidth={56}
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