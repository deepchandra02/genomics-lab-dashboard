import React, { useState } from 'react'
import { DateRangePicker, DateRangePickerItem, DateRangePickerValue } from "@tremor/react";

const CalendarControl = () => {
  const [value, setValue] = useState({
    from: new Date(2023, 1, 1),
    to: new Date(),
  });

  return (
    <DateRangePicker
      className="max-w-md mx-auto"
      value={value}
      onValueChange={setValue}
      selectPlaceholder="Select"
      color="rose"
    >
      <DateRangePickerItem key="ytd" value="ytd" from={new Date(2023, 0, 1)}>
        Año transcurrido
      </DateRangePickerItem>
      <DateRangePickerItem
        key="half"
        value="half"
        from={new Date(2023, 0, 1)}
        to={new Date(2023, 5, 31)}
      >
        Primer semestre
      </DateRangePickerItem>
    </DateRangePicker>
  );
}

export default CalendarControl