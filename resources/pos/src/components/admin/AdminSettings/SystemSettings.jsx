import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import ImagePicker from "../../../shared/image-picker/ImagePicker";
import {
    getFormattedMessage,
    placeholderText
} from "../../../shared/sharedMethod";
import { fetchAdminSettings, updateAdminSettings } from "../../../store/action/admin/adminSettingsAction";
import { fetchCurrencies } from "../../../store/action/currencyAction";
import ReactSelect from "../../../shared/select/reactSelect";
import NoImage from '../../../assets/images/brand_logo.png';

const SystemSettings = ({ fetchAdminSettings, adminSetting, updateAdminSettings, fetchCurrencies, currencies }) => {
    const [settingValue, setSettingValue] = useState({
        logo: null,
        favicon: null,
        app_name: "",
        footer: "",
        show_version_on_footer: false,
        show_app_name_in_sidebar: false,
        currency: "",
        send_registration_mail: true,
        show_landing_page: "1"
    });
    const [errors, setErrors] = useState({
        app_name: "",
    });
    const [logoPreview, setLogoPreview] = useState(NoImage);
    const [faviconPreview, setFaviconPreview] = useState(null);
    const [disable, setDisable] = useState(true);
    const [logoFile, setLogoFile] = useState(null);
    const [faviconFile, setFaviconFile] = useState(null);

    useEffect(() => {
        fetchCurrencies();
        fetchAdminSettings();
    }, []);

    useEffect(() => {
        if (adminSetting) {
            setSettingValue({
                logo: adminSetting?.attributes?.app_logo,
                favicon: adminSetting?.attributes?.app_favicon,
                app_name: adminSetting?.attributes?.app_name,
                footer: adminSetting?.attributes?.footer ?? "",
                currency: { value: Number(adminSetting?.attributes?.admin_default_currency), label: adminSetting?.attributes?.admin_default_currency_symbol },
                show_version_on_footer: adminSetting?.attributes?.show_version_on_footer == "true" || adminSetting?.attributes?.show_version_on_footer == "1" ? true : false,
                show_app_name_in_sidebar: adminSetting?.attributes?.show_app_name_in_sidebar == "true" || adminSetting?.attributes?.show_app_name_in_sidebar == "1" ? true : false,
                send_registration_mail: adminSetting?.attributes?.send_registration_mail == "true" || adminSetting?.attributes?.send_registration_mail == "1" ? true : false,
                show_landing_page: adminSetting?.attributes?.show_landing_page == "true" || adminSetting?.attributes?.show_landing_page == "1" ? "1" : "0",
            });
            setLogoPreview(adminSetting?.attributes?.app_logo ?? NoImage);
            setFaviconPreview(adminSetting?.attributes?.app_favicon ?? NoImage);
        }
    }, [adminSetting]);

    useEffect(() => {
        const originalSettings = {
            logo: adminSetting?.attributes?.app_logo,
            favicon: adminSetting?.attributes?.app_favicon,
            app_name: adminSetting?.attributes?.app_name,
            footer: adminSetting?.attributes?.footer,
            show_version_on_footer: adminSetting?.attributes?.show_version_on_footer === "true" ? true : false,
            show_app_name_in_sidebar: adminSetting?.attributes?.show_app_name_in_sidebar === "true" ? true : false,
            currency: Number(adminSetting?.attributes?.admin_default_currency),
            send_registration_mail: adminSetting?.attributes?.send_registration_mail === "true" ? true : false,
            show_landing_page: adminSetting?.attributes?.show_landing_page === "1" ? "1" : "0",
        };

        const isUnchanged =
            settingValue.logo === originalSettings.logo &&
            settingValue.favicon === originalSettings.favicon &&
            settingValue.app_name === originalSettings.app_name &&
            settingValue.footer === originalSettings.footer &&
            settingValue.show_version_on_footer === originalSettings.show_version_on_footer &&
            settingValue.show_app_name_in_sidebar === originalSettings.show_app_name_in_sidebar &&
            settingValue.currency?.value === Number(adminSetting?.attributes?.admin_default_currency) &&
            settingValue.send_registration_mail === originalSettings.send_registration_mail &&
            settingValue.show_landing_page === originalSettings.show_landing_page;

        setDisable(isUnchanged);
    }, [settingValue, adminSetting]);

    const onCurrencyChange = (obj) => {
        setSettingValue((settingValue) => ({ ...settingValue, currency: obj }));
    };

    const handleChanged = (event, checkboxType) => {
        let checked = event.target.checked;
        setDisable(false);
        if (checkboxType === "version") {
            setSettingValue((settingValue) => ({
                ...settingValue,
                show_version_on_footer: checked,
            }));
        } else if (checkboxType === "logo") {
            setSettingValue((settingValue) => ({
                ...settingValue,
                show_logo_in_receipt: checked,
            }));
        } else if (checkboxType === "appname") {
            setSettingValue((settingValue) => ({
                ...settingValue,
                show_app_name_in_sidebar: checked,
            }));
        }
    };

    const handleImageChange = (e, type) => {
        e.preventDefault();
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            if (["image/jpeg", "image/png", "image/svg+xml"].includes(file.type)) {
                const fileReader = new FileReader();
                fileReader.onloadend = () => {
                    if (type === "logo") {
                        setLogoPreview(fileReader.result);
                        setLogoFile(file);
                        setSettingValue(prevState => ({
                            ...prevState,
                            logo: fileReader.result,
                        }));
                    } else {
                        setFaviconPreview(fileReader.result);
                        setFaviconFile(file);
                        setSettingValue(prevState => ({
                            ...prevState,
                            favicon: fileReader.result,
                        }));
                    }
                };
                fileReader.readAsDataURL(file);
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSettingValue(prevState => ({
            ...prevState,
            [name]: value,
        }));

    };

    const prepareFormData = (data) => {
        const formData = new FormData();
        if (logoFile) {
            formData.append("app_logo", logoFile);
        }
        if (faviconFile) {
            formData.append("app_favicon", faviconFile);
        }
        formData.append("app_name", data.app_name);
        formData.append("show_version_on_footer", data.show_version_on_footer);
        formData.append("show_app_name_in_sidebar", data.show_app_name_in_sidebar);
        formData.append("admin_default_currency_symbol", data.currency.label);
        formData.append("admin_default_currency", data.currency.value);
        formData.append("footer", data.footer);
        formData.append("send_registration_mail", data.send_registration_mail);
        formData.append("show_landing_page", data.show_landing_page);
        return formData;
    };

    const handleValidation = () => {
        let errorss = {};
        let isValid = false;
        if (!settingValue["app_name"]) {
            errorss["app_name"] = getFormattedMessage(
                "settings.system-settings.input.app-name.validate.label"
            );
        } else {
            isValid = true;
        }
        setErrors(errorss);
        return isValid;
    };


    const onEdit = (event) => {
        event.preventDefault();
        const valid = handleValidation();
        if (valid) {
            updateAdminSettings(prepareFormData(settingValue));
        }
    };

    return (
        <form onSubmit={onEdit}>
            <div className="d-flex align-items-center gap-3 gap-sm-1">
                <div className="col-lg-2 mb-3">
                    <ImagePicker
                        imageTitle={placeholderText("globally.input.app-logo.tooltip")}
                        imagePreviewUrl={logoPreview}
                        handleImageChange={(e) => handleImageChange(e, "logo")}
                    />
                </div>
                <div className="col-lg-2 mb-3">
                    <ImagePicker
                        imageTitle={placeholderText("globally.input.favicon.tooltip")}
                        imagePreviewUrl={faviconPreview}
                        handleImageChange={(e) => handleImageChange(e, "favicon")}
                    />
                </div>
            </div>
            <div className="row">
                <div className="col-lg-6 mb-3">
                    <label className="form-label">
                        {getFormattedMessage("settings.system-settings.input.app-name.label")}:<span className="required" />
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder={placeholderText("settings.system-settings.input.app-name.placeholder.label")}
                        name="app_name"
                        value={settingValue.app_name || ''}
                        onChange={handleInputChange}
                    />
                    {errors.app_name && (
                        <span className="text-danger d-block fw-400 fs-small mt-2">
                            {errors.app_name}
                        </span>
                    )}
                </div>

                <div className="col-lg-6 mb-3">
                    <label className="form-label">
                        {getFormattedMessage(
                            "settings.system-settings.input.footer.label"
                        )}
                        :
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder={placeholderText(
                            "settings.system-settings.input.footer.placeholder.label"
                        )}
                        name="footer"
                        value={settingValue.footer}
                        onChange={handleInputChange}
                    />
                    <span className="text-danger d-block fw-400 fs-small mt-2">
                        {errors["footer"]
                            ? errors["footer"]
                            : null}
                    </span>
                </div>
                <div className="col-lg-6 mb-3">
                    <ReactSelect
                        title={getFormattedMessage(
                            "settings.system-settings.select.default-currency.label"
                        )}
                        placeholder={placeholderText(
                            "settings.system-settings.select.default-currency.placeholder.label"
                        )}
                        value={settingValue.currency}
                        data={currencies}
                        onChange={onCurrencyChange}
                    />
                </div>
                <div className="col-lg-6 mb-3">
                    <div className="col-md-12">
                        <label className="form-check form-check-custom form-check-solid form-check-inline d-flex align-items-center my-3 cursor-pointer custom-label">
                            <input
                                type="checkbox"
                                name="show_version_on_footer"
                                value={settingValue.show_version_on_footer}
                                checked={settingValue.show_version_on_footer}
                                onChange={(event) =>
                                    handleChanged(
                                        event,
                                        "version"
                                    )
                                }
                                className="me-3 form-check-input cursor-pointer"
                            />
                            <div className="control__indicator" />{" "}
                            {getFormattedMessage(
                                "settings.system-settings.select.default-version-footer.placeholder.label"
                            )}
                        </label>
                    </div>
                    <div className="col-md-12">
                        <label className="form-check form-check-custom form-check-solid form-check-inline d-flex align-items-center my-3 cursor-pointer custom-label">
                            <input
                                type="checkbox"
                                name="show_app_name_in_sidebar"
                                value={settingValue.show_app_name_in_sidebar}
                                checked={settingValue.show_app_name_in_sidebar}
                                onChange={(event) =>
                                    handleChanged(
                                        event,
                                        "appname"
                                    )
                                }
                                className="me-3 form-check-input cursor-pointer"
                            />
                            <div className="control__indicator" />{" "}
                            {getFormattedMessage(
                                "settings.system-settings.select.appname-sidebar.placeholder.label"
                            )}
                        </label>
                    </div>
                </div>
                <div className="col-lg-6 mb-3">
                    <label className="form-label">
                        {getFormattedMessage(
                            "send.registration.mail.title"
                        )}
                        :
                    </label>
                    <div className="form-check form-switch">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            name="send_registration_mail"
                            checked={settingValue.send_registration_mail}
                            onChange={(e) => {
                                setSettingValue(prev => ({
                                    ...prev,
                                    send_registration_mail: e.target.checked
                                }));
                                setDisable(false);
                            }}
                        />
                        <label className="form-check-label">
                            {getFormattedMessage(
                                "send.registration.mail.title"
                            )}
                        </label>
                    </div>
                </div>
                <div className="col-lg-6 mb-3">
                    <label className="form-label">
                        {getFormattedMessage(
                            "enable.landing.page.title"
                        )}
                        :
                    </label>
                    <div className="form-check form-switch">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            name="show_landing_page"
                            checked={settingValue.show_landing_page === "1"}
                            onChange={(e) => {
                                setSettingValue(prev => ({
                                    ...prev,
                                    show_landing_page: e.target.checked ? "1" : "0"
                                }));
                                setDisable(false);
                            }}
                        />
                        <label className="form-check-label">
                            {getFormattedMessage(
                                "enable.landing.page.title"
                            )}
                        </label>
                    </div>
                </div>
            </div>
            <div>
                <button
                    disabled={disable}
                    className="btn btn-primary mt-4"
                    type="submit"
                >
                    {getFormattedMessage("globally.save-btn")}
                </button>
            </div>
        </form>
    );
};

const mapStateToProps = (state) => ({
    adminSetting: state.adminSetting,
    currencies: state.currencies
});

export default connect(mapStateToProps, { fetchAdminSettings, updateAdminSettings, fetchCurrencies })(SystemSettings);
