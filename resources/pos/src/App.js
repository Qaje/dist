import React, { useEffect, useState } from "react";
import { Route, useLocation, Navigate, Routes, useNavigate } from "react-router-dom";
import "../../pos/src/assets/sass/style.react.scss";
import { useDispatch, useSelector } from "react-redux";
import { IntlProvider } from "react-intl";
import { permissionMappings, ROLES, settingsKey, Tokens } from "./constants";
import Toasts from "./shared/toast/Toasts";
import { fetchFrontSetting } from "./store/action/frontSettingAction";
import { fetchConfig } from "./store/action/configAction";
import { addRTLSupport } from "./shared/sharedMethod";
import Login from "./components/auth/Login";
import ResetPassword from "./components/auth/ResetPassword";
import ForgotPassword from "./components/auth/ForgotPassword";
import AdminApp from "./AdminApp";
import { getFiles } from "./locales/index";
import Cookies from "js-cookie";
import SuperAdminApp from "./SuperAdminApp";
import Register from "./components/auth/Register";
import moment from "moment";
import "./locales/locales"
import 'moment/locale/ar';
import 'moment/locale/vi';

function App() {
    //do not remove updateLanguag
    const dispatch = useDispatch();
    const { updateLanguage, loginUser } = useSelector((state) => state);
    const location = useLocation();
    const token = Cookies.get("authToken");
    const navigate = useNavigate()
    const updatedLanguage = localStorage.getItem(Tokens.UPDATED_LANGUAGE);
    const { selectedLanguage, config, language, allConfigData } = useSelector(
        (state) => state
    );
    const [allLocales, setAllLocales] = useState({});
    const [messages, setMessages] = useState({});
    const [userEditedMessage, setUserEditedMessage] = useState({});
    const updateLanguag =
        allLocales[updatedLanguage ? updatedLanguage : selectedLanguage];
    const [languageData, setLanguageData] = useState([]);

    const mapPermissionToRoute = (permission) => {
        const permissionKey = permission.toLowerCase();
        if (permissionMappings.hasOwnProperty(permissionKey)) {
            return permissionMappings[permissionKey];
        } else {
            const entity = permissionKey.split("_").slice(1).join("-");
            return `/user/${entity}`;
        }
    };

    const [mappedRoutes, setMappedRoutes] = useState([]);
    const [redirectTo, setRedirectTo] = useState("");

    useEffect(() => {
        setMappedRoutes(config.map(mapPermissionToRoute));
    }, [config]);
    
    useEffect(() => {
        if (mappedRoutes && mappedRoutes.length > 0) {
            if (config.includes("manage_dashboard")) {
                setRedirectTo("/user/dashboard");
            } else if (config.includes("manage_sale")) {
                setRedirectTo("/user/sales");
            }
             else if(mappedRoutes.length === 1 && config.includes("manage_pos_screen")){
                setRedirectTo("/user/pos");
            }
             else {
                const currentPath = window.location.hash;
                const targetPath = mappedRoutes[0];
                if (currentPath === `#${targetPath}`) {
                    setRedirectTo(mappedRoutes[1]);
                } else {
                    setRedirectTo(mappedRoutes[0]);
                }
            }
        } else {
            setRedirectTo("/user/dashboard");
        }
    }, [mappedRoutes]);

    useEffect(() => {
        const getData = getFiles();
        setAllLocales(getData);
    }, [language, updateLanguage?.lang_json_array]);

    useEffect(() => {
        if (updateLanguage?.iso_code === updatedLanguage && languageData) {
            setUserEditedMessage(updateLanguage?.lang_json_array);
        }
    }, [language, languageData]);

    // updated language hendling
    useEffect(() => {
        if (Object.values(userEditedMessage).length !== 0) {
            setMessages(userEditedMessage);
        } else {
            if (updateLanguage?.iso_code === updatedLanguage) {
                const updateLanguages = updateLanguage?.lang_json_array;
                setMessages(updateLanguages);
            } else {
                if (
                    updateLanguag === undefined ||
                    updateLanguag === null ||
                    updateLanguag === ""
                ) {
                    const defaultUpdateLanguage = allLocales["en"];
                    setMessages(defaultUpdateLanguage);
                } else {
                    if (updateLanguag === undefined || updateLanguag === null) {
                        const defaultUpdateLanguage = allLocales["en"];
                        setMessages(defaultUpdateLanguage);
                    } else {
                        setMessages(updateLanguag);
                    }
                }
            }
        }
    }, [allLocales, updateLanguage?.lang_json_array]);

    useEffect(() => {
        selectCSS();
    }, [location.pathname]);

    useEffect(() => {
        const currentPath = location.pathname;
        if (token) {
            // if(loginUser.roles !== ROLES.SUPER_ADMIN){
            // }
            dispatch(fetchConfig());
            dispatch(fetchFrontSetting());
        } else if (!currentPath.includes("/forgot-password") && !currentPath.includes("/reset-password") && !currentPath.includes("/register")) {
            navigate("/login");
        }
    }, []);

    useEffect(() => {
        const isSuperAdmin = loginUser?.roles === ROLES.SUPER_ADMIN;
        const allowedPaths = [
            "/login",
            "/forgot-password",
            "/register",
            "/user/manage-subscription/upgrade",
        ];
        const isResetPasswordPath = location.pathname.startsWith("/reset-password") || location.pathname.startsWith("/user/compare-plan");
        const isAllowedPath = allowedPaths.includes(location.pathname) || isResetPasswordPath;
        if (
            allConfigData?.is_expired == true &&
            !isSuperAdmin &&
            !isAllowedPath
        ) {
            if(loginUser?.roles === ROLES.ADMIN && !allConfigData?.is_sub_user){
                navigate("/user/manage-subscription/upgrade");
            }
        }
    }, [allConfigData, loginUser, location.pathname]);

    const selectCSS = () => {
        if (updatedLanguage === "ar") {
            require("./assets/css/custom.rtl.css");
            require("./assets/css/style.rtl.css");
            require("./assets/css/frontend.rtl.css");
        } else {
            require("./assets/css/custom.css");
            require("./assets/css/style.css");
            require("./assets/css/frontend.css");
        }
    };

    useEffect(() => {
        addRTLSupport(updatedLanguage ? updatedLanguage : selectedLanguage);
        moment.locale(updatedLanguage || "en");
    }, [updatedLanguage, selectedLanguage]);

    return (
        <div className="d-flex flex-column flex-root">
            <IntlProvider
                locale={settingsKey.DEFAULT_LOCALE}
                messages={messages}
                onError={() => {}}
            >
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="reset-password/:token/:email"
                        element={<ResetPassword />}
                    />
                    <Route
                        path="forgot-password"
                        element={<ForgotPassword />}
                    />
                    <Route
                        path="user/*"
                        element={<AdminApp config={config} />}
                    />
                    <Route
                        path="admin/*"
                        element={<SuperAdminApp config={config} />}
                    />
                    <Route
                        path="/"
                        element={
                            <Navigate
                                replace
                                to={token ? loginUser.roles === ROLES.SUPER_ADMIN ? "/admin/dashboard" : redirectTo : "/login"}
                            />
                        }
                    />
                    <Route path="*" element={<Navigate replace to={"/"} />} />
                </Routes>
                <Toasts
                    language={
                        updatedLanguage ? updatedLanguage : selectedLanguage
                    }
                />
            </IntlProvider>
        </div>
    );
}

export default App;
