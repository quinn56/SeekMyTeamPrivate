import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'skills',
  pure: false
})
export class SkillsPipe implements PipeTransform {
    transform(value: any[], skills: string[], prop?: any): any {  
      if (!value) {  
        return [];  
      }  
      if (!skills || !prop) {  
          return value;  
      }  
      const _isArr = Array.isArray(value),  
          _flag = _isArr && typeof value[0] === 'object' ? true : _isArr && typeof value[0] !== 'object' ? false : true;  

      return value.filter(ele => {  
          let val = _flag ? ele[prop] : ele; 
          return skills.every(item => val.includes(item)); 
      });  
    }  
}