import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
    root: {
        width: 140,
        height: 100
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 2,
    },
});

export default function SimpleCard({ metricName, val }) {
    const classes = useStyles();

    return (
        <Card className={classes.root}>
            <CardContent>
                <Typography className={classes.title} color="textPrimary" gutterBottom>
                    {metricName}
                </Typography>
                <Typography variant="h3" component="h2">
                    {val}
                </Typography>
            </CardContent>
        </Card>
    );
}