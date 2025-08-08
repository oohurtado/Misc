import { EnumSections } from "../models/enums/sections.enum";
import { IPageNavigation, IPageOrder } from "../models/paginator.models";

export class PaginatorFactory {
    static createPageNavigation(section: string): IPageNavigation {
        if (section === EnumSections.Formula1StandingsList) {
            return {
                options: [
                    { text: 'Scrap data', value: "scrap-data", disabled: false },
                ],
                icon: 'fa-solid fa-user-ninja'
            };
        }

        return null!;
    }

    static createPageOrder(section: string): IPageOrder {
        if (section === EnumSections.Formula1StandingsList) {
            return {
                options: [
                    { text: 'Type', value: 'type', disabled: false },
                    { text: 'Year', value: 'year', disabled: false },
				],
                startPosition: 1,
                isAscending: false
            };	
        }

        return null!;
    }
}