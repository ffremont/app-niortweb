
import React, { useEffect } from 'react';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { AppBar, Dialog, Slide, Toolbar, Typography } from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions';
import './CryptoGraph.scss';
import conf from '../../confs';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children?: React.ReactElement },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const CryptoGraph = (props: any) => {
    const [open, setOpen] = React.useState(false);
    const [crypto, setCrypto] = React.useState('');

    useEffect(() => {
        setOpen(props.open);
    }, [props.open]);

    useEffect(() => {
        setCrypto(props.crypto);
    }, [props.crypto]);

    const handleClose = () => {
        setOpen(false);

        if (props.onClose) props.onClose();
    };

    return (
        <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
            <AppBar>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" >
                        Cours du {crypto}
            </Typography>

                </Toolbar>
            </AppBar>
            
            <div className="w1"><div className="w2"><iframe src={conf.coinlib[crypto]} width="100%" height="536px" scrolling="auto" className="w4"></iframe></div></div>
        </Dialog>
    );
}

export default CryptoGraph;