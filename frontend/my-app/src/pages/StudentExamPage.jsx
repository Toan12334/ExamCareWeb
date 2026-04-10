import { studentExamColumns } from "../constants/studentExam.columns.jsx"
import DataTable2 from "../components/table/DataTable2"
export default function StudentExamPage(){


    return(
        <div>
            <DataTable2 columns={studentExamColumns}/>
            
        </div>
    )
}