import { AppActions, ActionTypes } from './actions';
import { VotingGuide, StaticData, PollingStationInfo } from '../services/data.service';
import { LocationDetails } from '../services/here-address.service';
import { get } from 'lodash';
export interface ApplicationState {
    languages: string[];
    generalInfo: string;
    selectedLanguage: string;
    votingGuide: VotingGuide;
    staticTexts: StaticData[];
    error: string;
    pollingStations: PollingStationInfo[];
    selectedAddressDetails: LocationDetails;
}

const initialState: ApplicationState = {
    languages: [],
    votingGuide: undefined,
    staticTexts: undefined,
    error: '',
    generalInfo: '',
    selectedLanguage: 'Ro', // change to enum
    pollingStations: [],
    selectedAddressDetails: undefined
};
export function appStateReducer(state: ApplicationState = initialState, action: AppActions): ApplicationState {
    switch (action.type) {
        case ActionTypes.LOAD_DATA_DONE:
            const languageData = action.payload.data.staticTexts.find(x => x.language === state.selectedLanguage);
            if (languageData === undefined) {
                return state;
            }

            return {
                ...state,
                languages: action.payload.data.staticTexts.map(x => x.language),
                staticTexts: action.payload.data.staticTexts,
                generalInfo: languageData.generalInfo,
                votingGuide: languageData.votersGuide
            };
        case ActionTypes.CHANGE_LANGUAGE:
            const changedLanguageData = state.staticTexts.find(x => x.language === action.payload);

            if (changedLanguageData === undefined) {
                return state;
            }

            return {
                ...state,
                generalInfo: changedLanguageData.generalInfo,
                votingGuide: changedLanguageData.votersGuide,
                selectedLanguage: action.payload
            };

        case ActionTypes.LOAD_LOCATIONS_DONE:
            return {
                ...state,
                pollingStations: action.pollingStations,
                selectedAddressDetails: action.userLocation
            };

        default:
            return state;
    }
}
