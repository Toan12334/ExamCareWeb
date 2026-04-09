import DataTable from "../../components/table/DataTable"
import TopicFilter from "../../components/search/TopicFilter"
import TopicForm from "../../components/form/TopicForm"
import useTopic from "../../hooks/useTopic"
import Button from "../../components/ui/Button"
import { Pencil } from "lucide-react"
import { useState } from "react"
export default function TopicPage() {
    const [topicForm, setTopicForm] = useState(false)
    const [selectedTopic, setSelectedTopic] = useState(null)
    const { topics, searchData, createTopic, editTopic } = useTopic()

    const handleSearch = (keyword) => {
        searchData(keyword)
    }

    const handleSubmit = async (data) => {
        if (data.TopicId) {
            await editTopic(data.TopicId, data)
        } else {
            await createTopic(data)
        }

        setTopicForm(false)
        setSelectedTopic(null)
    }

    const columns = [
       
        { key: "TopicName", title: "Tên chủ đề" },
        { key: "QuestionCount", title: "Số lượng câu hỏi" }
    ]

    return (
        <>
            <TopicFilter onSearch={handleSearch} />
            <DataTable
                onAdd={() => { setTopicForm(true); }}
                columns={columns}
                data={topics || []}
                renderActions={(row) => (
                    <Button onClick={() => { setSelectedTopic(row); setTopicForm(true) }}
                    >
                        <Pencil size={18} />
                    </Button>
                )}
            />
            {topicForm && (
                <TopicForm
                    topic={selectedTopic}
                    onSubmit={handleSubmit}
                    onCancel={() => {
                        setTopicForm(false)
                        setSelectedTopic(null)
                    }}
                />
            )}
        </>
    )
}