import { faCoins, faUserCheck, faUsers, faUserTag } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import moment from 'moment'
import React, { useState } from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import { connect, useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Widget from '../../../shared/Widget/Widget'
import { getAvatarName, getFormattedDate, getFormattedMessage, placeholderText } from '../../../shared/sharedMethod'
import TabTitle from "../../../shared/tab-title/TabTitle"
import ReactDataTable from '../../../shared/table/ReactDataTable'
import { fetchAdminDashboardData } from '../../../store/action/admin/adminDashboardAction'
import MasterLayout from '../../MasterLayout'
import DashboardChart from './DashboardChart'
import TopProgressBar from "../../../shared/components/loaders/TopProgressBar";

const AdminDashboard = ({ frontSetting }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const adminDashboardData = useSelector((state) => state.adminDashboardData);

  let mappedUsers = [];
  if (adminDashboardData?.recent_users?.length >= 0) {
    mappedUsers = adminDashboardData?.recent_users?.map((user) => ({
      date: getFormattedDate(
        user?.created_at
      ),
      time: moment(user?.created_at).format("LT"),
      email: user?.email,
      id: user?.id,
      image: user?.image_url,
      first_name: user?.first_name,
      last_name: user?.last_name,
    }));
  }

  const onChange = (filter) => {
    dispatch(fetchAdminDashboardData());
    setIsLoading(false);
  };

  const columns = [
    {
      name: getFormattedMessage("user-name.title"),
      selector: (row) => row.first_name,
      className: "w-100",
      cell: (row) => {
        const imageUrl = row.image ? row.image : null;
        const lastName = row.last_name ? row.last_name : "";
        return (
          <div className="d-flex align-items-center">
            <div className="me-2">
              <Link to={`/admin/users/detail/${row.id}`}>
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    height="50"
                    width="50"
                    alt="User Image"
                    className="image image-circle image-mini"
                  />
                ) : (
                  <span className="custom-user-avatar fs-5">
                    {getAvatarName(
                      row.first_name + " " + row.last_name
                    )}
                  </span>
                )}
              </Link>
            </div>
            <div className="d-flex flex-column">
              <Link
                to={`/admin/users/detail/${row.id}`}
                className="text-decoration-none"
              >
                {row.first_name + " " + lastName}
              </Link>
              <span>{row.email}</span>
            </div>
          </div>
        );
      },
    },
    {
      name: getFormattedMessage(
        "globally.react-table.column.created-date.label"
      ),
      selector: (row) => row.date,
      cell: (row) => {
        return (
          <span className="badge bg-light-info">
            <div className="mb-1">{row.time}</div>
            <div>{row.date}</div>
          </span>
        );
      },
    },
  ];

  return (
    <MasterLayout>
      <TopProgressBar />
      <TabTitle title={placeholderText("dashboard.title")} />
      <Row className="g-4">
        <Col className="col-12 mb-4">
          <Row>
            <Widget
              title={getFormattedMessage("total.earning.title")}
              className={`bg-info `}
              iconClass="bg-blue-300"
              currency={frontSetting?.value?.admin_default_currency_symbol ?? ""}
              icon={
                <FontAwesomeIcon
                  icon={faCoins}
                  className="fs-1-xl text-white"
                />
              }
              value={adminDashboardData?.earning ? adminDashboardData?.earning : 0}
            />

            <Widget
              title={getFormattedMessage("total.active.users.title")}
              className={`bg-primary `}
              iconClass="bg-cyan-300"
              currency={""}
              icon={
                <FontAwesomeIcon
                  icon={faUsers}
                  className="fs-1-xl text-white"
                />
              }
              value={adminDashboardData?.active_users ? adminDashboardData?.active_users : 0}
            />

            <Widget
              title={getFormattedMessage("total.subscriptions.title")}
              className={`bg-success `}
              iconClass="bg-green-300"
              currency={""}
              icon={
                <FontAwesomeIcon
                  icon={faUserTag}
                  className="fs-1-xl text-white"
                />
              }
              value={adminDashboardData?.total_subscriptions ? adminDashboardData?.total_subscriptions : 0}
            />

            <Widget
              title={getFormattedMessage("active.subscriptions.label")}
              className={`widget-bg-purple `}
              iconClass="bg-purple-700"
              currency={""}
              icon={
                <FontAwesomeIcon
                  icon={faUserCheck}
                  className="fs-1-xl text-white"
                />
              }
              value={adminDashboardData?.active_subscriptions ? adminDashboardData?.active_subscriptions : 0}
            />
          </Row>
        </Col>
      </Row>

      <DashboardChart isLoading={isLoading} />

      <div className="col-12 mb-4">
        <Card>
          <Card.Header className="pb-0 px-10">
            <h5 className="mb-0">
              {getFormattedMessage(
                "recent.registered.users.title"
              )}
            </h5>
          </Card.Header>
          <Card.Body className='pt-2'>
            <ReactDataTable
              columns={columns}
              items={mappedUsers}
              onChange={onChange}
              isShowSearch
              subHeader={false}
              pagination={false}
            />
          </Card.Body>
        </Card>
      </div>

    </MasterLayout>
  )
}


const mapStateToProps = (state) => {
  const { frontSetting } = state;
  return { frontSetting };
};

export default connect(mapStateToProps)(AdminDashboard);