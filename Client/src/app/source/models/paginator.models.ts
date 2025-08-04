import { Tuple3 } from "./tuple.models";

/* page ready */
export interface IPageReady {
    orderSelected: IPageOrderSelected;
    buttonClicked?: string;
}

/* navigation models */
export interface IPageNavigation {
    options: IPageNavigationOption[];
    icon?: string;
}

export interface IPageNavigationOption { 
    text: string;
    value: string;
    disabled?: boolean;
}

/* order models */
export interface IPageOrder {
    options: IPageOrderOption[];
    startPosition: number;
    isAscending: boolean;
}

export interface IPageOrderOption {
    text: string;
    value: string;    
    disabled?: boolean;
}

export interface IPageOrderSelected {
    value: string;
    isAscending: boolean;
}

/* filter models */
export interface IPageFilter {
    section: string;    
    extra: Tuple3<string, string, boolean>[]; // param1 = val, param2 = text, param3 = checked
}