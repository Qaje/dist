import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { fetchAssistanceCategories } from "../../../store/action/assistanceCategoryAction";
import { getFormattedMessage } from "../../../shared/sharedMethod";

const AssistanceCategory = (props) => {
    const {
        fetchAssistanceCategories,
        assistanceCategories,
        setAssistanceCategory,
        selectedOption,
    } = props;
    const [assistanceCategoryId, setAssistanceCategoryId] = useState(null);

    useEffect(() => {
        if (selectedOption) {
            fetchAssistanceCategories();
        }
    }, [selectedOption]);

    const onAssistanceCategoryClick = (assistanceCategory) => {
        if (assistanceCategoryId === assistanceCategory.id) {
            setAssistanceCategoryId(null);
            setAssistanceCategory(null);
        } else {
            setAssistanceCategoryId(assistanceCategory.id);
            setAssistanceCategory(assistanceCategory.id);
        }
    };

    return (
        <div className="d-flex flex-wrap justify-content-start assistance-category-block pb-3">
            <button
                className={`btn btn-outline-primary me-2 mb-2 ${
                    !assistanceCategoryId ? "active" : ""
                }`}
                onClick={() => onAssistanceCategoryClick({ id: null })}
            >
                {getFormattedMessage("pos.all-assistances.title")}
            </button>
            {assistanceCategories &&
                assistanceCategories.length > 0 &&
                assistanceCategories.map((assistanceCategory) => {
                    return (
                        <button
                            className={`btn btn-outline-primary me-2 mb-2 ${
                                assistanceCategoryId === assistanceCategory.id
                                    ? "active"
                                    : ""
                            }`}
                            key={assistanceCategory.id}
                            onClick={() => onAssistanceCategoryClick(assistanceCategory)}
                        >
                            {assistanceCategory.attributes.name}
                        </button>
                    );
                })}
        </div>
    );
};

const mapStateToProps = (state) => {
    const { assistanceCategories } = state;
    return { assistanceCategories };
};

export default connect(mapStateToProps, { fetchAssistanceCategories })(
    AssistanceCategory
);
