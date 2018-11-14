import { Component, Input } from '@angular/core';
import { AgentData } from '../agent-data';

@Component({
  selector: 'app-agents-table',
  templateUrl: './agents-table.component.html',
  styleUrls: ['./agents-table.component.scss']
})
export class AgentsTableComponent {

  @Input() data: AgentData[] = [];
  @Input() furthest: string;
  @Input() closest: string;

}
