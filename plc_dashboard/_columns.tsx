import { Column } from "react-table";
import {
  SelectionCell,
  SelectionHeader,
} from "../../../../../_metronic/partials/components/table";


const usePlc_dashboardColumns = () => {


  const plc_dashboardColumns: ReadonlyArray<Column<any>> = [
    {
      Header: (props) => <SelectionHeader tableProps={props} />,
      id: "selection",
      Cell: ({ ...props }) => (
        <SelectionCell id={props.data[props.row.index].id} />
      ),
    },
  ];

  return {
    plc_dashboardColumns,
  };
};

export default usePlc_dashboardColumns;
