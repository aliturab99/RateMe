import { Button } from "@mui/material";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import AppPublic from "./AppPublic";
import Alert from "./component/library/Alert";
import ProgressBar from "./component/library/ProgressBar";
import { showSuccess } from "./store/actions/alertActions";
import { loadAuth, loadToken } from "./store/actions/authActions";
import { hideProgressBar, showProgressBar } from "./store/actions/progressBarActions";

function App() {
  const dispatch = useDispatch();


  useEffect( () => {
    dispatch(loadToken())
    dispatch(loadAuth())
  },[])

  return <AppPublic />
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
