export default class utils{
    static columnNames = ['a','b','c','d','e','f','g','h'];
    static rowNames = ['1','2','3','4','5','6','7','8'];
    static convertTileNamesToIndices(tileNames:Array<string>){
        const columnNames = ['a','b','c','d','e','f','g','h'];
        const rowNames = ['1','2','3','4','5','6','7','8'];
        const result: Array<number> = [];
        for (let index = 0; index < tileNames.length; index++) {
            const element = tileNames[index];
            const colIndex = columnNames.indexOf(element[0]);
            const rowIndex = rowNames.indexOf(element[1]);
            result.push(colIndex+ 8*rowIndex);
        }
        return result;
    }

    static convertTileIndiciesToName(index:number): string{
        const columnNames = ['a','b','c','d','e','f','g','h'];
        const rowNames = ['1','2','3','4','5','6','7','8'];

        const rowIndex = Math.floor(index/8);
        const colIndex = index%8;

        return columnNames[colIndex] + rowNames[rowIndex];

    }
}