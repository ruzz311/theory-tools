
import React, { useEffect } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.primary.main
    },
    form: {
        width: "100%", // Fix IE 11 issue.
        marginTop: theme.spacing(1)
    },
    submit: {
        margin: theme.spacing(3, 0, 2)
    }
}));

export default function Tuner() {
    const classes = useStyles();

    useEffect(() => {
        let source: MediaStreamAudioSourceNode;
        // @ts-ignore
        let audioContext = new (window.AudioContext || window.webkitAudioContext)();
        let analyser = audioContext.createAnalyser();
        analyser.minDecibels = -100;
        analyser.maxDecibels = -10;
        analyser.smoothingTimeConstant = 0.85;

        if (!navigator?.mediaDevices?.getUserMedia) {
            // No audio allowed
            alert('Sorry, getUserMedia is required for the app.')
        } else {
            var constraints = { audio: true };
            navigator.mediaDevices.getUserMedia(constraints)
                .then(
                    function (stream) {
                        // Initialize the SourceNode
                        const source = audioContext.createMediaStreamSource(stream);
                        // Connect the source node to the analyzer
                        source.connect(analyser);
                        // Show the visualization
                        // visualize();
                    }
                )
                .catch(function (err) {
                    alert('Sorry, microphone permissions are required for the app. Feel free to read on without playing :)')
                });
        }
        
        // Anything in here is fired on component unmount.
        return () => {
            console.log('shopuld fire on "unload"')
            audioContext.close();
            if (source) source.disconnect(analyser);
        }
    })


    return (
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <p>Tuner</p>
        </Container>
      );
}
