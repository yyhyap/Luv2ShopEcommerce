export class Product {

    /*
    sku: string;
    name: string;    
    description: string;
    unitPrice: string;
    imageUrl: string;
    active: boolean;
    unitsInStock: number;
    dateCreated: Date;
    lastUpdated: Date;
    */
    
    constructor(public id: number, public sku: string, public name: string, public description: string, public unitPrice: number, public imageUrl: string, public active: boolean, public unitsInStock: number, public dateCreated: Date, public lastUpdated: Date)
    {

    }    
    
    /*
    private _sku: string;
    private name: string;    
    private description: string;
    private unitPrice: string;
    private imageUrl: string;
    private active: boolean;
    private unitsInStock: number;
    private dateCreated: Date;
    private lastUpdated: Date;

    constructor()
    {
        
    }

    public get sku(): string 
    {
    return this._sku;
    }

    public set sku(value: string) 
    {
    this._sku = value;
    }
    */


}
