import React, { Component } from "react";
const debounce = require("lodash/debounce");
import { Drawer, Classes, Position } from "@blueprintjs/core";
import { MAX_TEXT_DISPLAY_TIME, SECOND, CONTEXT_EVENTS_WHITELIST } from "../../utils/Constants";
import Authentication from "../Authentication/Authentication";
import { isVideoOverlay } from "../../helpers/video-helpers";
import { connect, Provider } from 'react-redux'
import { actionUpdateCCText } from '../../redux/cc-state'
import { updateConfigSettings } from "../../redux/config-settings-action-reducer";
import { updatePlayerContext } from "../../redux/twitch-player-action-reducers";
import { actionSetProducts, completeBitsTransaction, setChannelId } from "../../redux/products-catalog-action-reducers";

// Resub - rw_grim
//

export function withTwitchData(WrappedComponent, store) {
  class TwitchWrapper extends Component {
    constructor(props) {
      super(props);

      this.Authentication = new Authentication();
      this.twitch = window.Twitch ? window.Twitch.ext : null;
    }

    componentDidMount() {
      if (this.twitch) {
        // TODO: REMOVE WHEN RELEASING
        this.twitch.bits.setUseLoopback = true;

        this.twitch.onAuthorized(this.onAuthorized);
        this.twitch.onContext(this.contextUpdate);
        this.twitch.configuration.onChanged(this.setConfigurationSettings);
        this.twitch.listen("broadcast", this.pubSubMessageHandler);
        this.twitch.bits.getProducts().then(this.parseProducts);
        this.twitch.bits.onTransactionComplete(this.onTransactionComplete);
      }
    }

    componentWillUnmount() {
      if (this.twitch) {
        this.twitch.unlisten("broadcast", () => null);
      }
    }

    onAuthorized = auth => {
      this.props.onChannelIdReceived(auth.channelId);
      this.Authentication.setToken(auth.token, auth.userId);
    };

    parseProducts = products => {
      this.props.setProducts(products);
    };

    onTransactionComplete = transaction => {
      this.props.onCompleteTransaction(transaction);
    };

    contextUpdate = (context, delta) => {
      if (this.contextStateUpdated(delta)) {
        let newContext = this.fetchChangedContextValues(context, delta);

        this.props.updatePlayerContext(newContext);
      }
    };

    fetchChangedContextValues(context, delta) {
      let newData = {};
      delta.forEach(event => {
        newData[event] = context[event];
      });

      return newData;
    }

    contextStateUpdated(delta) {
      return delta.find(event => {
        return CONTEXT_EVENTS_WHITELIST.includes(event);
      });
    }

    setConfigurationSettings = () => {
      let config = this.twitch.configuration.broadcaster
        ? this.twitch.configuration.broadcaster.content
        : "";

      try {
        config = JSON.parse(config);
      } catch (e) {
        config = {};
      }

      this.props.updateConfigSettings({
        finishedLoading: true,
        isBitsEnabled: this.twitch.features.isBitsEnabled,
        ...config,
      });
    };

    pubSubMessageHandler = (target, contentType, message) => {
      // TODO - Parse message body a sku event
      let parsedMessage;
      try {
        parsedMessage = JSON.parse(message);
      } catch (error) {
        parsedMessage = {
          interim: message,
        };
      }

      this.displayClosedCaptioningText(parsedMessage);
    };

    displayClosedCaptioningText(message) {
      const { hlsLatencyBroadcaster } = this.props.videoPlayerContext;
      let delayTime = hlsLatencyBroadcaster * SECOND;

      // this.clearClosedCaptioning();
      setTimeout(() => {
        this.props.updateCCText(message)
      }, delayTime);
    }


    clearClosedCaptioning = debounce(() => {
    }, MAX_TEXT_DISPLAY_TIME);

    render() {
      const { finishedLoading } = this.props.configSettings;

      if (!finishedLoading) {
        return null;
      }

      let drawerWidth = Drawer.SIZE_STANDARD;
      if (!isVideoOverlay()) {
        drawerWidth = Drawer.SIZE_LARGE
      }

      return (
        <Provider store={store}>
          <WrappedComponent />
        </Provider>
      );
    }
  };

  const mapStateToProps = (state /*, ownProps*/) => {
    return {
      ccState: state.ccState,
      configSettings: state.configSettings,
      videoPlayerContext: state.videoPlayerContext,
    }
  }

 const mapDispatchToProps = dispatch => {
  return {
    updateCCText: (state) => dispatch(actionUpdateCCText(state)),
    updateConfigSettings: (settings) => dispatch(updateConfigSettings(settings)),
    updatePlayerContext: (state) => dispatch(updatePlayerContext(state)),
    setProducts: (products) => dispatch(actionSetProducts(products)),
    onCompleteTransaction: (transaction) => dispatch(completeBitsTransaction(transaction)),
    onChannelIdReceived: (channelId) => dispatch(setChannelId(channelId)),
  }
}

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(TwitchWrapper)
}
