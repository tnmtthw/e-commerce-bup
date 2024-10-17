import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import { Spinner } from "@nextui-org/spinner";

const TableSkeleton = () => {
  return (
    <Table aria-label="Loading skeleton table">
      <TableHeader>
        <TableColumn>
          <Spinner size="sm" />
        </TableColumn>
        <TableColumn> </TableColumn>
        <TableColumn> </TableColumn>
      </TableHeader>
      <TableBody>
        <TableRow className="animate-pulse">
          <TableCell>
            <div className="h-4 bg-gray-300 rounded"></div>
          </TableCell>
          <TableCell>
            <div className="h-4 bg-gray-300 rounded"></div>
          </TableCell>
          <TableCell>
            <div className="h-4 bg-gray-300 rounded"></div>
          </TableCell>
        </TableRow>
        <TableRow className="animate-pulse">
          <TableCell>
            <div className="h-4 bg-gray-300 rounded"></div>
          </TableCell>
          <TableCell>
            <div className="h-4 bg-gray-300 rounded"></div>
          </TableCell>
          <TableCell>
            <div className="h-4 bg-gray-300 rounded"></div>
          </TableCell>
        </TableRow>
        <TableRow className="animate-pulse">
          <TableCell>
            <div className="h-4 bg-gray-300 rounded"></div>
          </TableCell>
          <TableCell>
            <div className="h-4 bg-gray-300 rounded"></div>
          </TableCell>
          <TableCell>
            <div className="h-4 bg-gray-300 rounded"></div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default TableSkeleton;
