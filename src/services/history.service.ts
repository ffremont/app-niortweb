import { BehaviorSubject } from "rxjs";

class HistoryService {
    currentPathname: string | null = null;

    public currentStack: string[] = HistoryService.initialStackValue();
    public stack = new BehaviorSubject<string[]>(HistoryService.initialStackValue());

    static initialStackValue(){
        let init:string[] = [];
        if(window.sessionStorage && window.sessionStorage.getItem('myHistory')){
            try{
                init = JSON.parse(window.sessionStorage.getItem('myHistory')||'[]');
            }catch(e){}
        }

        return init;
    }

    canGoBack():boolean{
        return this.currentStack.length > 1;
    }

    onApp() {
    }

    on(pathname: string) {
        if (this.currentStack[this.currentStack.length - 1] !== pathname) {
            this.currentStack.push(pathname);

            if(window.sessionStorage) window.sessionStorage.setItem('myHistory', JSON.stringify(this.currentStack));

            this.stack.next(this.currentStack);
        }
        this.currentPathname = pathname;
    }
}

export default new HistoryService();