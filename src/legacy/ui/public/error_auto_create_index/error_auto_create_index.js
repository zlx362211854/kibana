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
const i18n_1 = require("@kbn/i18n");
const lodash_1 = require("lodash");
const routes_1 = tslib_1.__importDefault(require("../routes"));
const error_auto_create_index_html_1 = tslib_1.__importDefault(require("./error_auto_create_index.html"));
routes_1.default.when('/error/action.auto_create_index', {
    template: error_auto_create_index_html_1.default,
    k7Breadcrumbs: () => [
        {
            text: i18n_1.i18n.translate('common.ui.errorAutoCreateIndex.breadcrumbs.errorText', {
                defaultMessage: 'Error',
            }),
        },
    ],
});
function isAutoCreateIndexError(error) {
    return (lodash_1.get(error, 'res.status') === 503 && lodash_1.get(error, 'body.code') === 'ES_AUTO_CREATE_INDEX_ERROR');
}
exports.isAutoCreateIndexError = isAutoCreateIndexError;
function showAutoCreateIndexErrorPage() {
    window.location.hash = '/error/action.auto_create_index';
}
exports.showAutoCreateIndexErrorPage = showAutoCreateIndexErrorPage;
