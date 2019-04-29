import React, { Component } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, } from 'recharts';

class LineChartGraph extends Component {
  render() {
    return (
        <LineChart
            width={(this.props.ancho) - 30 }
            height={300}
            data={this.props.datos}
            margin={{
            top: 5, right: 30, left: 20, bottom: 5,
            }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey={this.props.eje} stroke="#8884d8" activeDot={{ r: 8 }} />
      </LineChart>
    )
  }
}

export default LineChartGraph
