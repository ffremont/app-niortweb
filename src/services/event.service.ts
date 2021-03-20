import * as My from '../models/Event';
import { StateEnum } from '../models/StateEnum';

export class EventService{
  typeOfEvent(event:My.Event){
    if(event.scheduled >= (new Date()).getTime() && event.state === StateEnum.OK){
      return 'OPEN';
    }else if(event.scheduled < (new Date()).getTime() && event.state === StateEnum.OK){
      return 'PAST'
    }else{
      return 'SCHEDULED';
    }
  }
}

export default new EventService();