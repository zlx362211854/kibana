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
const react_1 = tslib_1.__importDefault(require("react"));
const react_dom_1 = require("react-dom");
const Rx = tslib_1.__importStar(require("rxjs"));
const operators_1 = require("rxjs/operators");
const fatal_errors_screen_1 = require("./fatal_errors_screen");
const get_error_info_1 = require("./get_error_info");
class FatalErrorsService {
    constructor(params) {
        this.params = params;
        this.errorInfo$ = new Rx.ReplaySubject();
        this.add = (error, source) => {
            const errorInfo = get_error_info_1.getErrorInfo(error, source);
            this.errorInfo$.next(errorInfo);
            if (error instanceof Error) {
                // make stack traces clickable by putting whole error in the console
                // tslint:disable-next-line no-console
                console.error(error);
            }
            throw error;
        };
        this.errorInfo$
            .pipe(operators_1.first(), operators_1.tap(() => this.onFirstError()))
            .subscribe({
            error: error => {
                // tslint:disable-next-line no-console
                console.error('Uncaught error in fatal error screen internals', error);
            },
        });
    }
    start({ i18n }) {
        this.i18n = i18n;
        return {
            add: this.add,
            get$: () => {
                return this.errorInfo$.asObservable();
            },
        };
    }
    onFirstError() {
        // stop the core systems so that things like the legacy platform are stopped
        // and angular/react components are unmounted;
        this.params.stopCoreSystem();
        // delete all content in the rootDomElement
        this.params.rootDomElement.textContent = '';
        // create and mount a container for the <FatalErrorScreen>
        const container = document.createElement('div');
        this.params.rootDomElement.appendChild(container);
        // If error occurred before I18nService has been started we don't have any
        // i18n context to provide.
        const I18nContext = this.i18n ? this.i18n.Context : react_1.default.Fragment;
        react_dom_1.render(react_1.default.createElement(I18nContext, null,
            react_1.default.createElement(fatal_errors_screen_1.FatalErrorsScreen, { buildNumber: this.params.injectedMetadata.getKibanaBuildNumber(), kibanaVersion: this.params.injectedMetadata.getKibanaVersion(), "errorInfo$": this.errorInfo$ })), container);
    }
}
exports.FatalErrorsService = FatalErrorsService;
