import React from 'react';
import { Card, Skeleton } from "@nextui-org/react";
import SalesChartLoading from './components/SalesChartLoading';

const DashboardLoading = () => {
  return (
    <div>
      <div className="grid grid-cols-4 gap-4 mb-4">
        <Card className="w-full h-[150] space-y-5 p-4" radius="md">
          <div className="flex flex-col items-center justify-center space-y-3 h-full">
            <Skeleton className="w-4/5 rounded-lg">
              <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
            </Skeleton>
            <Skeleton className="w-2/5 rounded-lg">
              <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
            </Skeleton>
          </div>
        </Card>
        <Card className="w-full h-[150] space-y-5 p-4" radius="md">
          <div className="flex flex-col items-center justify-center space-y-3 h-full">
            <Skeleton className="w-4/5 rounded-lg">
              <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
            </Skeleton>
            <Skeleton className="w-2/5 rounded-lg">
              <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
            </Skeleton>
          </div>
        </Card>
        <Card className="w-full h-[150] space-y-5 p-4" radius="md">
          <div className="flex flex-col items-center justify-center space-y-3 h-full">
            <Skeleton className="w-4/5 rounded-lg">
              <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
            </Skeleton>
            <Skeleton className="w-2/5 rounded-lg">
              <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
            </Skeleton>
          </div>
        </Card>
        <Card className="w-full h-[150] space-y-5 p-4" radius="md">
          <div className="flex flex-col items-center justify-center space-y-3 h-full">
            <Skeleton className="w-4/5 rounded-lg">
              <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
            </Skeleton>
            <Skeleton className="w-2/5 rounded-lg">
              <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
            </Skeleton>
          </div>
        </Card>
        <div className="row-span-4 col-span-3 h-full">
          <SalesChartLoading />
        </div>
        <div className="row-span-2 h-full">
          <Card className="w-full h-[250] ">
            <div className="flex flex-col items-center justify-center space-y-3 h-full">
              <Skeleton className="w-4/5 rounded-lg">
                <div className="h-40 w-4/5 rounded-lg bg-default-200"></div>
              </Skeleton>
              <Skeleton className="w-4/5 rounded-lg">
                <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
              </Skeleton>
              <Skeleton className="w-2/5 rounded-lg">
                <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
              </Skeleton>
            </div>
          </Card>
        </div>
        <div className="row-span-2 h-full">
          <Card className="w-full h-[250]">
            <div className="flex flex-col items-center justify-center space-y-3 h-full">
              <Skeleton className="w-4/5 rounded-lg">
                <div className="h-40 w-4/5 rounded-lg bg-default-200"></div>
              </Skeleton>
              <Skeleton className="w-4/5 rounded-lg">
                <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
              </Skeleton>
              <Skeleton className="w-2/5 rounded-lg">
                <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
              </Skeleton>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
export default DashboardLoading;