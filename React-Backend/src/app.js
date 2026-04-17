import express, { urlencoded } from "express";
import cors from "cors";
import cookieparser from "cookie-parser";

// routes import
import authRouter from './routes/auth.routes.js'
import userRouter from './routes/user.routes.js'
import departmentRouter from './routes/department.routes.js'
import employeeRouter from './routes/employee.routes.js'
import salaryRouter from './routes/salary.routes.js'
import leaveRouter from './routes/leave.routes.js'
import reviewRouter from './routes/review.routes.js'
import noticeRouter from './routes/notice.routes.js'

const app = express()
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({ limit: '16kb' }))
app.use(urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieparser());

// routes declaration
app.use("/api/v1/auth", authRouter)
app.use("/api/v1/user", userRouter)
app.use("/api/v1/department", departmentRouter)
app.use("/api/v1/employee", employeeRouter)
app.use("/api/v1/salary", salaryRouter)
app.use("/api/v1/leave", leaveRouter)
app.use("/api/v1/review", reviewRouter)
app.use("/api/v1/notice", noticeRouter)

// Global error handler
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
        errors: err.errors || []
    });
});

export { app };
