import { faBars } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
} from "chart.js"
import React, { useState } from 'react'
import { Card, NavDropdown } from 'react-bootstrap'
import { Bar, Line } from 'react-chartjs-2'
import { getFormattedMessage, placeholderText } from '../../../shared/sharedMethod'
import { connect, useSelector } from 'react-redux'
import Spinner from '../../../shared/components/loaders/Spinner'

const DashboardChart = ({ frontSetting, isLoading }) => {
    const adminDashboardData = useSelector((state) => state.adminDashboardData);
    const [isLineChart, isSetLineChart] = useState(false);
    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        BarElement,
        Title,
        Tooltip,
        Legend
    );
    const barChartData = {
        labels: adminDashboardData.earning_chart?.labels,
        datasets: [
            {
                label: `${placeholderText("chart.earnings.title")} ( ${frontSetting?.value?.admin_default_currency_symbol ?? ""} )`,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                data: adminDashboardData.earning_chart?.dataset,
            },
        ],
    };

    const barChartOptions = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        isLoading || !adminDashboardData ? (
            <Spinner />
        ) : (
            <div className="row">
                <div className="col-12 mb-4">
                    <Card>
                        <Card.Header className="pb-0 px-10">
                            <h5 className="mb-0">
                                {getFormattedMessage(
                                    "dashboard.EarningChart.title"
                                )}
                            </h5>
                            <div className="mb-2 chart-dropdown">
                                <NavDropdown
                                    title={<FontAwesomeIcon icon={faBars} />}
                                >
                                    <NavDropdown.Item
                                        href="#/"
                                        className={`${isLineChart === true
                                            ? ""
                                            : "text-primary"
                                            } fs-6`}
                                    >
                                        {getFormattedMessage("bar.title")}
                                    </NavDropdown.Item>
                                    <NavDropdown.Item
                                        href="#"
                                        className={`${isLineChart === true
                                            ? "text-primary"
                                            : ""
                                            } fs-6`}
                                        onClick={() => isSetLineChart(true)}
                                    >
                                        {getFormattedMessage("line.title")}
                                    </NavDropdown.Item>
                                </NavDropdown>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div>
                                {isLineChart ? (
                                    <Line options={barChartOptions} data={barChartData} height={70} />
                                ) : (
                                    <Bar options={barChartOptions} data={barChartData} height={70} />
                                )}
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        )
    )
}

const mapStateToProps = (state) => {
    const { frontSetting } = state;
    return { frontSetting };
};

export default connect(mapStateToProps)(DashboardChart);