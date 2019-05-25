/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  EuiFieldText,
  EuiFieldNumber,
  EuiBadge,
  EuiButtonIcon,
  EuiFormRow,
  EuiFlexGroup,
  EuiFlexItem,
  EuiSpacer,
  EuiTitle,
  EuiToolTip,
  EuiTextArea,
  EuiAccordion,
  EuiText,
  EuiButton,
} from '@elastic/eui';
import { DEFAULT_WORKPAD_CSS } from '../../../common/lib/constants';

export class WorkpadConfig extends PureComponent {
  static propTypes = {
    size: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    css: PropTypes.string,
    setSize: PropTypes.func.isRequired,
    setName: PropTypes.func.isRequired,
    setWorkpadCSS: PropTypes.func.isRequired,
  };

  state = {
    css: this.props.css,
  };

  render() {
    const { size, name, setSize, setName, setWorkpadCSS } = this.props;
    const { css } = this.state;
    const rotate = () => setSize({ width: size.height, height: size.width });

    const badges = [
      {
        name: '1080p',
        size: { height: 1080, width: 1920 },
      },
      {
        name: '720p',
        size: { height: 720, width: 1280 },
      },
      {
        name: 'A4',
        size: { height: 842, width: 590 },
      },
      {
        name: 'US Letter',
        size: { height: 792, width: 612 },
      },
    ];

    return (
      <div>
        <EuiTitle size="xs">
          <h4>工作台</h4>
        </EuiTitle>

        <EuiSpacer size="m" />

        <EuiFormRow label="名称" compressed>
          <EuiFieldText value={name} onChange={e => setName(e.target.value)} />
        </EuiFormRow>

        <EuiFlexGroup gutterSize="s" alignItems="center">
          <EuiFlexItem>
            <EuiFormRow label="宽度" compressed>
              <EuiFieldNumber
                onChange={e => setSize({ width: Number(e.target.value), height: size.height })}
                value={size.width}
              />
            </EuiFormRow>
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiFormRow hasEmptyLabelSpace>
              <EuiToolTip position="bottom" content="翻转宽度和高度">
                <EuiButtonIcon
                  iconType="merge"
                  color="text"
                  onClick={rotate}
                  aria-label="交换页面尺寸"
                  style={{ marginBottom: 12 }}
                />
              </EuiToolTip>
            </EuiFormRow>
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiFormRow label="高度" compressed>
              <EuiFieldNumber
                onChange={e => setSize({ height: Number(e.target.value), width: size.width })}
                value={size.height}
              />
            </EuiFormRow>
          </EuiFlexItem>
        </EuiFlexGroup>

        <EuiSpacer size="s" />

        <div>
          {badges.map((badge, i) => (
            <EuiBadge
              key={`page-size-badge-${i}`}
              color="hollow"
              onClick={() => setSize(badge.size)}
              aria-label={`预设页面大小: ${badge.name}`}
              onClickAriaLabel={`预设页面大小 ${badge.name}`}
            >
              {badge.name}
            </EuiBadge>
          ))}
        </div>

        <EuiSpacer size="m" />

        <EuiAccordion
          id="accordion-global-css"
          className="canvasArg__accordion"
          buttonContent={
            <EuiToolTip
              content="将样式应用于此工作台中的所有页面"
              position="left"
              className="canvasArg__tooltip"
            >
              <EuiText size="s" color="subdued">
              全局CSS覆盖
              </EuiText>
            </EuiToolTip>
          }
        >
          <div className="canvasArg__content">
            <EuiTextArea
              aria-label="将样式应用于此工作台中的所有页面"
              value={css}
              onChange={e => this.setState({ css: e.target.value })}
              rows={10}
            />
            <EuiSpacer size="s" />
            <EuiButton size="s" onClick={() => setWorkpadCSS(css || DEFAULT_WORKPAD_CSS)}>
              应用样式表
            </EuiButton>
            <EuiSpacer size="xs" />
          </div>
        </EuiAccordion>
      </div>
    );
  }
}
