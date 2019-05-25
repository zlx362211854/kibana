"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const lodash_1 = require("lodash");
const Rx = tslib_1.__importStar(require("rxjs"));
const operators_1 = require("rxjs/operators");
class UiSettingsClient {
    constructor(params) {
        this.params = params;
        this.update$ = new Rx.Subject();
        this.saved$ = new Rx.Subject();
        this.api = params.api;
        this.onUpdateError = params.onUpdateError;
        this.defaults = lodash_1.cloneDeep(params.defaults);
        this.cache = lodash_1.defaultsDeep({}, this.defaults, lodash_1.cloneDeep(params.initialSettings));
    }
    /**
     * Gets the metadata about all uiSettings, including the type, default value, and user value
     * for each key.
     */
    getAll() {
        return lodash_1.cloneDeep(this.cache);
    }
    /**
     * Gets the value for a specific uiSetting. If this setting has no user-defined value
     * then the `defaultOverride` parameter is returned (and parsed if setting is of type
     * "json" or "number). If the parameter is not defined and the key is not defined by a
     * uiSettingDefaults then an error is thrown, otherwise the default is read
     * from the uiSettingDefaults.
     */
    get(key, defaultOverride) {
        const declared = this.isDeclared(key);
        if (!declared && defaultOverride !== undefined) {
            return defaultOverride;
        }
        if (!declared) {
            throw new Error(`Unexpected \`config.get("${key}")\` call on unrecognized configuration setting "${key}".
Setting an initial value via \`config.set("${key}", value)\` before attempting to retrieve
any custom setting value for "${key}" may fix this issue.
You can use \`config.get("${key}", defaultValue)\`, which will just return
\`defaultValue\` when the key is unrecognized.`);
        }
        const type = this.cache[key].type;
        const userValue = this.cache[key].userValue;
        const defaultValue = defaultOverride !== undefined ? defaultOverride : this.cache[key].value;
        const value = userValue == null ? defaultValue : userValue;
        if (type === 'json') {
            return JSON.parse(value);
        }
        if (type === 'number') {
            return parseFloat(value);
        }
        return value;
    }
    /**
     * Gets an observable of the current value for a config key, and all updates to that config
     * key in the future. Providing a `defaultOverride` argument behaves the same as it does in #get()
     */
    get$(key, defaultOverride) {
        return Rx.concat(Rx.defer(() => Rx.of(this.get(key, defaultOverride))), this.update$.pipe(operators_1.filter(update => update.key === key), operators_1.map(() => this.get(key, defaultOverride))));
    }
    /**
     * Sets the value for a uiSetting. If the setting is not defined in the uiSettingDefaults
     * it will be stored as a custom setting. The new value will be synchronously available via
     * the `get()` method and sent to the server in the background. If the request to the
     * server fails then a toast notification will be displayed and the setting will be
     * reverted it its value before `set()` was called.
     */
    async set(key, val) {
        return await this.update(key, val);
    }
    /**
     * Removes the user-defined value for a setting, causing it to revert to the default. This
     * method behaves the same as calling `set(key, null)`, including the synchronization, custom
     * setting, and error behavior of that method.
     */
    async remove(key) {
        return await this.update(key, null);
    }
    /**
     * Returns true if the key is a "known" uiSetting, meaning it is either defined in the
     * uiSettingDefaults or was previously added as a custom setting via the `set()` method.
     */
    isDeclared(key) {
        return key in this.cache;
    }
    /**
     * Returns true if the setting has no user-defined value or is unknown
     */
    isDefault(key) {
        return !this.isDeclared(key) || this.cache[key].userValue == null;
    }
    /**
     * Returns true if the setting is not a part of the uiSettingDefaults, but was either
     * added directly via `set()`, or is an unknown setting found in the uiSettings saved
     * object
     */
    isCustom(key) {
        return this.isDeclared(key) && !('value' in this.cache[key]);
    }
    /**
     * Returns true if a settings value is overridden by the server. When a setting is overridden
     * its value can not be changed via `set()` or `remove()`.
     */
    isOverridden(key) {
        return this.isDeclared(key) && Boolean(this.cache[key].isOverridden);
    }
    /**
     * Overrides the default value for a setting in this specific browser tab. If the page
     * is reloaded the default override is lost.
     */
    overrideLocalDefault(key, newDefault) {
        // capture the previous value
        const prevDefault = this.defaults[key] ? this.defaults[key].value : undefined;
        // update defaults map
        this.defaults[key] = {
            ...(this.defaults[key] || {}),
            value: newDefault,
        };
        // update cached default value
        this.cache[key] = {
            ...(this.cache[key] || {}),
            value: newDefault,
        };
        // don't broadcast change if userValue was already overriding the default
        if (this.cache[key].userValue == null) {
            this.update$.next({ key, newValue: newDefault, oldValue: prevDefault });
            this.saved$.next({ key, newValue: newDefault, oldValue: prevDefault });
        }
    }
    /**
     * Returns an Observable that notifies subscribers of each update to the uiSettings,
     * including the key, newValue, and oldValue of the setting that changed.
     */
    getUpdate$() {
        return this.update$.asObservable();
    }
    /**
     * Returns an Observable that notifies subscribers of each update to the uiSettings,
     * including the key, newValue, and oldValue of the setting that changed.
     */
    getSaved$() {
        return this.saved$.asObservable();
    }
    /**
     * Prepares the uiSettingsClient to be discarded, completing any update$ observables
     * that have been created.
     */
    stop() {
        this.update$.complete();
        this.saved$.complete();
    }
    assertUpdateAllowed(key) {
        if (this.isOverridden(key)) {
            throw new Error(`Unable to update "${key}" because its value is overridden by the Kibana server`);
        }
    }
    async update(key, newVal) {
        this.assertUpdateAllowed(key);
        const declared = this.isDeclared(key);
        const defaults = this.defaults;
        const oldVal = declared ? this.cache[key].userValue : undefined;
        const unchanged = oldVal === newVal;
        if (unchanged) {
            return true;
        }
        const initialVal = declared ? this.get(key) : undefined;
        this.setLocally(key, newVal);
        try {
            const { settings } = await this.api.batchSet(key, newVal);
            this.cache = lodash_1.defaultsDeep({}, defaults, settings);
            this.saved$.next({ key, newValue: newVal, oldValue: initialVal });
            return true;
        }
        catch (error) {
            this.setLocally(key, initialVal);
            this.onUpdateError(error);
            return false;
        }
    }
    setLocally(key, newValue) {
        this.assertUpdateAllowed(key);
        if (!this.isDeclared(key)) {
            this.cache[key] = {};
        }
        const oldValue = this.get(key);
        if (newValue === null) {
            delete this.cache[key].userValue;
        }
        else {
            const { type } = this.cache[key];
            if (type === 'json' && typeof newValue !== 'string') {
                this.cache[key].userValue = JSON.stringify(newValue);
            }
            else {
                this.cache[key].userValue = newValue;
            }
        }
        this.update$.next({ key, newValue, oldValue });
    }
}
exports.UiSettingsClient = UiSettingsClient;
