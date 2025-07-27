import React, { useState, useEffect } from "react";
import { InputGroup, Form } from "react-bootstrap-v5";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { getFormattedMessage } from "../../../shared/sharedMethod";

const AssistanceSearchbar = (props) => {
    const {
        customCart,
        setUpdateProducts,
        updateProducts,
        selectedOption,
        onSearchAssistance,
        settings,
    } = props;
    const [searchValue, setSearchValue] = useState("");

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchValue.trim()) {
                onSearchAssistance(searchValue);
            } else {
                onSearchAssistance("");
            }
        }, 500); // Debounce search

        return () => clearTimeout(timeoutId);
    }, [searchValue, onSearchAssistance]);

    const onChangeAssistanceSearch = (e) => {
        setSearchValue(e.target.value);
    };

    const clearSearch = () => {
        setSearchValue("");
        onSearchAssistance("");
    };

    return (
        <div className="assistance-search-block me-3 w-100">
            <InputGroup className="flex-nowrap">
                <InputGroup.Text id="addon-wrapping">
                    <FontAwesomeIcon icon={faSearch} />
                </InputGroup.Text>
                <Form.Control
                    placeholder={getFormattedMessage("pos.search-assistance.title")}
                    aria-label="Search Assistance"
                    aria-describedby="addon-wrapping"
                    value={searchValue}
                    onChange={onChangeAssistanceSearch}
                />
                {searchValue && (
                    <InputGroup.Text
                        id="clear-search"
                        style={{ cursor: 'pointer' }}
                        onClick={clearSearch}
                    >
                        ×
                    </InputGroup.Text>
                )}
            </InputGroup>
        </div>
    );
};

export default AssistanceSearchbar;
