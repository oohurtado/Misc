export interface IPaginatorNavigation {
    options: IPageNavigationOption[];
    icon?: string;
}

export interface IPageNavigationOption { 
    text: string;
    value: string;
    disabled?: boolean;
}