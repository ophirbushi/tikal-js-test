import { Component } from '@angular/core';
import { AgentData } from './agent-data';
import { SAMPLE_DATA } from './sample-data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  readonly data: AgentData[] = SAMPLE_DATA;
  mostIsolatedCountry: string;

  findMostIsolatedCountry(data: AgentData[]): string {
    const groupsDictionary: CountryAgentsDictionary = {};

    data.forEach(agentData => {
      if (!groupsDictionary[agentData.country]) {
        groupsDictionary[agentData.country] = [];
      }
      groupsDictionary[agentData.country].push(agentData.agent);
    });

    const sorted = Object.keys(groupsDictionary)
      .map(key => ({ country: key, agentsCount: groupsDictionary[key].length }))
      .sort((a, b) => b.agentsCount - a.agentsCount)
      .map(p => p.country);

    return sorted[0];
  }

  onFindIsolatedButtonClick() {
    this.mostIsolatedCountry = this.findMostIsolatedCountry(this.data);
  }
}

interface CountryAgentsDictionary {
  [country: string]: string[];
}
