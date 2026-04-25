/* eslint-disable no-undef */
import useClasses from "../../hooks/useClasses.js";
import DataTable2 from "../../components/table/DataTable2.jsx";
import { classesColumns,buildClassFilters } from "../../constants/calsses.columns.jsx";
import Button from "../../components/ui/Button.jsx";
import { Pencil, Trash2 } from "lucide-react";
export default function ClassesPage() {
    const renderActions = (row) => {
        return (
            <div className="flex justify-center gap-2">
                <Button variant="primary"  onClick={() => handleEdit(row)}><Pencil size={18}/></Button>
                <Button variant="danger" onClick={() => handleDelete(row)}><Trash2 size={18}/></Button>
            </div>
        );
    };
    // eslint-disable-next-line no-unused-vars
    const {  classes, pagination,changePage, searchClass,resetFilters } = useClasses();
return(
 <DataTable2 renderAction={renderActions} onReset={resetFilters} filters={buildClassFilters} pagination={pagination} onSearch={searchClass} onPageChange={changePage} 
  data={classes} title="Quản lý lớp" columns={classesColumns()} />

)

}