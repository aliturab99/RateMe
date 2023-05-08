import { Button } from "@mui/material";
import { useDispatch } from "react-redux";
import Alert from "./component/library/Alert";
import ProgressBar from "./component/library/ProgressBar";
import { showSuccess } from "./store/actions/alertActions";
import { hideProgressBar, showProgressBar } from "./store/actions/progressBarActions";

function App() {
  const dispatch = useDispatch();
  return (
    <div className="App">
      <Button onClick={() => dispatch(showSuccess("Successfull"))}>Click me</Button>
      <Button onClick={() => dispatch(showProgressBar())}>Show Progress Bar</Button>
      <Button onClick={() => dispatch(hideProgressBar())}>Hide Progress Bar</Button>
      <ProgressBar />
      <Alert />
    </div>
  );
}

export default App;
