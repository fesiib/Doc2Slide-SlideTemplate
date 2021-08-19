const { getPageInfos } = require('../fitContent');
const { Templates } = require('../Templates');

let templatesLibrary = {};

const BULLETS_PRESENTATION_ID = '1HbS5f9IcAJJwWJqjLPEac03OCNu6Oz_iHfPGsbhYYO4';

async function getDataPresentations(data) {
    return new Promise(resolve => {
        let presentations = [];
        for (let presentationId in templatesLibrary) {
            presentations.push({
                presentationId: presentationId,
                pageInfo: getPageInfos(templatesLibrary[presentationId]),
            });
        }
        resolve({
            size: Object.keys(templatesLibrary).length,
            presentations: presentations,
            bulletsPresentationId: BULLETS_PRESENTATION_ID,
        });
    });
}

async function getDataSinglePresentation(data) {
    return new Promise(resolve => {
        resolve({});
    });
}

async function uploadPresentation(data) {
    return new Promise((resolve, reject) => {
        let presentation = data.presentation;
        let presentationId = presentation.presentationId;
        if (templatesLibrary.hasOwnProperty(presentationId)) {
            console.log('Already in the library, but update');
            delete templatesLibrary[presentationId];
        }    
        let templates = Templates.extractTemplates(presentation);
        templatesLibrary[presentationId] = templates;
        resolve({
            extractedTemplates: templates,
            layouts: templates.getLayouts(),
            styles: templates.getStyles(),
        });
    });
}

async function generatePresentationRequests(data, cluster) {
    let presentationId = data.presentationId;
    let resources = data.resources;
    let settings = {
        fast: true,
        method: 'greedy',
        contentControl: true,
    };

    if (data.hasOwnProperty('settings')) {
        settings = {
            ...settings,
            ...data.settings,
        };
    }
    
    if (!templatesLibrary.hasOwnProperty(presentationId)) {
        throw new Error('No such presentation with id: ' + presentationId);
    }
    let templates = templatesLibrary[presentationId];
    //return fitToPresentation(resources, templates, cluster, settings);
    return {};
}

async function generateSlideRequests(data, cluster) {
    let presentationId = data.presentationId;
    let layoutPageId = data.layoutPageId;
    let stylesPageId = data.stylesPageId;
    let sourcePageId = data.sourcePageId;
    let pageNum = data.pageNum;
    let resources = data.resources;
    let settings = {
        fast: true,
        method: 'greedy',
        contentControl: true,
    };

    if (data.hasOwnProperty('settings')) {
        settings = {
            ...settings,
            ...data.settings,
        };
    }
    
    if (!templatesLibrary.hasOwnProperty(presentationId)) {
        throw new Error('No such presentation with id: ' + presentationId);
    }
    let templates = templatesLibrary[presentationId];
    // return await fitToSlide(
    //     resources,
    //     templates,
    //     targetPageId,
    //     sourcePageId,
    //     pageNum,
    //     cluster,
    //     settings,
    // );
    return {};
}

async function generateAlternativesRequests(data, cluster) {
    let presentationId = data.presentationId;
    let sort = data.sort;
    let layoutPageId = data.layoutPageId;
    let stylesPageId = data.stylesPageId;
    let resources = data.resources;
    let settings = {
        fast: true,
        method: 'greedy',
        contentControl: true,
    };

    if (data.hasOwnProperty('settings')) {
        settings = {
            ...settings,
            ...data.settings,
        };
    }

    if (!templatesLibrary.hasOwnProperty(presentationId)) {
        throw new Error('No such presentation with id: ' + presentationId);
    }
    let templates = templatesLibrary[presentationId];
    //return await fitToAllSlides(resources, templates, sort, cluster, settings);
    return {};
}

module.exports = {
    uploadPresentation,
    generatePresentationRequests,
    generateSlideRequests,
    getDataPresentations,
    getDataSinglePresentation,
    generateAlternativesRequests,
};