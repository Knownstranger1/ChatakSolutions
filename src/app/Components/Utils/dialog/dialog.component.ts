import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent {
  constructor(public dialogRef: MatDialogRef<any>){

  }
  public typesInput: Array<any> = [
    {
      name: "First name and Last name",
      type: 'text'
    }, {
      name: "E-mail",
      type: 'email'
    },
    {
      name: "Phone Number",
      type: 'Number'
    },
    {
      name: "Message",
      type: 'textarea'
    }
  ]
  close() {
   this.dialogRef.close()
  }
}
