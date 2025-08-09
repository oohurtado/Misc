import { Component, OnDestroy, OnInit } from '@angular/core';
import { Tuple2, Tuple3 } from '../../../../source/models/tuple.models';
import { BreadcrumbComponent } from '../../../_shared/breadcrumb/breadcrumb.component';
import { BreadcrumbFactory } from '../../../../source/factories/breadcrumb.factory';
import { EnumSections } from '../../../../source/models/enums/sections.enum';
import { ActivatedRoute } from '@angular/router';
import { ScrapService } from '../../../../services/scrap.service';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EnumFormula1StandingType } from '../../../../source/models/enums/formula1-standing-types.enum';
import { Scr_Formula1StandingRequest } from '../../../../source/models/scrap/formula1-standing.request';
import { Utils } from '../../../../source/helpers/utils.helper';
import { HubConnection, HubConnectionBuilder, IHttpConnectionOptions } from '@microsoft/signalr';
import { general } from '../../../../source/general';
import { Scr_Formula1StandingHub } from '../../../../source/models/scrap/formula1-standing.hub';
import { TheMessangerComponent } from "../../../_shared/the-messanger/the-messanger.component";

@Component({
    selector: 'app-formula1-standings-editor',
    standalone: true,
    imports: [BreadcrumbComponent, ReactiveFormsModule, TheMessangerComponent],
    providers: [DatePipe],
    templateUrl: './formula1-standings-editor.component.html',
    styleUrl: './formula1-standings-editor.component.css'
})
export class Formula1StandingsEditorComponent implements OnInit, OnDestroy {

    hubConnection!: HubConnection;
    connectedToHub!: boolean;
    connectionId!: string | null;

    myForm!: FormGroup;
    types!: string[];
    years!: number[];
    
    errorMessage!: string | null;
    isProcesing!: boolean;

    breadcrumb: Tuple2<string,string>[] = [];    
    
    columns: string[] = ['Origin', 'Time', 'Message'];
    messages: string[][] = [];    


    START_YEAR: number = 2001;
    END_YEAR: number = new Date().getFullYear();
    
    constructor(
        private datePipe: DatePipe,
        private scrapService: ScrapService,
        private activatedRoute: ActivatedRoute,
        private formBuilder: FormBuilder) {

        this.initEditor();
        this.initHub();
    }

    initEditor() {
            this.breadcrumb = BreadcrumbFactory.create(EnumSections.Formula1StandingsEditor);

        this.types = [
            EnumFormula1StandingType.Constructors,
            EnumFormula1StandingType.Drivers
        ];
        
        this.years = [];
        for(let i = this.START_YEAR; i <= this.END_YEAR; i++) {
            this.years.push(i);
        }
        this.years = this.years.reverse();

        this.isProcesing = false;
    }

    async ngOnInit() {
        this.activatedRoute.params.subscribe(async params => {			
			let type: string | undefined = params['type'];
            let year: number | undefined = params['year'];

            if (type !== undefined && year !== undefined) {                
                await this.getDataAsync(type, year);
            }            
            this.setupForm(type, year);
		});	

        this.startHub();
    }

    async ngOnDestroy() {
        await this.endHub();
    }

    async getDataAsync(type: string, year: number) {  
        this.errorMessage = null;
        await this.scrapService
            .getFormula1StandingsExistsAsync(type, year)
            .then(p => {                
            })
            .catch(p => {
                this.errorMessage = Utils.getErrorsResponse(p);
            });
    }

    setupForm(type: string | undefined, year: number | undefined) {
        this.myForm = this.formBuilder.group({
            type: [null, [Validators.required]],
            year: [null, [Validators.required]],
        });

        if (type !== undefined) {
            this.myForm.get('type')?.setValue(type);
        }
        if (year !== undefined) {
            this.myForm.get('year')?.setValue(year);
        }
    }

    async onDoneClicked() {
        this.errorMessage = null;        
        if (!this.isFormValid()) {
            return;
        }

        let request = new Scr_Formula1StandingRequest(
            this.connectionId ?? '',
            this.myForm?.controls['type'].value,
            this.myForm?.controls['year'].value
        )

        let dateStr = this.datePipe.transform(new Date(), 'hh:mm:ss a');
        this.messages.push(["Local", dateStr ?? '', `Request started`]);

        this.isProcesing = true;
        await this.scrapService
            .scrapFormula1StandingsAsync(request)
            .then(p => {
            })
            .catch(e => {
                this.errorMessage = Utils.getErrorsResponse(e);
            });
        this.isProcesing = false;

        let dateStr2 = this.datePipe.transform(new Date(), 'hh:mm:ss a');
        this.messages.push(["Local", dateStr2 ?? '', `Request completed`]);
    }

    isFormValid() {
        if (this.myForm?.invalid || this.myForm?.status === "INVALID" || this.myForm?.status === "PENDING") {
            Object.values(this.myForm.controls)
                .forEach(control => {
                    control.markAsTouched();
                });

            return false;
        }

        return true;
    }

    hasError(nameField: string, errorCode: string) {
        return this.myForm?.get(nameField)?.hasError(errorCode) && this.myForm?.get(nameField)?.touched;
    }

    initHub() {
        this.connectedToHub = false;

		const options: IHttpConnectionOptions = {	
		};

        this.hubConnection = new HubConnectionBuilder()
			.withUrl(general.THE_MESSANGER_HUB, options)
			.build();

		this.hubConnection.on("NotifyToCaller", (data: Scr_Formula1StandingHub) => {
            let dateStr = this.datePipe.transform(new Date(), 'hh:mm:ss a');
            this.messages.push(["Server", dateStr ?? '', `${data.message}`]);
		});

        // Recibir el ConnectionId asignado
        this.hubConnection.on('ReceiveConnectionId', (connectionId: string) => {
            this.connectionId = connectionId;
            console.log('ConnectionId asignado:', connectionId);
        });

		this.hubConnection.onclose(() => {
            this.connectedToHub = false;
		});			            
    }

    startHub() {
        this.hubConnection.start()
            .then(_ => {
                this.connectedToHub = true;                
            }).catch(error => {
                this.connectedToHub = false;
            });		
    }

    async endHub() {
        try {
            await this.hubConnection.stop();      
        } catch (err) { }
    }
}
