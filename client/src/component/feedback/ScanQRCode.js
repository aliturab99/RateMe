import QrCode2Icon from '@mui/icons-material/QrCode2';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { Html5QrcodeScanner } from "html5-qrcode";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ScanQRCode() {
    const [open, setOpen] = useState(false);
    const navigator = useNavigate()

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    function onScanSuccess(decodedText, decodedResult) {
        // handle the scanned code as you like, for example:
        if (decodedText.includes('employees/feedback/')) {
            let url = decodedText.replace(process.env.REACT_APP_BASE_URL, "")
            navigator(url)
        }
    }

    function onScanFailure(error) {}

    const scanQrCode = () => {
        setOpen(true)
        setTimeout(() => {

            let html5QrcodeScanner = new Html5QrcodeScanner(
                "reader",
                { fps: 10, qrbox: { width: 500, height: 500 } }, false);
            html5QrcodeScanner.render(onScanSuccess, onScanFailure);
        }, 300);
    }
    return (
        <>
            <Button startIcon={<QrCode2Icon />} onClick={scanQrCode}>Scan Qr Code</Button>
            <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>
                    Scan Qr Code
                </DialogTitle>
                <DialogContent sx={{ textAlign: "center" }}>
                    <div id="reader" width="1000px"></div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} autoFocus>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
export default ScanQRCode;
