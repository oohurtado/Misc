import { Component } from '@angular/core';
import { Tuple2 } from '../../../../source/models/tuple.models';
import { BreadcrumbComponent } from '../../../_shared/breadcrumb/breadcrumb.component';
import { BreadcrumbFactory } from '../../../../source/factories/breadcrumb.factory';
import { EnumSections } from '../../../../source/models/enums/sections.enum';

@Component({
    selector: 'app-formula1-standings-editor',
    standalone: true,
    imports: [BreadcrumbComponent],
    templateUrl: './formula1-standings-editor.component.html',
    styleUrl: './formula1-standings-editor.component.css'
})
export class Formula1StandingsEditorComponent {
    breadcrumb: Tuple2<string,string>[] = [];

    constructor() {
        this.breadcrumb = BreadcrumbFactory.create(EnumSections.Formula1StandingsEditor);
    }
}
