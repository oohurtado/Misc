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

@Component({
    selector: 'app-formula1-standings-editor',
    standalone: true,
    imports: [BreadcrumbComponent, DatePipe, ReactiveFormsModule],
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
    messages: Tuple3<string, string, Date>[] = [];


    START_YEAR: number = 2001;
    END_YEAR: number = new Date().getFullYear();
    
    constructor(
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
                this.messages.push(new Tuple3("Local", `Parameters received (type:${type}, year:${year})`, new Date));
                await this.getDataAsync(type, year);
            }
            else {
                this.messages.push(new Tuple3("Local", "No parameters received", new Date()));
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

        this.messages.push(new Tuple3("Local", "Request started", new Date()));
        this.isProcesing = true;
        await this.scrapService
            .scrapFormula1StandingsAsync(request)
            .then(p => {
            })
            .catch(e => {
                this.errorMessage = Utils.getErrorsResponse(e);
            });
        this.isProcesing = false;
        this.messages.push(new Tuple3("Local", "Request completed", new Date()));
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
			this.messages.push(new Tuple3("Server", data.message, new Date()));
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
