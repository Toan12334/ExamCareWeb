export default class Handle{
    static getStatements(input) {
        if (!input) return [];
    
        return input
            .split(";")
            .map(pair => {
                const [id, value] = pair.split(":");
                return {
                    StatementId: Number(id),
                    value: value === "T"
                };
            });
    }


    static compareTrueFalseAnswers(studentAnswer, correctStatements) {
        const correctMap = new Map(
            correctStatements.map(item => [item.StatementId, item.IsCorrect])
        );
    
        let correctCount = 0;
    
        const result = studentAnswer.map(item => {
            const correctValue = correctMap.get(item.StatementId);
            const isCorrect = correctValue === item.value;
    
            if (isCorrect) correctCount++;
    
            return {
                statementId: item.StatementId,
                studentValue: item.value,
                correctValue,
                isCorrect
            };
        });
    
        return {
            result,
            correctCount,
            total: studentAnswer.length,
            isAllCorrect: correctCount === studentAnswer.length
        };
    }

}