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