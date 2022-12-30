import {Injectable} from '@angular/core';
import {AbstractService} from "../../helpers/service/abstract.service";
import {Observable} from "rxjs";
import {JsonSchemaDto} from "../../helpers/model/common-dtos";

@Injectable({
  providedIn: 'root'
})
export class JsonSchemaService extends AbstractService {

  saveSchema(schema: { title: string, description: string, json: string, previousId: string | undefined }): Observable<JsonSchemaDto> {
    return this.httpClient
      .post<JsonSchemaDto>(`${this.PRIVATE_PATH}/json-schemas`, schema);
  }

  findLast(): Observable<JsonSchemaDto> {
    return this.httpClient
      .get<JsonSchemaDto>(`${this.PRIVATE_PATH}/json-schemas/last`);
  }

  findPrev(currentSchemaId: string): Observable<JsonSchemaDto> {
    return this.httpClient
      .get<JsonSchemaDto>(`${this.PRIVATE_PATH}/json-schemas/${currentSchemaId}/previous`);
  }

  findNext(currentSchemaId: string): Observable<JsonSchemaDto> {
    return this.httpClient
      .get<JsonSchemaDto>(`${this.PRIVATE_PATH}/json-schemas/${currentSchemaId}/next`);
  }

  findAll(): Observable<JsonSchemaDto[]> {
    return this.httpClient
      .get<JsonSchemaDto[]>(`${this.PRIVATE_PATH}/json-schemas`);
  }

  delete(schemaId: string) {
    return this.httpClient.delete(`${this.PRIVATE_PATH}/json-schemas/${schemaId}`);
  }

}
