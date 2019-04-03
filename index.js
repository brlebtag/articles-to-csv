#!/usr/bin/env node
"use strict";

const IO = require('./helpers/io');
const Path = require('path');
const cheerio = require('cheerio');

async function processaXML(xml) {
    const $ = cheerio.load(xml, {
        normalizeWhitespace: true,
        xmlMode: true
    });
    const sections = $('issue sections section');
    const articles = $('issue articles article');

    let secoesXML = '';

    sections.each((i, el) => {
        const section = $(el);
        const abrv = $('abbrev', section).text();
        const title = $('title[locale="en_US"]', section).text();
        const titulo = $('title[locale="pt_BR"]', section).text();
        secoesXML += `${titulo};${title};${abrv}\n`;
    });

    await IO.write(Path.join(__dirname, './secoes.csv'), secoesXML);

    let artigosXML = '';
    let autoresXML = '';

    articles.each((i, el) => {
        const article = $(el);
        const seq = article.prop('seq');
        const section = article.prop('section_ref');
        const lang = article.prop('locale').replace('_BR', '').replace('_US', '');
        const title = $('title[locale="en_US"]', article).text();
        const titulo = $('title[locale="pt_BR"]', article).text();
        const abstract = $('abstract[locale="en_US"]', article).text();
        const resumo = $('abstract[locale="pt_BR"]', article).text();
        const pages = $('pages', article).text();
        const [ini, fim] = pages.split(' - ');
        const keywords =
            $('keywords[locale="en_US"] keyword', article)
            .map((i, el1) => {
                return $(el1).text();
            })
            .get()
            .join(';');
        const palavrasChaves =
            $('keywords[locale="pt_BR"] keyword', article)
            .map((i, el1) => {
                return $(el1).text();
            })
            .get()
            .join(';');

        const autores = $('authors author', article);

        autores.each((i, el1) => {
            const autor = $(el1);
            const firstName = $('firstname', autor).text();
            const lastName = $('lastname', autor).text();
            const email = $('email', autor).text();
            const afiliacao = $('affiliation[locale="pt_BR"]', autor).text();
            const affiliation = $('affiliation[locale="en_US"]', autor).text();

            autoresXML += `${seq};${firstName};;${lastName};${afiliacao};${affiliation};Brasil;${email};;;\n`;
        });

        artigosXML += `${seq}|${lang}|${section}|${titulo}|${title}|${resumo}|${abstract}|${palavrasChaves}|${keywords}|${ini}|PDF|${ini}-${fim}.pdf\n`;
    });

    await IO.write(Path.join(__dirname, './artigos.csv'), artigosXML);
    await IO.write(Path.join(__dirname, './autores.csv'), autoresXML);
}

async function processarArgv() {
    if (process.argv.length !== 3) {
        console.log("Por favor informe o nome do arquivo como parametro.");
    } else {
        let param = process.argv[2];
        let file;

        if (param.charAt(0) == '/') {
            file = param;
        } else {
            file = Path.join(__dirname, param);
        }
        
        console.log(`Processando arquivo ${file}`);
        return await IO.read(file);      
    }
}

async function processarManual() {
    const file = "/home/brlebtag/Documentos/mestrado/orientador/SBSI2017/sbsi2017.xml";
    return await IO.read(file);
}

async function main() {
    processaXML(await processarArgv());
}

main();