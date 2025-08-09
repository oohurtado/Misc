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
import { EditorBase } from '../../../../source/editor-base';

@Component({
    selector: 'app-formula1-standings-editor',
    standalone: true,
    imports: [BreadcrumbComponent, ReactiveFormsModule, TheMessangerComponent],
    providers: [DatePipe],
    templateUrl: './formula1-standings-editor.component.html',
    styleUrl: './formula1-standings-editor.component.css'
})
export class Formula1StandingsEditorComponent extends EditorBase implements OnInit, OnDestroy {

    // editor
    types!: string[];
    years!: number[];    
    START_YEAR: number = 2001;
    END_YEAR: number = new Date().getFullYear();

    // hub
    hubConnection!: HubConnection;
    connectedToHub!: boolean;
    connectionId!: string | null;
    
    // hub messages
    columns: string[] = ['Origin', 'Time', 'Message'];
    messages: string[][] = [];   
    
    constructor(
        private datePipe: DatePipe,
        private scrapService: ScrapService,
        private activatedRoute: ActivatedRoute,
        private formBuilder: FormBuilder) {
            super();
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

        this.isProcessing = false;
    }

    async ngOnInit() {
        this.activatedRoute.params.subscribe(async params => {			
			let type: string | undefined = params['type'];
            let year: number | undefined = params['year'];

            if (type !== undefined && year !== undefined) {                
                this.setupForm(type, year);
            } else {
                this.setupForm(null!, null!);
            }
		});	

        this.startHub();
    }

    async ngOnDestroy() {
        await this.endHub();
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

        this.myForm.get('type')?.disable();
        this.myForm.get('year')?.disable();

        let request = new Scr_Formula1StandingRequest(
            this.connectionId ?? '',
            this.myForm?.controls['type'].value,
            this.myForm?.controls['year'].value
        )

        let dateStr = this.datePipe.transform(new Date(), 'hh:mm:ss a');
        this.messages.push(["Local", dateStr ?? '', `Request started`]);

        this.isProcessing = true;
        await this.scrapService
            .scrapFormula1StandingsAsync(request)
            .then(p => {
            })
            .catch(e => {
                this.errorMessage = Utils.getErrorsResponse(e);
            });
        this.isProcessing = false;

        this.myForm.get('type')?.enable();
        this.myForm.get('year')?.enable();

        let dateStr2 = this.datePipe.transform(new Date(), 'hh:mm:ss a');
        this.messages.push(["Local", dateStr2 ?? '', `Request completed`]);
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
