import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withTwitchPlayerContext } from '../../context/provider/TwitchPlayer'
import { withConfigSettings } from '../../context/provider/ConfigSettings'
import { captionStyles, ccStyles } from "./caption-styles";
import Draggable, {DraggableCore} from 'react-draggable';
import { WIDTH_INDEX, MINIMUM_VID_WIDTH } from '../../utils/Constants';
const classNames = require('classnames');

import './ClosedCaption.css'
import { inflateSync } from 'zlib';
import { debug } from 'util';

// Bits 100 from electrichavoc
// Resub Nyixxs
// Resub Nataliexo93
// Resub lurking_kat

class ClosedCaption extends PureComponent {

  shouldHideCC() {
    const { interimText, finalText, hide, playerContext: { displayResolution }} = this.props;

    return this.isEmptyCC(interimText + finalText) || hide;
  }

  isEmptyCC(text) {
    return text.length === 0;
  }

  setFontSizeStyle () {
    let fontSize = "";

    switch (this.props.fontSize) {
      case 'small':
        fontSize = 'var(--small-font-size)'
        break;
      case 'medium':
        fontSize = 'var(--medium-font-size)'
        break;
      case 'large':
        fontSize = 'var(--large-font-size)'
        break;
      default:
        fontSize = 'var(--medium-font-size)'
        break;
    }

    return fontSize;
  }

  ccText = () => {
    const { interimText, finalText, configSettings } = this.props;
    let fontSize = this.setFontSizeStyle();

    let textStyles = { ...ccStyles, fontSize: fontSize};

    const styles = {
      maxHeight: `calc(${fontSize} * var(--line-height) * 3 + var(--caption-pad-bottom) * 2)`,
      overflow: 'hidden'
    }

    let containerClasses = classNames({
      "caption-container": true,
      "hide": this.shouldHideCC(),
    })

    let ccTextClasses = classNames({
      "text-capitalize": configSettings.textUppercase,
      "text-mix-case": !configSettings.textUppercase
    });

    return (
        <div className={containerClasses} style={styles}>
          <div className={ccTextClasses} style={textStyles} >
            {interimText}
          </div>
          <div className={ccTextClasses} style={textStyles}>
            {finalText}
          </div>
        </div>
    );
  }

  render() {
    return (
      <Draggable grid={[8, 8]} bounds="parent" onStop={this.props.onDragEnd}>
        {this.ccText()}
      </Draggable>
    );
  }

}

ClosedCaption.propTypes = {
  interimText: PropTypes.string,
  finalText: PropTypes.string,
  hide: PropTypes.bool,
  playerContext: PropTypes.object,
  settings: PropTypes.object,
  onDragEnd: PropTypes.func,
  fontSize: PropTypes.string,
  configSettings: PropTypes.object,
}

ClosedCaption.defaultProps = {
  interimText: "",
  finalText: ""
}

export default withTwitchPlayerContext(withConfigSettings(ClosedCaption));
