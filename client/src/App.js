import { Button } from "@mui/material";
import { useDispatch } from "react-redux";
import Alert from "./component/library/Alert";
import { showSuccess } from "./store/actions/alertActions";

function App() {
  const dispatch = useDispatch();
  return (
    <div className="App">
      <Button onClick={ () => dispatch(showSuccess("Successfull")) }>Click me</Button>
      <Alert />
    </div>
  );
}

export default App;
