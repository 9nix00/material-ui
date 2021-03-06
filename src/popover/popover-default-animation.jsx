import Transitions from '../styles/transitions';
import React from 'react';
import PropTypes from '../utils/prop-types';
import StylePropable from '../mixins/style-propable';
import DefaultRawTheme from '../styles/raw-themes/light-raw-theme';
import ThemeManager from '../styles/theme-manager';
import Paper from '../paper';

const PopoverDefaultAnimation = React.createClass({
  mixins: [StylePropable],

  propTypes: {
    children: React.PropTypes.node,
    className: React.PropTypes.string,
    open: React.PropTypes.bool.isRequired,
    style: React.PropTypes.object,
    targetOrigin: PropTypes.origin,
    zDepth: PropTypes.zDepth,
  },

  getInitialState() {
    return {
      muiTheme: this.context.muiTheme ? this.context.muiTheme : ThemeManager.getMuiTheme(DefaultRawTheme),
      open: false,
    };
  },

  contextTypes: {
    muiTheme: React.PropTypes.object,
  },

  //for passing default theme context to children
  childContextTypes: {
    muiTheme: React.PropTypes.object,
  },

  getChildContext() {
    return {
      muiTheme: this.state.muiTheme,
    };
  },

  getDefaultProps() {
    return {
      style: {},
      zDepth: 1,
    };
  },

  componentDidMount() {
    this.setState({open: true}); //eslint-disable-line react/no-did-mount-set-state
  },

  componentWillReceiveProps(nextProps, nextContext) {
    let newMuiTheme = nextContext.muiTheme ? nextContext.muiTheme : this.state.muiTheme;

    this.setState({
      open: nextProps.open,
      muiTheme: newMuiTheme,
    });
  },


  getStyles() {
    let {targetOrigin} = this.props;
    let horizontal = targetOrigin.horizontal.replace('middle', 'vertical');

    return {
      base: {
        opacity: 0,
        transform: 'scale(0, 0)',
        transformOrigin: `${horizontal} ${targetOrigin.vertical}`,
        position: 'fixed',
        zIndex: this.state.muiTheme.zIndex.popover,
        transition: Transitions.easeOut('250ms', ['transform', 'opacity']),
        maxHeight: '100%',

      },
      horizontal: {
        maxHeight: '100%',
        overflowY: 'auto',
        transform: 'scaleX(0)',
        opacity: 0,
        transformOrigin: `${horizontal} ${targetOrigin.vertical}`,
        transition: Transitions.easeOut('250ms', ['transform', 'opacity']),
      },
      vertical: {
        opacity: 0,
        transform: 'scaleY(0)',
        transformOrigin: `${horizontal} ${targetOrigin.vertical}`,
        transition: Transitions.easeOut('500ms', ['transform', 'opacity']),
      },
    };
  },

  getOpenStyles() {
    return {
      base: {
        opacity: 1,
        transform: 'scale(1, 1)',
      },
      horizontal: {
        opacity: 1,
        transform: 'scaleX(1)',
      },
      vertical: {
        opacity: 1,
        transform: 'scaleY(1)',
      },
    };
  },

  render() {
    let {
      className,
      style,
      zDepth,
    } = this.props;

    let styles = this.getStyles();
    let openStyles = {};
    if (this.state.open)
      openStyles = this.getOpenStyles();

    return (
      <Paper
        style={this.mergeStyles(styles.base, style, openStyles.base)}
        zDepth={zDepth}
        className={className}>
        <div style={this.prepareStyles(styles.horizontal, openStyles.horizontal)}>
          <div style={this.prepareStyles(styles.vertical, openStyles.vertical)}>
            {this.props.children}
          </div>
        </div>
      </Paper>
    );
  },
});

export default PopoverDefaultAnimation;
