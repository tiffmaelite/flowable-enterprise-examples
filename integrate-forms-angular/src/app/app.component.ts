import {Component, OnInit} from '@angular/core';
import {mergeMap, map} from 'rxjs/operators';
import {combineLatest, Observable} from 'rxjs';

import {Model} from '@flowable/forms';

import {FlowableApiService} from './flwapi/FlowableApiService';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public props: Model.CommonFormProps = null;

  constructor(
    private flowableApiService: FlowableApiService) {
  }

  ngOnInit(): void {
    this.fetchProcessStartForm('integrateForms')
      .subscribe(([formLayout, processDefinitionId]) => {
        this.setFormPropertiesForStartForm(formLayout, processDefinitionId);
      });
  }

  private fetchProcessStartForm(processDefinitionKey: string): Observable<[Model.FormLayout, string]> {
    const processDefinitionIdObservable = this.flowableApiService.fetchLatestProcessDefinition(processDefinitionKey)
      .pipe<string>(
        map(result => result?.id)
      );

    return combineLatest([
      processDefinitionIdObservable.pipe<Model.FormLayout>(
        mergeMap(processDefinitionId => this.flowableApiService.fetchStartForm(processDefinitionId))
      ),
      processDefinitionIdObservable
    ]);
  }

  private setFormPropertiesForStartForm(formLayout: Model.FormLayout, processDefinitionId: string): void {
    formLayout.outcomes = formLayout.outcomes || [
      this.flowableApiService.getDefaultProcessCreateOutcome()
    ];
    this.props = {
      config: formLayout ,
      onOutcomePressed: (payload: Model.Payload, result: any, navigationUrl?: string, outcomeConfig?: Model.ResolvedColumn) => {
        console.log(processDefinitionId, result, navigationUrl, outcomeConfig, payload);
        this.flowableApiService.postNewProcessInstance(processDefinitionId, payload, result)
          .subscribe(creationResult => {
            console.log(processDefinitionId, creationResult);
            // handle successful creation and store creationResult.id to have the id of the created process
          });
      }
    };
  }

}
