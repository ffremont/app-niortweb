

export interface Contributor{
    email:string;
    fullName?:string;

    /**
     * En quelques mots, je me présente
     */
    iam?:string;

    
    comment?:string;


    /**
     * Indique si le contributeur viendra en présentiel
     */
     faceToFace?: boolean;
}