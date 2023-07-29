import { PDFPage } from "pdf-lib";

export interface FileDetails {
    fileName: string;
    Title: string;
    Author: string
    Subject: string;
    Creator: string;
    Keywords: string;
    Producer: string;
    CreationDate: Date;
    ModificationDate: Date;
}

export interface PageImages {
    page: number;
    url: string;
    fileName: string;
    data: PDFPage;
}