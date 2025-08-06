import { Component, OnInit } from '@angular/core';
import { SystemService } from '../../../services/common/system.service';
import { RouterModule } from '@angular/router';
import { Tuple2 } from '../../../source/models/tuple.models';
import { BreadcrumbFactory } from '../../../source/factories/breadcrumb.factory';
import { EnumSections } from '../../../source/models/enums/sections.enum';
import { BreadcrumbComponent } from '../../_shared/breadcrumb/breadcrumb.component';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [RouterModule,BreadcrumbComponent],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

    pingResponse: string = '...';
    breadcrumb: Tuple2<string,string>[] = [];
    
    constructor(private systemService: SystemService) {
        this.breadcrumb = BreadcrumbFactory.create(EnumSections.Home);
    }

    async ngOnInit() {
        await this.getPingAsync();
    }

    async getPingAsync() {
        await this.systemService.getPingAsync()
            .then(response => {
                this.pingResponse = response.data;
            })
            .catch(error => {
                this.pingResponse = 'Error fetching ping';
            });
    }

}
