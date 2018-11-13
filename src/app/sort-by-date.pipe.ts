import { Pipe, PipeTransform } from '@angular/core';
import { AgentData } from './agent-data';

@Pipe({
  name: 'sortByDateAscending'
})
export class SortByDateAscendingPipe implements PipeTransform {

  transform(data: AgentData[]): AgentData[] {
    return data
      .slice()
      .filter(agentData => agentData != null)
      .sort((a, b) => new Date(a.date).valueOf() - new Date(b.date).valueOf());
  }
}
