import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Image } from "react-bootstrap-v5";
import * as EmailValidator from "email-validator";
import { loginAction } from "../../store/action/authAction";
import TabTitle from "../../shared/tab-title/TabTitle";
import { ROLES } from "../../constants";
import { createBrowserHistory } from "history";
import {
    getFormattedMessage,
    placeholderText,
} from "../../shared/sharedMethod";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Cookies from "js-cookie";
import { fetchLanguages } from "../../store/action/languageAction";
import LanguageLayout from "./LanguageLayout";
import { fetchFrontCms } from "../../store/action/frontCmsAction";

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const history = createBrowserHistory();
    const { loginUser, frontCms } = useSelector((state) => state);
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false);
    const token = Cookies.get("authToken");

    const [loginInputs, setLoginInputs] = useState({
        email: "",
        password: "",
    });
    useEffect(() => {
        dispatch(fetchFrontCms());
        dispatch(fetchLanguages());
        if (token) {
            if (loginUser.roles === ROLES.SUPER_ADMIN) {
                window.location.href = "/app/#/admin/dashboard"
            } else {
                window.location.href = "/app/#/user/dashboard";
            }
        }
    }, []);

    const [errors, setErrors] = useState({
        email: "",
        password: "",
    });

    const handleValidation = () => {
        let errorss = {};
        let isValid = false;
        if (!EmailValidator.validate(loginInputs["email"])) {
            if (!loginInputs["email"]) {
                errorss["email"] = getFormattedMessage(
                    "globally.input.email.validate.label"
                );
            } else {
                errorss["email"] = getFormattedMessage(
                    "globally.input.email.valid.validate.label"
                );
            }
        } else if (!loginInputs["password"]) {
            errorss["password"] = getFormattedMessage(
                "user.input.password.validate.label"
            );
        } else {
            isValid = true;
        }
        setErrors(errorss);
        setLoading(false);
        return isValid;
    };

    const prepareFormData = () => {
        const formData = new FormData();
        formData.append("email", loginInputs.email);
        formData.append("password", loginInputs.password);
        formData.append(
            "language_code",
            localStorage.getItem("updated_language")
        );
        return formData;
    };

    const onLogin = async (e) => {
        e.preventDefault();
        const valid = handleValidation();
        if (valid) {
            setLoading(true);
            dispatch(
                loginAction(prepareFormData(loginInputs), navigate, setLoading)
            );
            const dataBlank = {
                email: "",
                password: "",
            };
            setLoginInputs(dataBlank);
        }
    };

    const handleChange = (e) => {
        e.persist();
        setLoginInputs((inputs) => ({
            ...inputs,
            [e.target.name]: e.target.value,
        }));
        setErrors("");
    };

    const handleHideShowPassword = (e) => {
        setShowPassword(!showPassword);
    }

    return (
        <div className="content d-flex flex-column flex-column-fluid position-relative" style={{ backgroundImage: "url(/assets/images/asked-bg.png)" }}>
            <LanguageLayout/>
            <div className="content d-flex flex-column flex-column-fluid">
                <div className="d-flex flex-wrap flex-column-fluid">
                    <div className="d-flex flex-column flex-column-fluid align-items-center justify-content-center p-4 margin-top">
                        <TabTitle
                            title={placeholderText("login-form.login-btn.label")}
                        />
                        <div className="col-12 text-center align-items-center justify-content-center ">
                            <a href="/" className="image mb-7 mb-sm-10">
                                <Image
                                    className="logo-height image"
                                    src={
                                        frontCms &&
                                        frontCms.value &&
                                        frontCms.value.app_logo
                                    }
                                    height={60}
                                    style={{ objectFit: "contain" }}
                                />
                            </a>
                        </div>
                        <div className="bg-theme-white rounded-15 shadow-md width-540 px-5 px-sm-7 py-10 mx-auto">
                            <h1 className="text-dark text-center mb-7">
                                {getFormattedMessage("login-form.title")}
                            </h1>
                            <form>
                                <div className="mb-sm-7 mb-4">
                                    <label className="form-label">
                                        {getFormattedMessage(
                                            "globally.input.email.label"
                                        )}{" "}
                                        :
                                    </label>
                                    <span className="required" />
                                    <input
                                        placeholder={placeholderText(
                                            "globally.input.email.placeholder.label"
                                        )}
                                        required
                                        value={loginInputs.email}
                                        className="form-control"
                                        type="text"
                                        name="email"
                                        autoComplete="off"
                                        onChange={(e) => handleChange(e)}
                                    />
                                    <span className="text-danger d-block fw-400 fs-small mt-2">
                                        {errors["email"] ? errors["email"] : null}
                                    </span>
                                </div>

                                <div className="mb-sm-7 mb-4">
                                    <div className="d-flex justify-content-between mt-n5">
                                        <div className="d-flex justify-content-between w-100">
                                            <label className="form-label">
                                                {getFormattedMessage(
                                                    "user.input.password.label"
                                                )}
                                                :
                                                <span className="required" />
                                            </label>
                                            <Link
                                                to="/forgot-password"
                                                className="link-info fs-6 text-decoration-none text-purple"
                                            >
                                                {getFormattedMessage(
                                                    "login-form.forgot-password.label"
                                                )}
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="input-group">
                                        <input
                                            className="form-control"
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            placeholder={placeholderText(
                                                "user.input.password.placeholder.label"
                                            )}
                                            autoComplete="off"
                                            required
                                            value={loginInputs.password}
                                            onChange={(e) => handleChange(e)}
                                        />
                                        <span className="showpassword" onClick={handleHideShowPassword}>
                                            <FontAwesomeIcon
                                                icon={showPassword ? faEye : faEyeSlash}
                                                className="top-0 m-0 fa"
                                            />
                                        </span>
                                    </div>
                                    <span className="text-danger d-block fw-400 fs-small mt-2">
                                        {errors["password"]
                                            ? errors["password"]
                                            : null}
                                    </span>
                                </div>
                                <div className="text-center">
                                    <button
                                        type="submit"
                                        className="btn btn-purple w-100"
                                        onClick={(e) => onLogin(e)}
                                    >
                                        {loading ? (
                                            <span className="d-block">
                                                {getFormattedMessage(
                                                    "globally.loading.label"
                                                )}
                                            </span>
                                        ) : (
                                            <span>
                                                {getFormattedMessage(
                                                    "login-form.login-btn.label"
                                                )}
                                            </span>
                                        )}
                                    </button>
                                </div>

                                <div className='mt-3'>
                                    <span>{getFormattedMessage(
                                        "not.registered.label"
                                    )} <Link
                                        to="/register" className="text-purple">
                                            {getFormattedMessage("register.here.label")}
                                        </Link>
                                    </span>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
