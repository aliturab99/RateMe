import axios from "axios"
import { hideProgressBar, showProgressBar } from "../../store/actions/progressBarActions"
import { showError } from "../../store/actions/alertActions"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { Box, Pagination, Rating, Typography } from "@mui/material"
import moment from "moment"

function EmployeeFeedback({ employeeId }) {

    const [ratings, setRatings] = useState([])
    const dispatch = useDispatch()
    const [page, SetPage] = useState(1)
    const [numOfPages, setNumOfPages] = useState(1)

    const loadRating = () => {
        dispatch(showProgressBar())
        axios.post("/api/employees/rating", { employeeId, page }).then(result => {
            setRatings(result.data.ratings)
            setNumOfPages(result.data.numOfPages)
            dispatch(hideProgressBar())
        }).catch(error => {
            let message = error && error.response && error.response.data ? error.response.data.error : error.message;
            dispatch(hideProgressBar())
            dispatch(showError(message))
        })
    }
    useEffect(() => {
        loadRating()
    }, [])
    return (

        <Box>
            <Typography gutterBottom variant="h5">
                Recent Feedback
            </Typography>
            {
                ratings.map(rating => (
                    <Box bgcolor="#7a7a7a" p={3} mb={2} key={rating._id}>
                        <Typography>
                            {rating.name}   <span style={{ marginLeft: "15px" }}>({moment(rating.createdOn).fromNow()})</span>
                        </Typography>
                        {
                            rating.phone && <Typography>{rating.phone}</Typography>
                        }
                        <Rating value={rating.rating} readOnly />
                        {
                            rating.message && <Typography>{rating.message}</Typography>
                        }
                    </Box>
                ))
            }
            <Box mt={3} display="flex" justifyContent={"center"}>
                <Pagination count={numOfPages} variant='outlined' color='primary' page={page} onChange={(event, value) => SetPage(value)} />
            </Box>
        </Box>

    )
}

export default EmployeeFeedback