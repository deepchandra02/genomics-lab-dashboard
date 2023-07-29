import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';

// This plugin is required to enable week-related functionality
dayjs.extend(weekOfYear);

export function preprocessData(data, period) {
  let aggregatedData = {};

  data.forEach(item => {
    let date = dayjs(item.date, "MM-DD-YYYY");
    let key;

    switch (period) {
      case 1: // Daily
        key = date.format('YYYY-MM-DD');
        break;
      case 2: // Weekly
        key = date.startOf('week').format('YYYY-MM-DD');
        break;
      case 3: // Monthly
        key = date.startOf('month').format('YYYY-MM-DD');
        break;
      case 4: // Yearly
        key = date.startOf('year').format('YYYY-MM-DD');
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
