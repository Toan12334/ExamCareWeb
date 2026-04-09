import FilterBar from "../filter/FilterBar";
import InputField from "../filter/InputField";
import { useForm } from "react-hook-form"
export default function TopicFilter({ onSearch }) {
    const { register, handleSubmit, reset } = useForm()

    const onFilter = (data) => {
        if (onSearch) {
            onSearch(data.keyword?.trim())
        }
    }

    return (
        <FilterBar
            onSubmit={handleSubmit(onFilter)}
            onReset={() => {
                reset()
                onSearch("") // reset filter
            }}
        >
            <InputField
                name="keyword"
                register={register}
                placeholder="Tìm chủ đề..."
            />
        </FilterBar>
    )
}