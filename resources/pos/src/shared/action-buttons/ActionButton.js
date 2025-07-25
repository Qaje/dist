import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faEye,
    faPenToSquare,
    faTrash,
} from "@fortawesome/free-solid-svg-icons";
import {
    getFormattedMessage,
    getFormattedOptions,
    placeholderText,
} from "../sharedMethod";
import {
    cashPaymentStatusMethodOptions,
    PLAN_STATUS,
} from "../../constants";
import ReactSelect from "../select/reactSelect";

const ActionButton = (props) => {
    const {
        goToEditProduct,
        item,
        onClickDeleteModel = true,
        isDeleteMode = true,
        isEditMode = true,
        goToDetailScreen,
        isViewIcon = false,
        onStatusChange,
        isActionDropDown = false,
        isCustomWidth = false
    } = props;
    const cashPaymentStatusMethodOption = getFormattedOptions(
        cashPaymentStatusMethodOptions
    );
    const cashPaymentStatusMethodOptionValue =
        cashPaymentStatusMethodOption?.map((option) => {
            return {
                value: option.id,
                label: option.name,
            };
        });

    return (
        <>
            {isViewIcon ? (
                <button
                    title={placeholderText("globally.view.tooltip.label")}
                    className="btn text-success px-2 fs-3 ps-0 border-0"
                    onClick={(e) => {
                        e.stopPropagation();
                        goToDetailScreen(item.id);
                    }}
                >
                    <FontAwesomeIcon icon={faEye} />
                </button>
            ) : null}
            {item.name === "admin" ||
            isEditMode === false ? null : (
                <button
                    title={placeholderText("globally.edit-btn")}
                    className="btn text-primary fs-3 border-0 px-xxl-2 px-1"
                    onClick={(e) => {
                        e.stopPropagation();
                        goToEditProduct(item);
                    }}
                >
                    <FontAwesomeIcon icon={faPenToSquare} />
                </button>
            )}
            {item.name === "admin" ||
            isDeleteMode === false ? null : (
                <button
                    title={placeholderText("globally.delete.tooltip.label")}
                    className="btn px-2 pe-0 text-danger fs-3 border-0"
                    onClick={(e) => {
                        e.stopPropagation();
                        onClickDeleteModel(item);
                    }}
                >
                    <FontAwesomeIcon icon={faTrash} />
                </button>
            )}
            {isActionDropDown ? (
                item.status === PLAN_STATUS.ACTIVE ? (
                    <span className="badge bg-light-success">
                        <div>
                            {getFormattedMessage("globally.approved.label")}
                        </div>
                    </span>
                ) : item.status === PLAN_STATUS.REJECTED ? (
                    <span className="badge bg-light-danger">
                        <div>
                            {getFormattedMessage("rejected.title")}
                        </div>
                    </span>
                ) : item.status === PLAN_STATUS.INACTIVE ? (
                    <span className="badge bg-light-warning">
                        <div>
                            {getFormattedMessage("in-active.status.lable")}
                        </div>
                    </span>
                ) : (
                    <div style={{ width: isCustomWidth ? "" : "width: 117px" }}>
                        <ReactSelect
                            isCustomWidth={isCustomWidth}
                            isRequired
                            defaultValue={cashPaymentStatusMethodOptionValue[0]}
                            multiLanguageOption={cashPaymentStatusMethodOption}
                            onChange={(e) => onStatusChange(e.value, item?.id)}
                        />
                    </div>
                )
            ) : null}
        </>
    );
};
export default ActionButton;
