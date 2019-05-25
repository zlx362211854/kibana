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

import { i18n }  from '@kbn/i18n';
import { TUTORIAL_CATEGORY } from '../../../common/tutorials/tutorial_category';
import { onPremInstructions, cloudInstructions, onPremCloudInstructions } from '../../../common/tutorials/metricbeat_instructions';

export function awsMetricsSpecProvider(server, context) {
  const moduleName = 'aws';
  return {
    id: 'awsMetrics',
    name: i18n.translate('kbn.server.tutorials.awsMetrics.nameTitle', {
      defaultMessage: 'AWS 指标',
    }),
    category: TUTORIAL_CATEGORY.METRICS,
    shortDescription: i18n.translate('kbn.server.tutorials.awsMetrics.shortDescription', {
      defaultMessage: '从AWS API和Cloudwatch获取EC2实例的监控指标。',
    }),
    longDescription: i18n.translate('kbn.server.tutorials.awsMetrics.longDescription', {
      defaultMessage: '`aws` Metricbeat模块从AWS API和Cloudwatch获取监控指标。 \
[了解详情]({learnMoreLink}).',
      values: {
        learnMoreLink: '{config.docs.beats.metricbeat}/metricbeat-module-aws.html',
      },
    }),
    euiIconType: 'logoAWS',
    isBeta: false,
    artifacts: {
      dashboards: [
        {
          id: 'c5846400-f7fb-11e8-af03-c999c9dea608-ecs',
          linkLabel: i18n.translate('kbn.server.tutorials.awsMetrics.artifacts.dashboards.linkLabel', {
            defaultMessage: 'AWS 指标仪表盘',
          }),
          isOverview: true
        }
      ],
      exportedFields: {
        documentationUrl: '{config.docs.beats.metricbeat}/exported-fields-aws.html'
      }
    },
    completionTimeMinutes: 10,
    previewImagePath: '/plugins/kibana/home/tutorial_resources/aws_metrics/screenshot.png',
    onPrem: onPremInstructions(moduleName, null, null, null, context),
    elasticCloud: cloudInstructions(moduleName),
    onPremElasticCloud: onPremCloudInstructions(moduleName)
  };
}
