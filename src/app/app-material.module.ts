import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';

@NgModule({
    imports: [
        CommonModule,
        MatButtonModule,
        MatDividerModule,
        MatListModule,
        MatSelectModule,
        MatTableModule
    ],
    exports: [
        MatButtonModule,
        MatDividerModule,
        MatListModule,
        MatSelectModule,
        MatTableModule
    ]
})
export class AppMaterialModule { }