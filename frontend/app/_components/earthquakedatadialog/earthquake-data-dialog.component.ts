import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'earthquake-data-dialog',
    templateUrl: 'earthquake-data-dialog.component.html',
    standalone: true,
    imports: [MatDialogModule, MatButtonModule],
})


export class EarthquakeDataDialog { 
    constructor(@Inject(MAT_DIALOG_DATA) public data: any) {} 
}
