import React, { useState, useEffect } from "react";
import { Bold, Badge, Flex, Text, ProgressBar } from "@tremor/react";
import { CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/react/solid";
import Datepicker from "react-tailwindcss-datepicker";
import require$$0 from 'dayjs';
import Card2MultipleCharts from "../components/overview/Card2MultipleCharts";
import CustomAreaChart from "../components/overview/CustomAreaChart";
import CustomDonutChart from "../components/overview/CustomDonutChart";
const DATE_FORMAT = "YYYY-MM-DD";

function formatDate(date, format = DATE_FORMAT) {
  return date.format(format);
}
function formatJsDate(date, format = DATE_FORMAT) {
  return require$$0(date).format(format);
}

// const data1 = require('../data/data1.json')
// const data2a = require('../data/data2a.json')
// const data2b = require('../data/data2b.json')
// const data3 = require('../data/data3.json')
// const data4 = require('../data/data4.json')
// const data5 = require('../data/data5.json')
// const data6 = require('../data/data6.json')
const dataX = require('../data/dataX.json')


// This component is the overview page of the application
function Overview() {

  const staged = dataX.reduce((total, item) => total + item.quantity, 0);
  // Calculate percentages for each status
  const stagedPercentageArray = dataX.map(item => {
    const percentage = ((item.quantity / staged) * 100).toFixed(1);
    return percentage;
  });

  const [value, setValue] = useState({
    startDate: new Date("1990-01-01"),
    endDate: new Date()
  });
  const [data1, setData1] = useState(null);
  const [data2a, setData2a] = useState(null);
  const [data2b, setData2b] = useState(null);
  const [data2c, setData2c] = useState(null);
  const [data3, setData3] = useState(null);
  const [data4, setData4] = useState(null);
  const [data5, setData5] = useState(null);
  const [data6, setData6] = useState(null);

  const handleValueChange = (newValue) => {
    console.log("newValue:", newValue);
    setValue(newValue);
  }

  useEffect(() => {
    async function fetchData() {
      // Check if startDate and endDate are not null
      if (value.startDate && value.endDate) {
        const startDate = formatJsDate(value.startDate, 'YYYYMMDD');
        const endDate = formatJsDate(value.endDate, 'YYYYMMDD');

        const response1 = await fetch(`http://172.32.79.51:5001/data1/${startDate}-${endDate}`);
        if (!response1.ok) {
          // Handle error
          console.error('Server error:', response1);
        }
        else {
          const data = await response1.json();
          // Update the state with the fetched data
          setData1(data);
        }

        const response2a = await fetch(`http://172.32.79.51:5001/data2a/${startDate}-${endDate}`);
        if (!response2a.ok) {
          // Handle error
          console.error('Server error:', response2a);
        }
        else {
          const data = await response2a.json();
          // Update the state with the fetched data
          setData2a(data);
        }

        const response2b = await fetch(`http://172.32.79.51:5001/data2b/${startDate}-${endDate}`);
        if (!response2b.ok) {
          // Handle error
          console.error('Server error:', response2b);
        }
        else {
          const data = await response2b.json();
          // Update the state with the fetched data
          setData2b(data);
        }

        const response2c = await fetch(`http://172.32.79.51:5001/data2c/${startDate}-${endDate}`);
        if (!response2c.ok) {
          // Handle error
          console.error('Server error:', response2c);
        }
        else {
          const data = await response2c.json();
          // Update the state with the fetched data
          setData2c(data);
        }

        const response3 = await fetch(`http://172.32.79.51:5001/data3/${startDate}-${endDate}`);
        if (!response3.ok) {
          // Handle error
          console.error('Server error:', response3);
        }
        else {
          const data = await response3.json();
          // Update the state with the fetched data
          setData3(data);
        }

        const response4 = await fetch(`http://172.32.79.51:5001/data4/${startDate}-${endDate}`);
        if (!response4.ok) {
          // Handle error
          console.error('Server error:', response4);
        }
        else {
          const data = await response4.json();
          // Update the state with the fetched data
          setData4(data);
        }

        const response5 = await fetch(`http://172.32.79.51:5001/data5/${startDate}-${endDate}`);
        if (!response5.ok) {
          // Handle error
          console.error('Server error:', response5);
        }
        else {
          const data = await response5.json();
          // Update the state with the fetched data
          setData5(data);
        }

        const response6 = await fetch(`http://172.32.79.51:5001/data6/${startDate}-${endDate}`);
        if (!response6.ok) {
          // Handle error
          console.error('Server error:', response6);
        }
        else {
          const data = await response6.json();
          // Update the state with the fetched data
          setData6(data);
        }
      }
    }


    fetchData();
  }, [value]);

  return (
    <main className="flex flex-col h-screen p-5">
      <div className="flex justify-between items-center">
        <span className="font-cabin font-bold text-5xl">Overview</span>
        <div className="flex space-x-10 items-center">
          <div className="min-w-60 max-w-60">
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
          <div className="min-w-60 max-w-60">
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
          <Datepicker
            showShortcuts={true}
            showFooter={true}
            separator={"To"}
            maxDate={new Date()}
            primaryColor={"emerald"}
            value={value}
            onChange={handleValueChange}
            inputClassName="relative transition-all duration-300 py-2.5 pl-4 pr-14 w-full border border-gray-300 dark:bg-slate-800 dark:text-white/80 dark:border-slate-600 rounded-lg tracking-wide font-light text-sm placeholder-gray-400 bg-white focus:ring disabled:opacity-40 disabled:cursor-not-allowed"
            containerClassName="relative w-full text-gray-700"
            toggleClassName="absolute bg-gray-800 rounded-r-lg text-white right-0 h-full px-3 text-gray-400 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
            configs={{
              shortcuts: {
                today: "Today",
                last7Days: {
                  text: "Last 7 days",
                  period: {
                    start: formatDate(require$$0().subtract(7, "d")),
                    end: formatDate(require$$0())
                  }
                },
                last30Days: {
                  text: "Last 30 days",
                  period: {
                    start: formatDate(require$$0().subtract(30, "d")),
                    end: formatDate(require$$0())
                  }
                },
                monthToDate: {
                  text: "MTD",
                  period: {
                    start: formatDate(require$$0().startOf("month")),
                    end: formatDate(require$$0())
                  }
                },
                yearToDate: {
                  text: "YTD",
                  period: {
                    start: formatDate(require$$0().startOf("year")),
                    end: formatDate(require$$0())
                  }
                },
              }
            }}
          />
        </div>
      </div>
      <div className="flex flex-col space-y-4 mt-4 pb-8 flex-grow">
        <div className="flex space-x-4">
          <div className="w-[75%]">
            {data1 && (<CustomAreaChart
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
            />)}
          </div>
          <div className="flex flex-col w-[25%] space-y-4">
            {data3 && (<CustomDonutChart
              title="3. Flowcell - Type distribution"
              tooltip="Overview of the usage of different types of flowcells over the specified date range"
              className="h-full"
              data={data3}
              index="type"
              category="quantity"
              variant="donut"
              colors={["cyan", "indigo", "rose", "violet"]}
              label=" FCs"
            />)}
            {data4 && (<CustomDonutChart
              title="4. Services distribution"
              tooltip="Overview of the different types of services requested among samples over the specified date range"
              className="h-full"
              data={data4}
              index="type"
              category="quantity"
              variant="donut"
              colors={["violet", "indigo", "rose", "cyan", "teal", "fuchsia", "red"]}
              label=" smpls"
            />)}
          </div>
        </div>
        <div className="flex space-x-4">
          <div className="w-[75%]">
            <Card2MultipleCharts
              title="2. P.I. Overview"
              tooltip="Overview of the distribution of sample requests per PI over the specified date range in different parameters"
              data2a={data2a}
              data2b={data2b}
              data2c={data2c}
            />
          </div>
          <div className="flex flex-col w-[25%] space-y-4">
            <CustomDonutChart
              title="5. Sequencer distribution"
              tooltip="Overview of the usage of sequencers over the specified date range"
              className="h-full"
              data={data5}
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
              data={data6}
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

export default Overview;