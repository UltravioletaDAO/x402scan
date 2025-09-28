"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { subDays } from "date-fns";

import { ActivityTimeframe } from "@/types/timeframes";

interface ActivityContextType {
  startDate: Date;
  endDate: Date | undefined;
  timeframe: ActivityTimeframe;
  setTimeframe: (timeframe: ActivityTimeframe) => void;
  setDateRange: (startDate: Date, endDate: Date) => void;
}

const ActivityContext = createContext<ActivityContextType>({
  startDate: new Date(),
  endDate: new Date(),
  timeframe: ActivityTimeframe.SevenDays,
  setTimeframe: () => {
    void 0;
  },
  setDateRange: () => {
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

export const ActivityContextProvider = ({
  children,
  initialTimeframe,
  initialStartDate,
  initialEndDate,
  creationDate,
}: Props) => {
  const [timeframe, setTimeframe] = useState<ActivityTimeframe>(
    initialTimeframe ?? ActivityTimeframe.AllTime
  );
  const [endDate, setEndDate] = useState<Date | undefined>(initialEndDate);
  const [startDate, setStartDate] = useState<Date>(
    initialStartDate ?? creationDate
  );
  const [isInitial, setIsInitial] = useState(true);

  useEffect(() => {
    if (isInitial) {
      setIsInitial(false);
      return;
    }
    if (timeframe === ActivityTimeframe.Custom) {
      return;
    }
    if (timeframe === ActivityTimeframe.AllTime) {
      setStartDate(creationDate);
      return;
    }
    setStartDate(subDays(new Date(), timeframe));
    setEndDate(new Date());
  }, [timeframe, creationDate, isInitial]);

  const setDateRange = (startDate: Date, endDate: Date) => {
    setStartDate(startDate);
    setEndDate(endDate);
  };

  return (
    <ActivityContext.Provider
      value={{
        startDate,
        endDate,
        timeframe,
        setTimeframe,
        setDateRange,
      }}
    >
      {children}
    </ActivityContext.Provider>
  );
};

export const useActivityContext = () => {
  return useContext(ActivityContext);
};
