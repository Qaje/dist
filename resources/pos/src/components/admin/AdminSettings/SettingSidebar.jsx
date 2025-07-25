import { faGears, faMoneyBill1Wave } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { getFormattedMessage } from '../../../shared/sharedMethod'

const SettingSidebar = () => {
    const location = useLocation();
    return (
        <div className="me-5">
            <ul className="d-flex nav  mb-5 pb-1 overflow-auto flex-nowrap text-nowrap flex-column setting-tab">
                <li className=" nav-item d-flex align-items-center">
                    <Link className={`nav-link w-100 d-block ${location.pathname.includes("/settings") ? 'active' : ''}`} to="/admin/settings"><FontAwesomeIcon icon={faGears} className="text-gray-600" /> {getFormattedMessage("general.label")}</Link>
                </li>
                <li className="nav-item d-flex align-items-center">
                    <Link className={`nav-link w-100 d-block ${location.pathname.includes("/payment-settings") ? 'active' : ''}`} to="/admin/payment-settings"><FontAwesomeIcon icon={faMoneyBill1Wave} className="text-gray-600" /> {getFormattedMessage("payment-settings.title")}</Link>
                </li>
            </ul>
        </div>
    )
}

export default SettingSidebar