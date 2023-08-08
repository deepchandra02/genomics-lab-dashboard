import { startOfMonth, startOfWeek, startOfYear, format, parse } from "date-fns";

export function preprocessData(data, period) {
  let aggregatedData = {};

  data.forEach(item => {
    let date = parse(item.date, "MM-dd-yyyy", new Date());
    let key;

    switch (period) {
      case 1: // Daily
        key = item.date;
        break;
      case 2: // Weekly
        key = format(startOfWeek(date), 'MM-dd-yyyy');
        break;
      case 3: // Monthly
        key = format(startOfMonth(date), 'MM-dd-yyyy');
        break;
      case 4: // Yearly
        key = format(startOfYear(date), 'MM-dd-yyyy');
        break;
      default: // Default to daily
        key = item.date;
    }

    if (!aggregatedData[key]) {
      aggregatedData[key] = {
        date: key,
        Samples: 0,
        Flowcells: 0,
      };
    }

    aggregatedData[key].Samples += item.Samples;
    aggregatedData[key].Flowcells += item.Flowcells;
    aggregatedData[key].SamplesTotal = item.SamplesTotal;
    aggregatedData[key].FlowcellsTotal = item.FlowcellsTotal;
  });

  return Object.values(aggregatedData);
}