"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const datemath_1 = tslib_1.__importDefault(require("@elastic/datemath"));
const eui_1 = require("@elastic/eui");
// @ts-ignore
const react_1 = tslib_1.__importDefault(require("react"));
const react_redux_1 = require("react-redux");
const react_router_dom_1 = require("react-router-dom");
const urlParams_1 = require("x-pack/plugins/apm/public/store/urlParams");
const url_helpers_1 = require("../Links/url_helpers");
class DatePickerComponent extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.refreshTimeoutId = 0;
        this.getParamsFromSearch = (search) => {
            const { rangeFrom, rangeTo, refreshPaused, refreshInterval } = {
                ...urlParams_1.TIMEPICKER_DEFAULTS,
                ...url_helpers_1.toQuery(search)
            };
            return {
                rangeFrom,
                rangeTo,
                refreshPaused: urlParams_1.toBoolean(refreshPaused),
                refreshInterval: urlParams_1.toNumber(refreshInterval)
            };
        };
        this.refresh = () => {
            const { refreshPaused, refreshInterval } = this.getParamsFromSearch(this.props.location.search);
            this.clearRefreshTimeout();
            if (refreshPaused) {
                return;
            }
            this.dispatchTimeRangeUpdate();
            this.refreshTimeoutId = window.setTimeout(this.refresh, refreshInterval);
        };
        this.restartRefreshCycle = () => {
            this.clearRefreshTimeout();
            const { refreshInterval, refreshPaused } = this.getParamsFromSearch(this.props.location.search);
            if (refreshPaused) {
                return;
            }
            this.refreshTimeoutId = window.setTimeout(this.refresh, refreshInterval);
        };
        this.handleRefreshChange = ({ isPaused, refreshInterval }) => {
            this.updateUrl({
                refreshPaused: isPaused,
                refreshInterval
            });
        };
        this.handleTimeChange = options => {
            this.updateUrl({ rangeFrom: options.start, rangeTo: options.end });
        };
    }
    componentDidMount() {
        this.dispatchTimeRangeUpdate();
        this.restartRefreshCycle();
    }
    componentWillUnmount() {
        this.clearRefreshTimeout();
    }
    componentDidUpdate(prevProps) {
        const currentParams = this.getParamsFromSearch(this.props.location.search);
        const previousParams = this.getParamsFromSearch(prevProps.location.search);
        this.dispatchTimeRangeUpdate();
        if (currentParams.refreshPaused !== previousParams.refreshPaused ||
            currentParams.refreshInterval !== previousParams.refreshInterval) {
            this.restartRefreshCycle();
        }
    }
    dispatchTimeRangeUpdate() {
        const { rangeFrom, rangeTo } = this.getParamsFromSearch(this.props.location.search);
        const parsed = {
            from: datemath_1.default.parse(rangeFrom),
            // roundUp: true is required for the quick select relative date values to work properly
            to: datemath_1.default.parse(rangeTo, { roundUp: true })
        };
        if (!parsed.from || !parsed.to) {
            return;
        }
        const min = parsed.from.toISOString();
        const max = parsed.to.toISOString();
        this.props.dispatchUpdateTimePicker({ min, max });
    }
    clearRefreshTimeout() {
        if (this.refreshTimeoutId) {
            window.clearTimeout(this.refreshTimeoutId);
        }
    }
    updateUrl(nextSearch) {
        const currentSearch = url_helpers_1.toQuery(this.props.location.search);
        this.props.history.push({
            ...this.props.location,
            search: url_helpers_1.fromQuery({
                ...currentSearch,
                ...nextSearch
            })
        });
    }
    render() {
        const { rangeFrom, rangeTo, refreshPaused, refreshInterval } = this.getParamsFromSearch(this.props.location.search);
        return (react_1.default.createElement(eui_1.EuiSuperDatePicker, { start: rangeFrom, end: rangeTo, isPaused: refreshPaused, refreshInterval: refreshInterval, onTimeChange: this.handleTimeChange, onRefreshChange: this.handleRefreshChange, showUpdateButton: true }));
    }
}
const DatePicker = react_router_dom_1.withRouter(react_redux_1.connect(null, { dispatchUpdateTimePicker: urlParams_1.updateTimePicker })(DatePickerComponent));
exports.DatePicker = DatePicker;