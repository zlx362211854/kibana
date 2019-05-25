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
const Rx = tslib_1.__importStar(require("rxjs"));
const operators_1 = require("rxjs/operators");
class LoadingCountService {
    constructor() {
        this.total$ = new Rx.BehaviorSubject(0);
        this.stop$ = new Rx.Subject();
    }
    start({ fatalErrors }) {
        return {
            add: (count$) => {
                count$
                    .pipe(operators_1.distinctUntilChanged(), operators_1.tap(count => {
                    if (count < 0) {
                        throw new Error('Observables passed to loadingCount.add() must only emit positive numbers');
                    }
                }), 
                // use takeUntil() so that we can finish each stream on stop() the same way we do when they complete,
                // by removing the previous count from the total
                operators_1.takeUntil(this.stop$), operators_1.endWith(0), operators_1.startWith(0), operators_1.pairwise(), operators_1.map(([prev, next]) => next - prev))
                    .subscribe({
                    next: delta => {
                        this.total$.next(this.total$.getValue() + delta);
                    },
                    error: error => {
                        fatalErrors.add(error);
                    },
                });
            },
            getCount$: () => {
                return this.total$.pipe(operators_1.distinctUntilChanged());
            },
        };
    }
    stop() {
        this.stop$.next();
        this.total$.complete();
    }
}
exports.LoadingCountService = LoadingCountService;
