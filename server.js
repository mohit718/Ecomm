import express from "express";
import morgan from "morgan";
import colors from "colors";
import path from "path";
import { config } from "dotenv";
import connectDB from "./backend/config/db.js";
import { notFound, errorHandler } from "./backend/middlewares/errorMiddleware.js";
import productRoutes from "./backend/routes/productRoutes.js";
import userRoutes from "./backend/routes/userRoutes.js";
import orderRoutes from "./backend/routes/orderRoutes.js";
import uploadRoutes from "./backend/routes/uploadRoutes.js";

config();

connectDB();

const app = express();
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());
if(process.env.NODE_ENV === "production") {
  app.use(express.static('frontend/build'));
  app.get("/",(req,res)=>{
    res.sendFile(path.resolve(__dirname,'frontend','build','index.html'));
  });
}

app.get("/api/config/paypal", (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID)
);

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));
app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;
app.listen(port, () =>
  console.log(
    `Server running on ${process.env.NODE_ENV} localhost:${port}`.yellow.bold
  )
);
