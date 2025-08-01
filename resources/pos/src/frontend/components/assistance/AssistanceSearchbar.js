import React, { useState, useRef } from "react";
import { InputGroup, FormControl, Button } from "react-bootstrap-v5";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
import { getFormattedMessage } from "../../../shared/sharedMethod";

const AssistanceSearchbar = ({
    onSearchAssistance,
    settings
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const inputRef = useRef();

    const handleSearch = (e) => {
        e.preventDefault();
        if (onSearchAssistance) {
            onSearchAssistance(searchTerm.trim());
        }
    };

    const handleClear = () => {
        setSearchTerm("");
        if (onSearchAssistance) {
            onSearchAssistance("");
        }
        inputRef.current?.focus();
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch(e);
        }
    };

    return (
        <div className="search-box me-2 mb-2 mb-sm-0">
            <form onSubmit={handleSearch}>
                <InputGroup>
                    <FormControl
                        ref={inputRef}
                        type="text"
                        placeholder={getFormattedMessage("Buscar servicios...") || "Buscar servicios..."}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="form-control"
                        style={{ minWidth: '200px' }}
                    />

                    {searchTerm && (
                        <Button
                            variant="outline-secondary"
                            onClick={handleClear}
                            type="button"
                            title="Limpiar búsqueda"
                        >
                            <FontAwesomeIcon icon={faTimes} />
                        </Button>
                    )}

                    <Button
                        variant="primary"
                        type="submit"
                        title="Buscar"
                    >
                        <FontAwesomeIcon icon={faSearch} />
                    </Button>
                </InputGroup>
            </form>
        </div>
    );
};

export default AssistanceSearchbar;
