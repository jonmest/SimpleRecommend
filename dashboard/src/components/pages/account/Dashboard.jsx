import React, { Fragment, useState, useEffect, useContext } from 'react'
import GlobalContext from '../../../context/global/GlobalContext'
import { useCookies } from 'react-cookie'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import { ResponsiveContainer, CartesianGrid, YAxis, Tooltip, Legend, XAxis, LineChart, Line } from 'recharts';

const Dashboard = ({ state }) => {
    const globalState = useContext(GlobalContext)
    const [statistics, setStatistics] = useState(null)
    const [chartData, setChartData] = useState(null)

    const generateChartData = stats => {
        const data = stats.errors_history.map(({ mean_fcp, mean_rmse, mean_mae, std_rmse, std_mae, std_fcp, CreatedAt }) => {
            const date = new Date(CreatedAt).toString()
            return { mean_fcp, mean_rmse, mean_mae, std_rmse, std_mae, std_fcp, date }
        })
        setChartData(data)
    }

    useEffect(() => {
        fetch(process.env.REACT_APP_PROVIDER_API_URL + '/account/statistics?errors=all', {
            method: 'GET', mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + Cookies.get('token')
            }
        })
            .then(res => res.json())
            .then(res => res.data)
            .then(data => {
                setStatistics(data)
                return data
            })
            .then(data => {
                generateChartData(data)
            })
    }, [])



    return (
        !statistics ?
            <Loader
                type="Puff"
                color="#00BFFF"
                height={100}
                width={100} //3 secs   
            /> : <Fragment>
                <section class="section">
                    <div class="container">
                        <div class="columns">
                            <div class="column">
                                <div class="card has-background-success">
                                    <div class="card-content">
                                        <p class="title">
                                            {statistics['unique_users_last_month']}
                                        </p>
                                        <p class="subtitle">
                                            Users tracked this month
                                </p>
                                    </div>
                                </div>
                            </div>
                            <div class="column">
                                <div class="card has-background-info">
                                    <div class="card-content">
                                        <p class="title">
                                            {statistics['unique_users_total']}
                                        </p>
                                        <p class="subtitle">
                                            Users tracked all time
                                </p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>
                <section class="section">
                    <div class="container">
                        <p class="title">
                            Current model metrics
                </p>
                        <p className="subtitle">
                            <a href="#">Learn what these metrics can tell you.</a>
                        </p>
                        <table class="table is-fullwidth is-striped">
                            <thead>
                                <tr>
                                    <th>Metric</th>
                                    <th>Average</th>
                                    <th>Standard Deviation</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>MAE</td>
                                    <td>
                                        {statistics.current_error.mean_mae.toFixed(4)}
                                    </td>
                                    <td>
                                        {statistics.current_error.std_mae.toFixed(4)}
                                    </td>
                                </tr>
                                <tr>
                                    <td>RMSE</td>
                                    <td>
                                        {statistics.current_error.mean_rmse.toFixed(4)}
                                    </td>
                                    <td>
                                        {statistics.current_error.std_rmse.toFixed(4)}
                                    </td>
                                </tr>
                                <tr>
                                    <td>FCP</td>
                                    <td>
                                        {statistics.current_error.mean_fcp.toFixed(4)}
                                    </td>
                                    <td>
                                        {statistics.current_error.std_fcp.toFixed(4)}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>
                <section className="section">
                    <div className="container">
                        <p class="title">
                            Over time
                </p>
                        <LineChart width={700} height={400} data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" padding={{ left: 30, right: 30 }} />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line name="MAE" type="monotone" dataKey="mean_mae" stroke="#8884d8" activeDot={{ r: 8 }} />
                            <Line name="RMSE" type="monotone" dataKey="mean_rmse" stroke="#82ca9d" activeDot={{ r: 8 }} />
                            <Line name="FCP" type="monotone" dataKey="mean_fcp" stroke="#82dd9d" activeDot={{ r: 8 }} />
                        </LineChart>
                    </div>
                </section>
            </Fragment>

    )
}

export default Dashboard