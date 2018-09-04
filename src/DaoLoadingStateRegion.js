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
    const {height = 30, width = 30, style = {}, loaderContainerStyle = {}, hideContentOnLoading, children = null, className} = this.props;
    const {busy, busyMessage} = this.state;
    if(!busy){
      return children;
    }
   return <div className={className} style={{flexDirection: 'column', zIndex: 10,  flex: 1, padding: 0, position: 'relative',...style}}>
          <div style={{position: 'absolute', top: '50%', left: '50%', ...loaderContainerStyle}}>
                <ScaleLoader sizeUnit={"%"} height={height} width={width} heightUnit="px"  widthUnit="px"/>
                <span>{busyMessage}</span>
          </div>
          {hideContentOnLoading ? null : children}
        </div>
  }
}