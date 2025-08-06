import { Component, Input } from '@angular/core';
import { Tuple2 } from '../../../source/models/tuple.models';
import { Router } from '@angular/router';
import { Utils } from '../../../source/helpers/utils.helper';

@Component({
    selector: 'app-breadcrumb',
    standalone: true,
    imports: [],
    templateUrl: './breadcrumb.component.html',
    styleUrl: './breadcrumb.component.css'
})
export class BreadcrumbComponent {

    @Input() data: Tuple2<string,string>[] = [];

    constructor(private router: Router) {
    }
    
    async onClicked(item: Tuple2<string,string>) {
        this.router.navigateByUrl(item.param1);    
    }
}
