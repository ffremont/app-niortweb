import { Contributor } from "./Contributor";
import { EventModeEnum } from "./EventModeEnum";
import { EventFormatEnum } from "./EventFormatEnum";
import { Speaker } from "./Speaker";
import { TagEnum } from "./TagEnum";
import { StateEnum } from "./StateEnum";

export interface Event{
    /**
     * Identifiant général
     */
    id:string;

    /**
     * Etat général de l'événément
     */
    state: StateEnum;

    /**
     * Type de l'événement, simple, long
     */
    format: EventFormatEnum;

    /**
     * en remote, hybride, en présentiel
     */
    mode: EventModeEnum;

    /**
     * Date de création du meetup
     */
    createdAt:number;

    /**
     * Ts 
     */
    scheduled:number;

    /**
     * Infos du speaker
     */
    speaker:Speaker;

    /**
     * Si web conf, le lien
     */
    webconfLink?: string;

    /**
     * lien youtbue live
     */
    youtubeLink?:string;

    /**
     * Durée en minute de l'événement
     */
    duration: number;

    /**
     * URL de l'image du meetup (lien cloudinary)
     * @see https://cloudinary.com/documentation/upload_widget#quick_example
     */
    image:string;

    /**
     * Titre générale
     */
    title: string;

    /**
     * Tags
     */
    tags: TagEnum[];

    /**
     * Description complète de l'événement
     */
    description:string;

    /**
     * Quantité max de personnes, par défaut 20, -1 voulant dire illimité
     */
    allowMaxContributors: number;

    /**
     * Ensemble des participants à l'événément
     */
    contributors: Contributor[];

}