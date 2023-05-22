import { Box } from "@mui/system"
import { useSelector } from "react-redux"

function BlockInterface() {
    const loading = useSelector(state => state.progressBar.loading)
    if (!loading) return null;
  return (
    <Box width={"100%"} height="100%" bgcolor={"#ffffff8a"} position="absolute" top={0} left={0} zIndex={"1"} >
        
    </Box>
  )
}

export default BlockInterface