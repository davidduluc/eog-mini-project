import React from 'react';
import { useQuery, gql, useSubscription } from '@apollo/client';
import { ToastContainer } from 'react-toastify';
import { MuiThemeProvider, createTheme, makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import Wrapper from './components/Wrapper';
import Chart from './components/Chart';
import MetricsMenu from './components/MetricsMenu';
import DataCard from './components/DataCard';

const theme = createTheme({
  palette: {
    primary: {
      main: 'rgb(39,49,66)',
    },
    secondary: {
      main: 'rgb(197,208,222)',
    },
    background: {
      default: 'rgb(226,231,238)',
    },
  },
});

const useStyles = makeStyles({
  chartContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  metricsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    maxWidth: '300px',
    justifyContent: 'space-between',
  },
});

const realTimeData = gql`
subscription {
  newMeasurement {
    metric
    at
    value
    unit
  }
}
`;

let realTimeMetrics = {};

const App = () => {
  const [selectedMetrics, setSelectedMetrics] = React.useState({});

  const { loading: getMetricsLoading, error: getMetricsError, data: getMetricsData } = useQuery(gql`
  query {
    getMetrics
  }
`);
  const { loading: realTimeDataLoading, error: realTimeDataError, data } = useSubscription(realTimeData);
  if (!realTimeDataLoading && !realTimeDataError && data.newMeasurement) {
    realTimeMetrics = { ...realTimeMetrics, [data.newMeasurement.metric]: data.newMeasurement.value };
  }

  const handleChange = (e) => {
    const metricName = e.target.name;
    if (selectedMetrics[metricName]) {
      // eslint-disable-next-line max-len
      setSelectedMetrics({ ...selectedMetrics, [metricName]: { checked: !selectedMetrics[metricName].checked } });
    } else {
      setSelectedMetrics({ ...selectedMetrics, [metricName]: { checked: true } });
    }
  };
  const historicalDataInput = Object.keys(selectedMetrics).filter(metric => {
    if (selectedMetrics[metric].checked) {
      return metric;
    } else return null
  });

  const classes = useStyles();

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Wrapper>
        <Header />
        <MetricsMenu
          metrics={(!getMetricsLoading && !getMetricsError && getMetricsData.getMetrics) || []}
          handleChange={handleChange}
          selectedMetrics={selectedMetrics}
        />
        <div className={classes.chartContainer}>
          <Chart selectedMetrics={historicalDataInput} />
          <div className={classes.metricsContainer}>
            {Object.keys(realTimeMetrics).map(metric => selectedMetrics[metric]?.checked
              && <DataCard metricName={metric} val={Math.floor(realTimeMetrics[metric])} />)}
          </div>
        </div>
        <ToastContainer />
      </Wrapper>
    </MuiThemeProvider>
  );
};

export default App;
