
import React, { useEffect } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import notifStore from '../../stores/notif';
import { Notif, NotifType } from '../../models/notif';

const SnackAdd = (props: any) => {
    const [open, setOpen] = React.useState(false);
    const [text, setText] = React.useState('');
    const [duration, setDuration] = React.useState(800);

    useEffect(() => {
        const subscription = notifStore.subscribe((notif: Notif) => {
            if ([NotifType.MEMO].indexOf(notif.type) > -1){
                setText(notif.message);
                setOpen(true);    
                if(notif.duration) setDuration(notif.duration); else setDuration(800);
            }
        });
        return () => {
            // Nettoyage de l'abonnement
            subscription.unsubscribe();
        };
    });


    const handleClose = (event: React.SyntheticEvent | React.MouseEvent, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    return (
        <Snackbar
            open={open}
            autoHideDuration={duration}
            onClose={handleClose}
            message={text ? text : "Action réalisée"}
            action={
                <React.Fragment>
                    <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </React.Fragment>
            }
        />
    );
}

export default SnackAdd;