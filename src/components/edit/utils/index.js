// 判断参数是否是其中之一
export function oneOf (value, validList) {
  for (let i = 0; i < validList.length; i++) {
      if (value === validList[i]) {
          return true;
      }
  }
  return false;
}

export class Debounce {
  constructor(time,force){
    this._timeoutIndex = 0; //setTimeout的序号
    this._last = + new Date();
    this._time = time || 4; //多久执行一次,单位是毫秒
    this._force = force || false; //是否强制执行
    this._handler = Function;
  }

  handle(handler){
    let current;
    this._handler = handler;
    //强制执行
    if(this._force && (current = +new Date()) - this._last > this._time){
      this._last = current;
      typeof handler == 'function' && handler();
      this._last = current;
    }
    //不管怎么样都会延迟的
    this._delayHandle();
  }
  //延迟执行
  _delayHandle(){
    clearTimeout(this._timeoutIndex);
    this._timeoutIndex = setTimeout( ()=>{
      this._handler();
      this.clearTimeout();
    },this._time);
  }

  clearTimeout(){
    clearTimeout(this._timeoutIndex);
    this._timeoutIndex = -1;
  }

  //直接执行，不要延迟了
  doHandle(){
    if(this._timeoutIndex != -1){//有延迟执行的情况下，才执行
      this._handler && this._handler();
      this.clearTimeout();
    }
  }

  destroy(){
    this.clearTimeout();
  }
}