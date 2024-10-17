import React from 'react';
import { Card, Skeleton, Spinner } from "@nextui-org/react";

const SalesChartLoading = () => {
    return (
        <Card className="w-full h-[520]" radius="md">
            <div className="flex justify-center place-items-center h-full">
                <Spinner label="Loading..." color="default" labelColor="foreground" />
            </div>

        </Card>
    );
};

export default SalesChartLoading;
