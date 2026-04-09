import FilterBar from "../filter/FilterBar"
import InputField from "../filter/InputField"
import SelectField from "../filter/SelectField"
import { useForm } from "react-hook-form"

export default function SkillFilter({ onSearch, topics = [] }) {

  const { register, handleSubmit, reset } = useForm()

  const onFilter = (data) => {
    if (onSearch) {
      onSearch({
        keyword: data.keyword?.trim() || "",
        topicId: data.topicId || ""
      })
    }
  }

  return (
    <FilterBar
      onSubmit={handleSubmit(onFilter)}
      onReset={() => {
        reset()
        onSearch({
          keyword: "",
          topicId: ""
        })
      }}
    >
      <InputField
        name="keyword"
        register={register}
        placeholder="Tìm kỹ năng..."
      />

      <SelectField
        name="topicId"
        register={register}
        options={[
          { value: "", label: "Tất cả chủ đề" },
          ...topics.map(topic => ({
            value: topic.TopicId,
            label: topic.TopicName
          }))
        ]}
      />
    </FilterBar>
  )
}