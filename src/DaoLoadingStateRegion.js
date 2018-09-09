import {ScaleLoader} from 'react-spinners';
import React, {Component} from 'react';
import {PropTypes} from 'prop-types';
import SubscriptionStateWatcher from './SubscriptionStateWatcher';

export default class DaoLoadingStateRegion extends Component {
  constructor(props){
    super(props);
    const {dao} = this.props;
    if(!dao){
        throw new Error('Dao must be specified')
    }
    this.state = {
    }
    this.stateWatcher = new SubscriptionStateWatcher(dao, this.setStateBound)
  }

  setStateBound = (partialState) => {
    this.setState(partialState);
    const {onLoadingStateChanged} = this.props;
    if(onLoadingStateChanged){
      onLoadingStateChanged(partialState);
    }
  }

  render() {
    const {height = 30, width = 30, style = {}, loaderContainerStyle = {}, hideContentOnLoading, children = null, className, collapseRegion, loadingMessageFormatter} = this.props;
    let {busy, busyMessage} = this.state;
    busyMessage = loadingMessageFormatter ? loadingMessageFormatter(this.state) : busyMessage;
    if(!busy && collapseRegion){
      return children;
    }    
   return <div className={className + ` ${busy ? 'busy_region' : ''}`} style={{flexDirection: 'column',  flex: 1, padding: 0, position: 'relative',...style}}>
          {busy ?<div style={{position: 'absolute', top: '50%', left: '50%', zIndex: 10,  ...loaderContainerStyle}}>
                <ScaleLoader sizeUnit={"%"} height={height} width={width} heightUnit="px"  widthUnit="px"/>
                <span>{busyMessage}</span>
          </div> : null}
          {hideContentOnLoading ? null : children}
        </div>
  }
}