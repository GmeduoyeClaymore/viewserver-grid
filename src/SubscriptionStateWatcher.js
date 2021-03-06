import {RxDataSink} from 'viewserver-dao-middleware';
import moment from 'moment';
export default class SubscriptionStateWatcher{
    constructor(dao, setStateFunc){
        this.setStateFunc = setStateFunc;
        dao.rawDataObservable.subscribe(this.observeLoadingStatusChanges);
        dao.dataRequestedObservable.subscribe(this.observeDataRequest);
        this.state = {
        }
    }
  
    observeDataRequest = (status) => {
      if(status){
        const {dataRequestBusy, dataRequestBusyStartTime, busy , dbBusy} = this.state;
        if(busy && dataRequestBusyStartTime){
          const duration = Math.round(moment.duration(moment().diff(dataRequestBusyStartTime)).asSeconds());
          this.setState({busy: true, dataRequestBusy: true,  busyMessage: `Waiting for server to respond to data request ${duration} seconds`, duration})
        }else{
          this.setState({busy: true, dataRequestBusy: true,  busyMessage: "Waiting for server to respond to data request ", dataRequestBusyStartTime: moment()})
        }
      }else{
        const {dbBusy} = this.state;
        if(!dbBusy){
          this.setState({busy: false,dataRequestBusy: false, dataRequestBusyStartTime: undefined, busyMessage: "Server has responded"})
        }
      }
    }

    observeLoadingStatusChanges = (event) => {
      if(event.Type === RxDataSink.DATA_ERROR){
        const {dbBusy, dbBusyStartTime, busy} = this.state;
        if(busy && dbBusyStartTime){
          const duration = Math.round(moment.duration(moment().diff(dbBusyStartTime)).asSeconds());
          this.setState({busy: true, dbBusy: true,  busyMessage: `Waiting for data to load from database ${duration} seconds`, duration})
        }else{
          this.setState({busy: true, dbBusy: true,  busyMessage: "Waiting for data to load from database", dbBusyStartTime: moment()})
        }
      }
      else if(event.Type === RxDataSink.DATA_ERROR_CLEARED){
        this.setState({busy: false,dbBusy: false, dbBusyStartTime: undefined, busyMessage: "Finished loading data from database"})
      }
    }

    setState = (partialState) => {
      const {state, setStateFunc} = this;
      this.state = {...state, ...partialState};
      setStateFunc(this.state);
    }
  }
  