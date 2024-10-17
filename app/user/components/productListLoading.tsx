import { Card, CardBody, Skeleton } from "@nextui-org/react";
import { Image } from "@nextui-org/image";

export default function App() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card key={index} className="mb-5">
          <Skeleton>
            <Image width={400} height={200} />
          </Skeleton>
          <div className="p-4">
            <div className="space-y-3">
              <Skeleton className="w-3/5 rounded-lg">
                <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
              </Skeleton>
              <Skeleton className="w-4/5 rounded-lg">
                <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
              </Skeleton>
              <Skeleton className="w-2/5 rounded-lg">
                <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
              </Skeleton>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
