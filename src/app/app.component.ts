import { Component } from '@angular/core';
import { AgentData } from './agent-data';
import { SAMPLE_DATA } from './sample-data';

import { MapsService, Coordinates } from './maps.service';
import { forkJoin } from 'rxjs';
import { delay } from 'rxjs/operators';

interface CountryAgentsDictionary {
  [country: string]: string[];
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  readonly data: AgentData[] = SAMPLE_DATA;
  mostIsolatedCountry: string;
  closestToDowning: string;
  furthestFromDowning: string;

  constructor(private mapsService: MapsService) { }

  onFindIsolatedButtonClick() {
    this.mostIsolatedCountry = this.findMostIsolatedCountry(this.data);
  }

  onFindDistancesButtonClick() {
    this.findDistancesFromDowning(this.data);
  }

  private findDistancesFromDowning(data: AgentData[]) {
    forkJoin(
      this.mapsService.getCoordinates('10 Downing st. London').pipe(delay(100)),
      ...data.map(d => this.mapsService.getCoordinates(d.address).pipe(delay(100)))
    )
      .subscribe((result: Array<Coordinates>) => {
        const downing = result.shift();
        const sorted = result
          .map(
            (c, index) => ({
              address: data[index].address,
              distance: this.mapsService.getDistanceBetweenCoordinates(downing, c)
            })
          )
          .slice()
          .sort((a, b) => a.distance - b.distance);

        if (!sorted.length) {
          return;
        }

        this.closestToDowning = sorted[0].address;
        this.furthestFromDowning = sorted[sorted.length - 1].address;
      });
  }

  private findMostIsolatedCountry(data: AgentData[]): string {
    const agentsPerCountryDict = this.groupAgentsByCountry(data);

    return Object.keys(agentsPerCountryDict)
      .map(key => ({ country: key, agentsCount: agentsPerCountryDict[key].length }))
      .sort((a, b) => b.agentsCount - a.agentsCount)
      .map(p => p.country)[0];
  }

  private groupAgentsByCountry(data: AgentData[]): CountryAgentsDictionary {
    return data
      .reduce<CountryAgentsDictionary>((dict, agentData) => {
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

