'use client';

import { createContext, useContext, useState } from 'react';

import { subDays } from 'date-fns';

import { ActivityTimeframe } from '@/types/timeframes';

interface TimeRangeContextType {
  startDate: Date;
  endDate: Date;
  timeframe: ActivityTimeframe;
  selectTimeframe: (timeframe: ActivityTimeframe) => void;
  setCustomTimeframe: (startDate: Date, endDate: Date) => void;
}

const TimeRangeContext = createContext<TimeRangeContextType>({
  startDate: new Date(),
  endDate: new Date(),
  timeframe: ActivityTimeframe.SevenDays,
  selectTimeframe: () => {
    void 0;
  },
  setCustomTimeframe: () => {
    void 0;
  },
});

interface Props {
  children: React.ReactNode;
  initialTimeframe?: ActivityTimeframe;
  initialEndDate?: Date;
  initialStartDate?: Date;
  creationDate: Date;
}

export const TimeRangeProvider = ({
  children,
  initialTimeframe,
  initialStartDate,
  initialEndDate,
  creationDate,
}: Props) => {
  const [timeframe, setTimeframe] = useState<ActivityTimeframe>(
    initialTimeframe ?? ActivityTimeframe.AllTime
  );
  const [endDate, setEndDate] = useState<Date>(initialEndDate ?? new Date());
  const [startDate, setStartDate] = useState<Date>(
    initialStartDate ?? creationDate
  );

  const selectTimeframe = (timeframe: ActivityTimeframe) => {
    if (timeframe === ActivityTimeframe.AllTime) {
      setStartDate(creationDate);
    } else {
      setStartDate(subDays(new Date(), timeframe));
    }
    setEndDate(new Date());
    setTimeframe(timeframe);
  };

  const setCustomTimeframe = (startDate: Date, endDate: Date) => {
    setStartDate(startDate);
    setEndDate(endDate);
    setTimeframe(ActivityTimeframe.Custom);
  };

  return (
    <TimeRangeContext.Provider
      value={{
        startDate,
        endDate,
        timeframe,
        selectTimeframe,
        setCustomTimeframe,
      }}
    >
      {children}
    </TimeRangeContext.Provider>
  );
};

export const useTimeRangeContext = () => {
  return useContext(TimeRangeContext);
};
