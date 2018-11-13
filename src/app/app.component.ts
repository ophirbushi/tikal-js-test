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
    const agentsPerCountryDict = this.groupAgentsByCountry(data);

    return Object.keys(agentsPerCountryDict)
      .map(key => ({ country: key, agentsCount: agentsPerCountryDict[key].length }))
      .sort((a, b) => b.agentsCount - a.agentsCount)
      .map(p => p.country)[0];
  }

  onFindIsolatedButtonClick() {
    this.mostIsolatedCountry = this.findMostIsolatedCountry(this.data);
  }

  private groupAgentsByCountry(data: AgentData[]): CountryAgentsDictionary {
    return data.reduce<CountryAgentsDictionary>((dict, agentData) => {
      const { country, agent } = agentData;
      if (!dict[country]) {
        dict[country] = [];
      }
      if (dict[country].indexOf(agent) === -1) {
        dict[country].push(agent);
      }
      return dict;
    }, {});
  }
}

interface CountryAgentsDictionary {
  [country: string]: string[];
}
