import app from "./app.js"



app.listen(Number(process.env.PORT), () => {
  console.log(`Server running at: http://localhost:${Number(process.env.PORT)}`)
  console.log(`Student API: http://localhost:${Number(process.env.PORT)}/api/`)
})