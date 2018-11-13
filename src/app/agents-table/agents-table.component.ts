import { Component, OnInit, Input } from '@angular/core';
import { AgentData } from '../agent-data';

@Component({
  selector: 'app-agents-table',
  templateUrl: './agents-table.component.html',
  styleUrls: ['./agents-table.component.scss']
})
export class AgentsTableComponent implements OnInit {

  @Input() data: AgentData[] = [];

  constructor() { }

  ngOnInit() {
  }

}
