import app from "./app.js";

const port = Number(process.env.PORT || 4000);

app.listen(port, () => {
  console.log(`WES FSM API listening on port ${port}`);
});
