import { Component } from '@angular/core';
import { AgentData } from './agent-data';
import { SAMPLE_DATA } from './sample-data';

import { MapsService, Coordinates } from './maps.service';
import { forkJoin, Observable } from 'rxjs';
import { delay, map, take } from 'rxjs/operators';

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
  closest: string;
  furthest: string;
  loading = false;

  constructor(private mapsService: MapsService) { }

  onFindIsolatedButtonClick() {
    this.mostIsolatedCountry = this.findMostIsolatedCountry(this.data);
  }

  async onFindDistancesButtonClick() {
    this.loading = true;
    try {
      const { closest, furthest } = await this.findDistancesFromDowning10(this.data).toPromise();
      this.closest = closest;
      this.furthest = furthest;
      this.loading = false;
    } catch (error) {
      this.loading = false;
      console.error(error);
    }
  }

  private findDistancesFromDowning10(data: AgentData[]): Observable<{ closest: string, furthest: string }> {
    return forkJoin(
      this.mapsService.getCoordinates('10 Downing st. London').pipe(delay(100)),
      ...data.map(d => this.mapsService.getCoordinates(d.address).pipe(delay(100)))
    )
      .pipe(
        map((result: Array<Coordinates>) => {
          const downingCoords = result.shift();
          const sorted = result
            .map((coords, index) => ({
              address: data[index].address,
              distance: this.mapsService.getDistanceBetweenCoordinates(downingCoords, coords)
            }))
            .slice()
            .sort((a, b) => a.distance - b.distance);

          if (!sorted.length) {
            return { closest: null, furthest: null };
          }

          return {
            closest: sorted[0].address,
            furthest: sorted[sorted.length - 1].address
          };
        }),
        take(1)
      );
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

