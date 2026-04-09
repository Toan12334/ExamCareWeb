import { useMemo } from "react"
import SelectField from "../../fields/SelectField"
import MultiCheckbox from "../../fields/MultiCheckbox"
export default function QuestionGeneralInfo({
  formData,
  setFormData,
  topics = [],
  skills = [],
  difficulties = [],
  questionTypes = [], errorName = ""
}) {

  // ================= HANDLERS =================
  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const handleTopicChange = (value) => {
    setFormData(prev => ({
      ...prev,
      TopicId: value,
      SkillIds: []
    }))
  }

  const handleMultiChange = (id) => {
    const current = formData.SkillIds

    if (current.includes(id)) {
      handleChange("SkillIds", current.filter(i => i !== id))
    } else {
      handleChange("SkillIds", [...current, id])
    }
  }

  // ================= FILTER =================
  const filteredSkills = useMemo(() => {
    if (!formData.TopicId) return []
    return skills.filter(s => s.topicId === Number(formData.TopicId))
  }, [formData.TopicId, skills])

  return (
    <div>
      <h2 className="text-cyan-500 font-medium mb-4">
        1. Thông tin chung
      </h2>

      <div className="grid grid-cols-2 gap-6">

        <SelectField
          label="Chủ đề"
          value={formData.TopicId}
          options={topics}
          onChange={handleTopicChange}
          error={errorName}
        />
        <SelectField
          label="Mức độ"
          value={formData.DifficultyId}
          options={difficulties}
          onChange={(v) => handleChange("DifficultyId", v)}
          error={errorName}
        />

        <SelectField
          label="Loại câu hỏi"
          value={formData.TypeId}
          options={questionTypes}
          onChange={(v) => handleChange("TypeId", v)}
          error={errorName}
        />

        <MultiCheckbox
          label="Kỹ năng"
          disabled={!formData.TopicId}
          options={filteredSkills}
          selected={formData.SkillIds}
          onChange={handleMultiChange}
          emptyText="Vui lòng chọn chủ đề trước"
        />

      </div>
    </div>
  )
}