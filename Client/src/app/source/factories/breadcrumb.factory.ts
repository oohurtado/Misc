import { EnumSections } from "../models/enums/sections.enum";
import { Tuple2 } from "../models/tuple.models";

export class BreadcrumbFactory {
    static create(section: string): Tuple2<string, string>[] {
        if (section === EnumSections.Home) {
            return [
                new Tuple2<string, string>("", "Home"),
            ]
        }      
        if (section === EnumSections.Formula1StandingsList) {
            return [
                new Tuple2<string, string>("/", "Home"),
                new Tuple2<string, string>("", "Formula 1 standings"),
            ]
        }        
        if (section === EnumSections.Formula1StandingsEditor) {
            return [
                new Tuple2<string, string>("/", "Home"),
                new Tuple2<string, string>("/sections/f1-standings", "Formula 1 standings"),
                new Tuple2<string, string>("", "Editor"),
            ]
        }

        return null!;
    }
}