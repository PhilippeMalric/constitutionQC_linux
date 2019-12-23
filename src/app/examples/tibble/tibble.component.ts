import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FileUploadService } from './file-upload.service';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';


export class MyVariable {

  symbol:string;
  couleur:string;
  constructor(symbol,couleur){
    this.symbol=symbol
    this.couleur=couleur;
  }
}

export interface HarmoRule{
  index:string;
  rule_category:string;
  Study_variable:string;
  Harmo_rule:string;
  DataSchema_variable:string;
  variables:MyVariable[];
}


@Component({
  templateUrl: './tibble.component.html',
  styleUrls: ['./tibble.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TibbleComponent implements OnInit {
  fileToUpload: File = null;
  tibble :HarmoRule[]
  dataSource : MatTableDataSource<HarmoRule>;
  displayedColumns: string[] = ['position']

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  constructor(private fileUploadService:FileUploadService,private changeDetectorRef: ChangeDetectorRef,) { }

  ngOnInit() {

  }

  ngAfterViewInit(): void {
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }
  launch(i){
    console.log(i)
    console.log(this.tibble[i])
  }
  onTextInputChange(evt,index){
    console.log(evt,index)
  }
  uploadFileToActivity() {
    console.log("fileToUpload")
    console.log(this.fileToUpload)

    this.fileUploadService.postFile(this.fileToUpload).subscribe(data => {
      // do something, if upload success
      }, error => {
        console.log(error);
      });
  }
  changeListener($event): void {
    this.readThis($event.target);
  }

  readThis(inputValue: any): void {
  var file: File = inputValue.files[0];
  var myReader: FileReader = new FileReader();
  var fileType = inputValue.parentElement.id;
  myReader.onloadend = (e)=> {
      //myReader.result is a String of the uploaded file
      this.tibble = JSON.parse(myReader.result.toString()).slice(0,20)
      this.tibble.map(this.createVariables)

      this.dataSource = new MatTableDataSource(this.tibble);
      console.log(this.tibble)
      this.dataSource.paginator = this.paginator;
      this.changeDetectorRef.markForCheck()
      //fileString = myReader.result would not work,
      //because it is not in the scope of the callback
  }

myReader.readAsText(file);
}

createVariables =  (hr:HarmoRule,i:number)=>{

  this.tibble[i].variables = this.createVariables_helper(hr.Study_variable)
  console.log("v")
  console.log(this.tibble[i].variables)
}

createVariables_helper = variables=>{
  let v = variables.split(",")
  console.log(v)
  return v.map((e,i2)=>{
    switch(v[i2]){
      case 'F_AU02_ALCOHOL_FREQ':
        return new MyVariable(v[i2],"blue")
      default:
        return new MyVariable(v[i2],"white")
    }
  })
}




}
