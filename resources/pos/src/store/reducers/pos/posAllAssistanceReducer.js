
import {asistancesActionType as assistanceActionType} from "../../../constants";

export default (state = [], action) => {
    switch (action.type) {
        case assistanceActionType.POS_ALL_ASSISTANCE:
            return action.payload;
        case assistanceActionType.POS_ALL_ASSISTANCES:
            return action.payload;
        case assistanceActionType.FETCH_ASSISTANCE_CLICKABLE:
            return action.payload;
        case assistanceActionType.RESET_ASSISTANCE:
            return [];
        default:
            return state;
    }
};
