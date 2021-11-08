/* eslint-disable default-case */
import React from 'react';
import { useQuery, gql } from '@apollo/client';
import dayjs from 'dayjs';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const thirtyMinsAgo = dayjs().subtract(30, 'minute').valueOf();


const historicalData = gql`
query ($input: [MeasurementQuery]) {
getMultipleMeasurements(input: $input) {
   metric
   measurements {
     at
     value
     unit
     metric
   }
}
}`


let chartData = []


// eslint-disable-next-line import/no-anonymous-default-export
export default ({ selectedMetrics }) => {
  if (selectedMetrics.length > 0) {
    const { loading, error, data } = useQuery(historicalData,
      {
        variables: {
          input: selectedMetrics.map(metric => {
            return { metricName: metric, after: thirtyMinsAgo }
          })
        }
      })
    if (!loading && !error && data.getMultipleMeasurements) {
      chartData = data.getMultipleMeasurements.reduce((flattenedArray, metricData) => {
        const conditionedData = metricData.measurements.map(data => ({ ...data, [data.metric]: data.value, at: dayjs(data.at).format("HH:MM") }))
        return flattenedArray.concat(conditionedData)
      }, [])
    }
  }

  const charts = selectedMetrics.map(metric => {
    let color;
    switch (metric) {
      case 'oilTemp':
        color = '#A52A2A';
        break;
      case 'waterTemp':
        color = '#00008B';
        break;
    }
    return <React.Fragment key={metric}>
      <Line dot={false} yAxisId={`${metric}at`} type="monotone" dataKey={metric} stroke={color} />

    </React.Fragment>
  })
  return <LineChart width={700} height={450} data={chartData}
    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
    <CartesianGrid strokeDasharray="3 3" />
    {charts}
    <XAxis dataKey="at" />
    {selectedMetrics.map(metric => <YAxis key={`${metric}at`} yAxisId={`${metric}at`} />)}
    <Tooltip />
    <Legend />
  </LineChart>
}




