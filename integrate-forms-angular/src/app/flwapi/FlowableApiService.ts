import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Model} from '@flowable/forms';

@Injectable()
export class FlowableApiService {
    readonly httpOptionsWithUserCredentials = {
        headers: {
            Authorization: `Basic ${btoa(`admin:test`)}`,
        }
    };

    constructor(
        private httpClient: HttpClient) {
    }

    public fetchStartForm(processDefinitionId: string): Observable<Model.FormLayout> {
        return this.httpClient.get<Model.FormLayout>(`/platform-api/process-definitions/${processDefinitionId}/start-form`,
            this.httpOptionsWithUserCredentials);
    }

    public fetchLatestProcessDefinition(processDefinitionKey: string): Observable<any> {
        return this.httpClient.get<any>(`/process-api/repository/process-definitions?key=${processDefinitionKey}&latest=true`,
            this.httpOptionsWithUserCredentials)
            .pipe<any>(
                map(result => result.data.length > 0 ? result.data[0] : undefined)
            );
    }

    public postNewProcessInstance(processDefinitionId: string, startFormPayload: Model.Payload, startFormOutcomeResult: any):
        Observable<any> {
        return this.httpClient.post(`/platform-api/process-instances`, {
            ...startFormPayload,
            outcome: startFormOutcomeResult,
            processDefinitionId
        }, this.httpOptionsWithUserCredentials);
    }

    public getDefaultProcessCreateOutcome(): Model.Outcome {
        return {
            label: 'Create new process',
            value: '__CREATE'
        };
    }
}
