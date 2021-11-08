import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Switch from '@material-ui/core/Switch';


const useStyles = makeStyles({
  card: {
    margin: '1% 18%',
    width: '950px'
  },
});


// eslint-disable-next-line import/no-anonymous-default-export
export default (props) => {
  const classes = useStyles();
  return (
    <Card className={classes.card}>
      <CardContent>
        <FormGroup row>
          {props.metrics.map((metric) => (
            <FormControlLabel
              key={metric}
              control={
                <Switch onChange={props.handleChange} checked={props?.selectedMetrics[metric]?.checked || false} name={metric} color="primary" />
              }
              label={metric}
            />
          ))}
        </FormGroup>
      </CardContent>
    </Card>
  );
};
