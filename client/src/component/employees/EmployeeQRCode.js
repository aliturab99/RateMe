import QrCode2Icon from '@mui/icons-material/QrCode2';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
import qrious from 'qrious';
import { useState } from 'react';

function EmployeeQRCode({employeeId, name}) {
    const [open, setOpen] = useState(false);
    const url = process.env.REACT_APP_BASE_URL + "employees/feedback/" + employeeId;
    console.log(url)

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const createQRCode = () => {
        setOpen(true)
        setTimeout(() => {
            const qr = new qrious({
                element: document.getElementById('qr-code'),
                value: url,
                size: 200,
                padding: 2
            })
            document.getElementById("download-qr-code").setAttribute('href', qr.toDataURL())
        }, 300);
    }
    return (
        <>
            <IconButton onClick={createQRCode}> <QrCode2Icon /> </IconButton>
            <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>
                    {name} - QR Code
                </DialogTitle>
                <DialogContent sx={{ textAlign: "center" }}>
                    <canvas id="qr-code"></canvas>
                </DialogContent>
                <DialogActions>
                    <Button component="a" id="download-qr-code" variant='contained' download={`${name} - qrcode.png`}>
                        Download
                    </Button>
                    <Button onClick={handleClose} autoFocus>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default EmployeeQRCode