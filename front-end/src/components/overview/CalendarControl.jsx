import React, { useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";
import require$$0 from 'dayjs';
const DATE_FORMAT = "YYYY-MM-DD";

function formatDate(date, format = DATE_FORMAT) {
  return date.format(format);
}

const App = () => {
  const [value, setValue] = useState({
    startDate: null,
    endDate: null
  });
  const handleValueChange = (newValue) => {
    console.log("newValue:", newValue);
    setValue(newValue);
  }

  return (

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

  );
};
export default App;