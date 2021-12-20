import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  storage:Storage

  set(key:string, value:string) {
    //console.log(key, value)
   this.storage.setItem(key, value)
  }

  get(key:string) {
    if(this.storage){
      return this.storage.getItem(key)
    } else {
      return null
    }
    
  }

  clear(key:string) {
    this.storage.removeItem(key)
  }

  constructor() { 
    this.storage = window.localStorage
  }
}
