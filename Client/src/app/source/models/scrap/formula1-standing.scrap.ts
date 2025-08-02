export class Scr_Formula1StandingScrap {
    raceTracks: string[] = [];
    columnLabels?: Scr_Formula1Standing_ColumnLabel[];
    rowLabels?: Scr_Formula1Standing_RowLabel[];
}

export class Scr_Formula1Standing_ColumnLabel {
    position: string = '';
    image: string = '';
    abbreviation: string = '';
    name: string = '';
}

export class Scr_Formula1Standing_RowLabel {
    points: string[] = [];
}