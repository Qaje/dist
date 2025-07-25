import React from 'react';
import {Helmet} from 'react-helmet';
import {useSelector} from "react-redux";

const TabTitle = (props) => {
    const { title } = props;
    const {frontSetting} = useSelector(state => state)

    return (
        <Helmet>
            <title>{title + ' '} {frontSetting ? ` | ${frontSetting?.value?.app_name || "POS-Saas"}` : ""}</title>
            {frontSetting && <link rel="icon" type="image/png" href={frontSetting ? frontSetting?.value?.app_favicon : "./../../../public/favicon.ico"}  sizes="16x16" />}
        </Helmet>
    )
}

export default TabTitle;
