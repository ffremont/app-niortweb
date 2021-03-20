

export interface Review{
    email:string;
    
    /**
     * Note qualité générale
     */
    note:number;
    /**
     * En savoir plus
     */
    findOutMore:boolean;

    /**
     * Commentaire
     */
    comment?:string;
}