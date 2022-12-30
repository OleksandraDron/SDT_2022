import {Component, OnInit} from '@angular/core';
import {ToastrService} from "ngx-toastr";
import {JsonSchemaService} from "../json-schema/service/json-schema.service";
import Ajv from "ajv";
import {MatRadioChange} from "@angular/material/radio";
import {JsonSchemaDto} from "../helpers/model/common-dtos";
import {Draft04, Draft06, Draft07, Draft, JSONError} from "json-schema-library";

var flatten = require('flat');
var parse = require('json-schema-to-markdown')
var FileSaver = require('file-saver');

@Component({
  selector: 'app-json-validator',
  templateUrl: './json-validator.component.html',
  styleUrls: ['./json-validator.component.css']
})
export class JsonValidatorComponent implements OnInit {

  public data: string = '';
  public error: string | undefined;
  isJsonMode: boolean = true;
  currentSchemaId: string | undefined;
  private lastSchemaId: string | undefined;
  displayedColumns = ['title', 'description', 'createdDate'];
  schemas: JsonSchemaDto[] = [];
  public schema: string = `{
  "type": "object",
  "title": "Example schema",
  "description": "description",
  "properties": {
    "foo": {
      "type": "string"
    },
    "bar": {
      "type": "integer"
    }
  },
  "required": [
    "foo"
  ]
  }`;

  constructor(private toastr: ToastrService, private jsonService: JsonSchemaService) {
  }

  ngOnInit(): void {
    this.fetchSchemas();
    this.findLast();
    try {
      const schema = JSON.parse(this.schema);
      this.data = JSON.stringify(new Draft07(schema).getTemplate(), null, 2);
    } catch (e) {
      console.log(e)
    }
  }

  private fetchSchemas() {
    this.jsonService.findAll()
      .subscribe({
        next: (schemas) => {
          this.schemas = schemas
        },
        error: err => {
          err.error.errors.forEach((error: { message: string | undefined; }) => this.toastr.error());
        }
      });
  }

  prettifyJson(jsonMode: boolean): string {
    try {
      let value = JSON.parse(this.schema);
      let s = JSON.stringify(value, null, 2);

      if (jsonMode) {
        return s;
      }

      return JSON.stringify(flatten(value), null, 2);
    } catch (e) {
      if (e instanceof Error) {
        this.error = e.message;
      }
      return '';
    }
  }

  prettifyData() {
    try {
      this.data = JSON.stringify(JSON.parse(this.data), null, 2);
    } catch (e) {
    }
  }

  changeMod($event: MatRadioChange) {
    this.isJsonMode = $event.value;
  }

  getError() {
    if (!this.data) return '';

    try {
      JSON.parse(this.data);
    } catch (e) {
      if (e instanceof Error) {
        return e.message;
      }
    }

    return '';
  }

  getValidationError() {
    try {
      const ajv = new Ajv();
      let schema = JSON.parse(this.schema);
      const valid = ajv.validate(schema, JSON.parse(this.data))
      if (!valid) return ajv.errorsText(ajv.errors);
    } catch (e) {
    }
    return '';
  }

  generateExample() {
    try {
      let schema = JSON.parse(this.schema);
      this.data = JSON.stringify(new Draft07(schema).getTemplate(), null, 2);
    } catch (e) {
    }
  }

  exportAsMD() {
    if (this.error) {
      this.toastr.error();
      return;
    }

    let json = this.prettifyJson(true);
    const blob = new Blob([parse(JSON.parse(json))], {
      type: 'text/plain'
    });
    FileSaver.saveAs(blob, 'json-schema.md');
  }

  saveSchema() {
    if (this.error) {
      this.toastr.error(`Invalid schema can't be saved`);
      return;
    }

    let json = JSON.parse(this.prettifyJson(true));

    let schema = {
      title: json.title ? json.title : 'Untitled',
      description: json.description,
      json: JSON.stringify(json),
      previousId: this.lastSchemaId
    };

    console.log(schema)

    this.jsonService.saveSchema(schema).subscribe({
      next: schema => {
        console.log('current id = ' + schema.id)
        this.currentSchemaId = schema.id;
        this.lastSchemaId = schema.id;
        this.fetchSchemas();
      },
      error: err => {
        err.error.errors.forEach((error: { message: string | undefined; }) => this.toastr.error());
      }
    })

  }

  findLast() {
    this.jsonService.findLast()
      .subscribe({
        next: schema => {
          console.log('current id = ' + schema.id)
          this.currentSchemaId = schema.id;
          this.lastSchemaId = schema.id;
          this.schema = JSON.stringify(JSON.parse(schema.json), null, 2);
          try {
            this.data = JSON.stringify(new Draft07(JSON.parse(this.schema)).getTemplate(), null, 2);
          } catch (e) {
          }
        }
      })
  }

  findPrev() {
    if (!this.currentSchemaId) {
      return;
    }

    this.jsonService.findPrev(this.currentSchemaId)
      .subscribe({
        next: schema => {
          console.log('current id = ' + schema.id)
          this.currentSchemaId = schema.id;
          this.schema = JSON.stringify(JSON.parse(schema.json), null, 2);
        }
      });
  }

  findNext() {
    if (!this.currentSchemaId) {
      return;
    }

    this.jsonService.findNext(this.currentSchemaId)
      .subscribe({
        next: schema => {
          console.log('current id = ' + schema.id)
          this.currentSchemaId = schema.id;
          this.schema = JSON.stringify(JSON.parse(schema.json), null, 2);
        }
      });
  }


  generateSchema() {
    try {
      let json = JSON.parse(this.data);
      this.schema = JSON.stringify(new Draft07().createSchemaOf(json), null, 2);
    } catch (e) {
      if (e instanceof Error) {
        this.toastr.error(e.message);
      }
    }
  }
}
