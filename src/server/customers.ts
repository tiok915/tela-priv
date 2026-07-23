import p1 from "@/database/peoples/1.json";
import p2 from "@/database/peoples/2.json";
import p3 from "@/database/peoples/3.json";
import p4 from "@/database/peoples/4.json";
import p5 from "@/database/peoples/5.json";
import p6 from "@/database/peoples/6.json";
import p7 from "@/database/peoples/7.json";
import p8 from "@/database/peoples/8.json";
import p9 from "@/database/peoples/9.json";
import p10 from "@/database/peoples/10.json";
import p11 from "@/database/peoples/11.json";
import p12 from "@/database/peoples/12.json";
import p13 from "@/database/peoples/13.json";
import p14 from "@/database/peoples/14.json";
import p15 from "@/database/peoples/15.json";
import p16 from "@/database/peoples/16.json";
import p17 from "@/database/peoples/17.json";

type Person = {
    nome: string;
    cpf: string;
    email: string;
    celular: string;
};

export type Customer = {
    name: string;
    email: string;
    phone: string;
    document: string;
};

const PEOPLE = [
    p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13, p14, p15, p16, p17,
].flat() as Person[];

const digits = (value: string): string => value.replace(/\D/g, "");

export const randomCustomer = (): Customer => {
    const person = PEOPLE[Math.floor(Math.random() * PEOPLE.length)];
    return {
        name: person.nome,
        email: person.email,
        phone: digits(person.celular),
        document: digits(person.cpf),
    };
};
