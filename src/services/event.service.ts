import * as My from '../models/Event';
import { StateEnum } from '../models/StateEnum';

export class EventService{
  typeOfEvent(event:My.Event){
    const pointTs = event.scheduled + event.duration*60000;

    if(pointTs >= (new Date()).getTime() && event.state === StateEnum.OK){
      return 'OPEN';
    }else if(pointTs < (new Date()).getTime() && event.state === StateEnum.OK){
      return 'PAST'
    }else{
      return 'SCHEDULED';
    }
  }
}

export default new EventService();