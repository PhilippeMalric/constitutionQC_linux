import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FileUploadService } from './file-upload.service';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';


export class MyVariable {

  symbol:string;
  couleur:string;
  decomposition:MyVariable[];
  constructor(symbol,couleur,decomposition){
    this.symbol=symbol
    this.couleur=couleur;
    this.decomposition=decomposition;


  }
}


export interface HarmoRule{
  index:string;
  rule_category:string;
  Study_variable:string;
  Harmo_rule:string;
  DataSchema_variable:string;
  variables:MyVariable[];
  harmoV:MyVariable[];
  harmoV2:MyVariable[];
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
  symbol_to_color = {}
  word_to_color = {}

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
      this.tibble = JSON.parse(myReader.result.toString())//.slice(0,20)
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

  this.tibble[i].variables = this.createVariables_helper(hr.Study_variable).sort((a, b) => a.symbol.localeCompare(b.symbol))
  this.tibble[i].harmoV2 = this.createVinHarmo_helper(hr.Harmo_rule)

  let hr_temp =  JSON.parse(JSON.stringify(this.tibble[i].harmoV2))
  this.tibble[i].harmoV = hr_temp.sort((a, b) => a.symbol.localeCompare(b.symbol))


  console.log("v1")
  console.log(this.tibble[i].variables)
  console.log("v2")
  console.log(this.tibble[i].harmoV)
}

createVariables_helper = variables=>{
  let v = variables.split(",")
  //console.log(v)
  return v.map((e,i2)=>{
    let v_temp = "$"+e.trim()
    let decomposition = []
    if(v_temp in this.symbol_to_color){


      if(v_temp.split("_").length <= 1){
        decomposition = [v_temp]
      }
      else{
        decomposition = this.decompose(v_temp)
      }

     return  new MyVariable(v_temp,this.symbol_to_color[v_temp],decomposition)
    }
     else{
      let color = this.getRandomColor();
      this.symbol_to_color[v_temp] = color
      let decomposition = []

      if(v_temp.split("_").length <= 1){
        decomposition = [v_temp]
      }
      else{
        decomposition = this.decompose(v_temp)
      }

      return  new MyVariable(v_temp,this.symbol_to_color[v_temp],decomposition)
     }

  })
}

createVinHarmo_helper = (harmo:string)=>{
  let re = RegExp("\\$[A-Za-z0-9_\.]*","g")
  let v = harmo.match(re);
  console.log("match")
  console.log(v)
  if(v){
    return v.map((e,i2)=>{
      let v_temp = e.trim()
      let decomposition = []
      if(v_temp in this.symbol_to_color){


        if(v_temp.split("_").length <= 1){
          decomposition = [v_temp]
        }
        else{
          decomposition = this.decompose(v_temp)
        }

       return  new MyVariable(v_temp,this.symbol_to_color[v_temp],decomposition)
      }
       else{
        let color = this.getRandomColor();
        this.symbol_to_color[v_temp] = color
        let decomposition = []

        if(v_temp.split("_").length <= 1){
          decomposition = [v_temp]
        }
        else{
          decomposition = this.decompose(v_temp)
        }

        return  new MyVariable(v_temp,this.symbol_to_color[v_temp],decomposition)
       }

    })
  }
  else{
    return []
  }

}

decompose = (symbol)=>{
  let words = symbol.split("_")
  return words.map(
    (w)=>{


if(w in this.word_to_color){
  return new MyVariable(w, this.word_to_color[w],[])
  }
  else{
    let color = this.getRandomColor();
    this.word_to_color[w] = color
    return new MyVariable(w, this.word_to_color[w],[])
  }
 })
}


getRandomColor() {
  var letters2 = '56789ABC';
  var letters = '0123456789ABCDEF';
  var color = '#00';
  color += letters2[Math.floor(Math.random() * letters2.length)];
  for (var i = 0; i < 3; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

}
