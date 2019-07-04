/* Schlumberger Private
Copyright 2018 Schlumberger.  All rights reserved in Schlumberger
authored and generated code (including the selection and arrangement of
the source code base regardless of the authorship of individual files),
but not including any copyright interest(s) owned by a third party
related to source code or object code authored or generated by
non-Schlumberger personnel.

This source code includes Schlumberger confidential and/or proprietary
information and may include Schlumberger trade secrets. Any use,
disclosure and/or reproduction is prohibited unless authorized in
writing. */
import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { GridConfigModel } from 'src/app/sharedcomponents/models/sharedmodels';
import { AppToasterService } from 'src/app/base/toaster/toaster.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ColumnComponent } from '@progress/kendo-angular-excel-export';
import { ActivitymonitorService } from 'src/app/modules/activitymonitor/activitymonitor/activity-monitor.service';

const warnMessage = 'Warning! Ensure your results are below 1000 records for Export to Excel and 400 records for Export to PDF.';

@Component({
  selector: 'app-export-excel',
  templateUrl: './export-excel.component.html',
  styleUrls: ['./export-excel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExportExcelComponent implements OnInit {

  @Input() public gridModel: GridConfigModel;
  pdfColumns: ColumnComponent[];
  pdfGridData: any[] = [];

  totalGirdResult: number;

  constructor(private _toasterService: AppToasterService, 
    private httpClient: HttpClient, 
    private activityMonitorService: ActivitymonitorService) {

    this.activityMonitorService.pdfGridHeader.subscribe(data => {
      this.pdfColumns = data;
    });

    this.activityMonitorService.pdfGridData.subscribe(data => {
      this.pdfGridData = data; 
    });

  }

  ngOnInit() {   
  }

  gridExportExcel() {
    this.totalGirdResult = this.gridModel.DataGridResult.total;
    if (this.totalGirdResult && this.totalGirdResult > 1000) {
      this._toasterService.ShowWarning(warnMessage);
    }
  }

  gridSaveAsExcel() {
    this.totalGirdResult = this.gridModel.DataGridResult.total;
    if (this.totalGirdResult && this.totalGirdResult > 1000) {
      this._toasterService.ShowWarning(warnMessage);
    } else {
      this.gridModel.DataGridInstance.saveAsExcel();
    }
  }

  gridSavePDF() {
    let pdfCol = [];
    let keysArr = [];
    let pdfData = [];

    this.pdfColumns.forEach(function (value) {
      if(value.field !== undefined){
        pdfCol.push({
          field: value.field,
          title: value.title,
          width: value.width
        });
        keysArr.push(value.field);
      }
    });

    if(this.pdfGridData.length > 0) {
      for(var i = 0; i < this.pdfGridData.length; i++ ){
        var tmpObj = {};
        for(var k=0; k < keysArr.length; k++){
          tmpObj[keysArr[k]] = this.pdfGridData[i][keysArr[k]]
        }
        keysArr.forEach(function (val) {
        })
        pdfData.push(tmpObj);
      }
    }
 
    // const url = 'http://localhost:3000/generate-pdf';
    // const body = {
    //   data: [{
    //     tlmShipDate: 'ContactName 1',
    //     tcoNumber: 'ContactTitle 1',
    //     jobNumber: 'CompanyName 1',
    //     priority: 'Country 1'
    //   }],
    //   column: pdfCol
    // };

    const url = 'http://localhost:3000/generate-pdf';
    const body = {
      data: pdfData,
      column: pdfCol
    };

    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/pdf');

    this.httpClient.post(url, body,  {headers: headers, responseType: 'blob'}
    ).subscribe(response => {
      const blob = new Blob([response], {type: 'application/pdf'});
      const fileURL = URL.createObjectURL(blob);
      window.open(fileURL);
    });

    // this.totalGirdResult = this.gridModel.DataGridResult.total;
    // if (this.totalGirdResult && this.totalGirdResult > 400) {
    //   this._toasterService.ShowWarning(warnMessage);
    // } else {
    //   this.gridModel.DataGridInstance.saveAsPDF();
    // }

  }
}