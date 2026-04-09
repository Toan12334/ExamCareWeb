import { useState } from "react"
import useSkill from "../../hooks/useSkill"
import DataTable from "../../components/table/DataTable"
import Button from "../../components/ui/Button"
import SkillFilter from "../../components/search/SkillFilter"
import useTopic from "../../hooks/useTopic"
import SkillForm from "../../components/form/SkillForm"
import { updateSkillData } from "../../services/skill.service"


export default function SkillPage() {
    const { skills, pagination, loading, error,filters, fetchSkills, searchSkill, onChangePage, getSkillId, createNewSkill,deleteSkillById } = useSkill()
    const { topics } = useTopic()
    const [openForm, setOpenForm] = useState(false)
    const [selectedSkill, setSelectedSkill] = useState(null);
    const columns = [
        { key: "SkillId", title: "ID" },
        { key: "SkillName", title: "Tên kỹ năng" },
        { key: "TopicName", title: "Chủ đề" },
        { key: "EasyCount", title: "Dễ" },
        { key: "MediumCount", title: "Trung bình" },
        { key: "HardCount", title: "Khó" },
        { key: "TotalQuestions", title: "Tổng câu" },
        { key: "AvgAccuracy", title: "Độ chính xác (%)" }
    ]



    const handleSubmit = async (data) => {
        if (data.SkillId) {
            await updateSkillData(data.SkillId, data)

            await fetchSkills({}, pagination.page)

        } else {
            await createNewSkill(data)
            await fetchSkills({}, 1)
        }

        setOpenForm(false)
    }
    const handleGetSkillId = async (id) => {
        const res = await getSkillId(id)
        console.log(res)
        setSelectedSkill(res)
        setOpenForm(true)
        return res.SkillId
    }
    const handleDeleteSkill =async (id)=>{
        await deleteSkillById(id)
        fetchSkills(filters,pagination.page)
    }

    const renderActions = (row) => {
        return (
            <div className="flex gap-2 justify-center">
                <Button variant="primary" onClick={() => { handleGetSkillId(row.SkillId) }}>
                    Sửa
                </Button>
                <Button variant="danger" onClick={() => handleDeleteSkill(row.SkillId)}>
                    Xóa
                </Button>
            </div>
        )
    }

    return (
        <div className="p-6 space-y-4">
            {loading && <p>Đang tải dữ liệu...</p>}
            {error && <p className="text-red-500">{error}</p>}
            <SkillFilter
                topics={topics} onSearch={(keyword, topicId) => {
                    searchSkill(keyword, topicId, 1, 10)
                }}
            />
            <DataTable
                columns={columns}
                data={skills}
                pagination={pagination}
                onPageChange={onChangePage}
                renderActions={renderActions}
                onAdd={() => { setSelectedSkill({}); setOpenForm(true) }}
            />
            {openForm && selectedSkill && (
                <SkillForm
                    defaultValues={selectedSkill || {}}
                    topics={topics}
                    onSubmit={handleSubmit}
                    onCancel={() => { setOpenForm(false) }} />
            )}

        </div>
    )
}