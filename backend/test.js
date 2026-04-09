import prisma from "./config/db.js"

async function main() {
    const users = await prisma.students.findMany()
    console.log(users)
}

async function getAllExam() {
    const exam = await prisma.exams.findMany()
    console.log(exam)
}


const Student = [
    { name: "Nguen Van A", className: "10B", },
    { name: "Nguen Van B", className: "10B", },
    { name: "Dao Xuan Toan", className: "10B", },
    { name: "Shark Toan", className: "10B", },
    { name: "Nguen Van C", className: "10B", }
]

const keyword = "d"
const myName = Student.filter(o => o.name.toLowerCase().includes(keyword.toLowerCase()))
if (myName===null) {
    console.log("ssss")
}
else {
    console.log(myName[0])
}