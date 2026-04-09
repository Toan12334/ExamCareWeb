export function calculateStats(examQuestions) {
    const total = examQuestions.length
    const duration = examQuestions.reduce((sum, q) => sum + (q.duration || 0), 0)
  
    const count = { Dễ: 0, Vừa: 0, Khó: 0 }
  
    examQuestions.forEach((q) => {
      if (count[q.difficulty] !== undefined) {
        count[q.difficulty] += 1
      }
    })
  
    return { total, duration, count }
  }
  
  export function filterQuestionBank(questionBank, filters) {
    return questionBank.filter((q) => {
      const matchesSearch = q.content
        .toLowerCase()
        .includes(filters.search.toLowerCase())
  
      const matchesTopic =
        filters.topic === "Tất cả" || q.topic === filters.topic
  
      const matchesSkill =
        filters.skill === "Tất cả" || q.skill === filters.skill
  
      const matchesDifficulty =
        filters.difficulty === "Tất cả" || q.difficulty === filters.difficulty
  
      const matchesType =
        filters.type === "Tất cả" || q.type === filters.type
  
      return (
        matchesSearch &&
        matchesTopic &&
        matchesSkill &&
        matchesDifficulty &&
        matchesType
      )
    })
  }
  
  export function reorderQuestions(list, index, direction) {
    const next = [...list]
    const newIndex = direction === "up" ? index - 1 : index + 1
  
    if (newIndex < 0 || newIndex >= next.length) return list
  
    ;[next[index], next[newIndex]] = [next[newIndex], next[index]]
  
    return next.map((item, idx) => ({
      ...item,
      order: idx + 1,
    }))
  }

  export function moveArrayItem(array, from, to) {
    const next = [...array];
  
    if (to < 0 || to >= array.length) return array;
  
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
  
    return next;
  }

  export function statisticTypeQuestion(selectArray) {
    return selectArray.reduce(
      (acc, item) => {
        const type = (item.TypeName || "").toLowerCase().trim();
  
        if (type.includes("đúng") || type.includes("sai")) {
          acc.trueFalse++;
        } 
        else if (
          type.includes("trắc") // bắt cả "trắc nghiệm" & "trắc nhiệm"
        ) {
          acc.multipleChoice++;
        } 
        else if (
          type.includes("trả lời") || type.includes("ngắn")
        ) {
          acc.shortAnswer++;
        } 
        else {
          acc.other++;
        }
  
        return acc;
      },
      {
        trueFalse: 0,
        multipleChoice: 0,
        shortAnswer: 0,
        other: 0,
      }
    );
  }