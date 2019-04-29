import React, { Component } from 'react'
import { connect } from 'react-redux'
import { PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent } from 'semantic-ui-react';
import { SizeMe } from 'react-sizeme'


const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const mapPieData = (state) => ({
  pieData: state.pieData
})

class PieChartCards extends Component {
  state = {}

  render() {
    const {pieData} = this.props    
    return (
      <SizeMe>{({ size }) =>
       <Card>
            <Card.Content>
                <Card.Header>
                    <h2>{this.props.sensor}</h2>
                </Card.Header>
                <CardContent>
                    <PieChart width={240} height={100} onMouseEnter={this.onPieEnter} style={{paddingTop:"1em"}} >
                        <Pie
                        data={pieData}
                        cx={size.width*0.405}
                        cy={100}
                        startAngle={180}
                        endAngle={0}
                        innerRadius={(size.width*0.36)-20}
                        outerRadius={size.width*0.36}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        >
                        {
                            pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
                        }
                        </Pie>
                    </PieChart>
                    <h3>{this.props.units}</h3>
                </CardContent>    
            </Card.Content>
           <div> </div></Card>      
      }</SizeMe>
    )
  }
}

export default connect(mapPieData)(PieChartCards)