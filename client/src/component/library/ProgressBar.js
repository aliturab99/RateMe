import { LinearProgress } from "@mui/material";
import { useSelector } from "react-redux";

function ProgressBar() {
    const loading = useSelector(state => (state.progressBar.loading))
    if (!loading) return null;
    return (
        <div>
            {
                loading && <LinearProgress />
            }
        </div>
    )
}


export default ProgressBar;