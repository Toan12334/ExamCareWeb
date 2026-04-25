import useClasses from "../../hooks/useClasses.js";
import DataTable2 from "../../components/table/DataTable2.jsx";
import { classesColumns,buildClassFilters } from "../../constants/calsses.columns.jsx";
export default function ClassesPage() {
    // eslint-disable-next-line no-unused-vars
    const {  classes, pagination,changePage, searchClass,resetFilters } = useClasses();
return(
 <DataTable2 onReset={resetFilters} filters={buildClassFilters} pagination={pagination} onSearch={searchClass} onPageChange={changePage} 
  data={classes} title="Quản lý lớp" columns={classesColumns()} />

)

}