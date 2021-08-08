const { v4 : uuidv4} = require('uuid');

const INCH = 914400;

const PT = 12700;

const EMU = 1;

const SMALL_ELEMENT_AREA_PERCENTAGE = 3;

const DEFAULT_SIZE = {
    width: {
        magnitude: 0,
        unit: 'EMU',
    },
    height: {
        magnitude: 0,
        unit: 'EMU',
    },
};

const DEFAULT_TRANSFORM = {
    scaleX: 1,
    scaleY: 1,
    shearX: 0,
    shearY: 0,
    translateX: 0,
    translateY: 0,
    unit: 'EMU',
}


function random() {
    let id = uuidv4();
    return id.replace(/-/g, '');
}

function correctDimension(dimension) {
    if (dimension === undefined) {
        return false;
    }
    if (!dimension.hasOwnProperty('magnitude')) {
        return false;
    }
    if (!dimension.hasOwnProperty('unit')) {
        return false;
    }
    return true;
}

function consumeDimension(dimension) {
    if (dimension === undefined) {
        throw Error('no dimension');
    }
    if (!dimension.hasOwnProperty('magnitude')) {
        return 0;
    }
    let result = dimension.magnitude;
    if (dimension.unit === 'PT') {
        result *= PT;
    }
    else if (dimension.unit === 'EMU') {
        result *= EMU;
    }
    else {
        throw Error('unit is not supported: ' + dimension.unit);
    }
    return result;
}

function consumeSize(size) {
    if (size === undefined) {
        throw Error('no field size');
    }

    return {
        width: consumeDimension(size.width),
        height: consumeDimension(size.height),
    }
}

function consumeTransform(transform) {
    if (transform === undefined) {
        transform = { ...DEFAULT_TRANSFORM };
    }

    if (!transform.hasOwnProperty('scaleX')) {
        transform.scaleX = 0;
    }

    if (!transform.hasOwnProperty('scaleY')) {
        transform.scaleY = 0;
    }

    if (!transform.hasOwnProperty('shearX')) {
        transform.shearX = 0;
    }

    if (!transform.hasOwnProperty('shearY')) {
        transform.shearY = 0;
    }

    if (!transform.hasOwnProperty('translateX')) {
        transform.translateX = 0;
    }

    if (!transform.hasOwnProperty('translateY')) {
        transform.translateY = 0;
    }

    if (transform.unit === 'PT') {
        transform.translateX *= PT;
        transform.translateY *= PT;
    }
    else if (transform.unit === 'EMU') {
        transform.translateX *= EMU;
        transform.translateY *= EMU;
    }
    else {
        throw Error('cannot support unit: ' + transform.unit);
    }
    return transform;
}

function multiplyTransforms(t1, t2) {
    t1 = consumeTransform(t1);
    t2 = consumeTransform(t2);
    let t = { ...t1 };
    t.scaleX = t1.scaleX * t2.scaleX + t1.shearX * t2.shearY;
    t.shearX = t1.scaleX * t2.shearX + t1.shearX * t2.scaleY;
    t.translateX = t1.scaleX * t2.translateX + t1.shearX * t2.translateY + t1.translateX;
    
    t.shearY = t1.shearY * t2.scaleX + t1.scaleY * t2.shearY;
    t.scaleY = t1.shearY * t2.shearX + t1.scaleY * t2.scaleY;
    t.translateY = t1.shearY * t2.translateX + t1.scaleY * t2.translateY + t1.translateY;

    return t;
}

function getPageElementType(element) {
    if (element.hasOwnProperty('shape')) {
        return 'shape';
    }
    if (element.hasOwnProperty('image')) {
        return 'image';
    }
    if (element.hasOwnProperty('line')) {
        return 'line';
    }
    if (element.hasOwnProperty('elementGroup')) {
        return 'elementGroup';
    }
    console.log('cannot find such type', element);
    return 'unspecified';
}

function toLines(layout) {
    return [];
    // let lines = [];

    // let horPts = [];
    // let verPts = [];
    
    // for (let e of layout.pageElements) {
    //     horPts.push({
    //         pt: e.startX,
    //         type: 0,
    //     });
    //     horPts.push({
    //         pt: e.finishX,
    //         type: 1,
    //     });
    //     verPts.push({
    //         pt: e.startY,
    //         type: 0,
    //     });
    //     verPts.push({
    //         pt: e.finishY,
    //         type: 1,
    //     });
    // }

    // const comparator = (p1, p2) => {
    //     if (p1.pt < p2.pt) {
    //         return -1;
    //     }
    //     if (p1.pt > p2.pt) {
    //         return 1;
    //     }
    //     if (p1.type > p2.type) {
    //         return -1;
    //     }
    //     if (p1.type < p2.type) {
    //         return 1;
    //     }
    //     return 0;
    // };

    // horPts.sort(comparator);
    // verPts.sort(comparator);

    // let open = 0;
    // for (let e of horPts) {
    //     // if (e.type === 1) {
    //     //     open -= 1;
    //     // }
    //     // else {
    //     //     open += 1;
    //     // }
    //     // if (open === 0) {
    //     //     continue;
    //     // }
    //     let color = {
    //         rgbColor: {
    //             red: 1,
    //             green: 0,
    //             blue: 0,
    //         },
    //     };

    //     if (e.type === 1) {
    //         color = {
    //             rgbColor: {
    //                 red: 0,
    //                 green: 0,
    //                 blue: 1,
    //             },
    //         }
    //     }

    //     lines.push({
    //         size: {
    //             height: {
    //                 magnitude: 7 * INCH,
    //                 unit: 'EMU',
    //             },
    //             width: {
    //                 magnitude: 0,
    //                 unit: 'EMU',
    //             },
    //         },
    //         transform: {
    //             scaleX: 1,
    //             scaleY: 1,
    //             shearX: 0,
    //             shearY: 0,
    //             translateX: e.pt,
    //             translateY: 0,
    //             unit: 'EMU',
    //         },
    //         line: {
    //             lineProperties: {
    //                 lineFill: {
    //                     solidFill: {
    //                         color: color,
    //                         alpha: 1,
    //                     }
    //                 },
    //                 weight: {
    //                     magnitude: PT,
    //                     unit: 'EMU'
    //                 },
    //                 dashStyle: 'SOLID',
    //             },
    //             lineType: 'STRAIGHT_LINE',
    //             lineCategory: 'STRAIGHT'
    //         },
    //         additional: {
    //             originalType: 'line',
    //         }
    //     });
    // }

    // open = 0;
    // for (let e of verPts) {
    //     // if (e.type === 1) {
    //     //     open -= 1;
    //     // }
    //     // else {
    //     //     open += 1;
    //     // }
    //     // if (open === 0) {
    //     //     continue;
    //     // }
    //     let color = {
    //         rgbColor: {
    //             red: 1,
    //             green: 0,
    //             blue: 0,
    //         },
    //     };

    //     if (e.type === 1) {
    //         color = {
    //             rgbColor: {
    //                 red: 0,
    //                 green: 0,
    //                 blue: 1,
    //             },
    //         }
    //     }

    //     lines.push({
    //         size: {
    //             height: {
    //                 magnitude: 0,
    //                 unit: 'EMU',
    //             },
    //             width: {
    //                 magnitude: 11 * INCH,
    //                 unit: 'EMU',
    //             },
    //         },
    //         transform: {
    //             scaleX: 1,
    //             scaleY: 1,
    //             shearX: 0,
    //             shearY: 0,
    //             translateX: 0,
    //             translateY: e.pt,
    //             unit: 'EMU',
    //         },
    //         line: {
    //             lineProperties: {
    //                 lineFill: {
    //                     solidFill: {
    //                         color: color,
    //                         alpha: 1,
    //                     }
    //                 },
    //                 weight: {
    //                     magnitude: PT,
    //                     unit: 'EMU'
    //                 },
    //                 dashStyle: 'SOLID',
    //             },
    //             lineType: 'STRAIGHT_LINE',
    //             lineCategory: 'STRAIGHT'
    //         },
    //         additional: {
    //             originalType: 'line',
    //         }
    //     });
    // }
    // return lines;
}

function isSmall(rectangle, pageSize) {
    let total = pageSize.width * pageSize.height;
    let width = rectangle.finishX - rectangle.startX;
    let height = rectangle.finishY - rectangle.startY;
    let area = width * height;
    if (area / total * 100 < SMALL_ELEMENT_AREA_PERCENTAGE) {
        return true;
    }
    return false;
}

function getRectangle(size, transform) {
    size = consumeSize(size);
    transform = consumeTransform(transform);
    
    let startX = transform.translateX;
    let startY = transform.translateY;

    let finishX = size.width * transform.scaleX + size.height * transform.shearX + transform.translateX;
    let finishY = size.width * transform.shearY + size.height * transform.scaleY + transform.translateY;

    if (startX > finishX) {
        [startX, finishX] = [finishX, startX]; 
    }

    if (startY > finishY) {
        [startY, finishY] = [finishY, startY]; 
    }
    return {
        startX,
        startY,
        finishX,
        finishY,
    };
}

function sanitizePageElements(pageElements) {
    let newPageElements = [];
    for (let pageElement of pageElements) {
        let type = getPageElementType(pageElement);
        if (type === 'unspecified') {
            continue;
        }
        if (type === 'elementGroup') {
            if (pageElement.elementGroup.hasOwnProperty('children') && Array.isArray(pageElement.elementGroup.children)) {
                pageElement.elementGroup.children = sanitizePageElements(pageElement.elementGroup.children);
            }
            else {
                continue;
            }
        }
        else if (type === 'image' || type === 'shape') {
            if (!pageElement.hasOwnProperty('size'))
                continue;
            if (!pageElement.size.hasOwnProperty('width') || !pageElement.size.hasOwnProperty('height')) {
                continue;
            }
            if (!correctDimension(pageElement.size.width) || !correctDimension(pageElement.size.height)) {
                continue;
            }
            if (pageElement.size.width.magnitude === 0 || pageElement.size.height.magnitude === 0) {
                continue;
            }
        }
        else {
            if (!pageElement.hasOwnProperty('size'))
                continue;
            if (!pageElement.size.hasOwnProperty('width') && !pageElement.size.hasOwnProperty('height')) {
                continue;
            }
            if (!correctDimension(pageElement.size.width) && !correctDimension(pageElement.size.height)) {
                continue;
            }
        }
        newPageElements.push(pageElement);
    }
    return newPageElements;
}

function calculateAdditional(pageElement, src) {
    // additional: {
    //     isReplacable: true, // not line;
    //     //union start
    //     originalType: '', // elementGroup, shape, image, video, line, table, sheetsChart, wordArt
    //     amountText: 0,
    //     mainColors: {
    //         colors: [opaqueColorTemplate],
    //     },
    //     //union end
    // }
    let additional = {
        isReplacable: true,
        originalType: '',
        text: [],
        contentUrl: [],
        mappedCntMax: 0,
        mappedCntMin: 0,
    }
    if (src.hasOwnProperty('shape')) {
        additional.isReplacable = true;
        additional.originalType = 'shape';
        if (src.shape.hasOwnProperty('text') && Array.isArray(src.shape.text.textElements)) {
            additional.text = [];
            for (let textElement of src.shape.text.textElements) {
                if (textElement.hasOwnProperty('paragraphMarker')) {
                    additional.mappedCntMax++;
                }
                if (textElement.hasOwnProperty('textRun')
                    && textElement.textRun.hasOwnProperty('content')
                ) {
                    additional.text.push(textElement.textRun.content);
                }
                else if (textElement.hasOwnProperty('autoText')
                    && textElement.autoText.hasOwnProperty('content')
                ) {
                    additional.text.push(textElement.autoText.content);
                }
            }
        }
        
    }
    else if (src.hasOwnProperty('image')) {
        additional.isReplacable = true;
        additional.originalType = 'image';
        additional.contentUrl = [src.image.contentUrl];
        additional.mappedCntMax = 1;
        additional.mappedCntMin = 1;
    }
    else if (src.hasOwnProperty('elementGroup')) {
        additional.isReplacable = true;
        additional.originalType = 'elementGroup';
        if (Array.isArray(pageElement.elementGroup.children)) {
            additional.text = [];
            additional.contentUrl = [];
            for (let ch of pageElement.elementGroup.children) {
                additional.text = additional.text.concat(ch.additional.text);
                additional.contentUrl = additional.text.concat(ch.additional.contentUrl);
            }
        }
    }
    else if (src.hasOwnProperty('video')) {
        additional.isReplacable = true;
        additional.originalType = 'video';
        additional.mappedCntMax = 1;
        additional.mappedCntMin = 1;
    }
    else if (src.hasOwnProperty('line')) {
        additional.isReplacable = false;
        additional.originalType = 'line';
    }
    else if (src.hasOwnProperty('table')) {
        additional.isReplacable = false;
        additional.originalType = 'table';
    }
    else if (src.hasOwnProperty('wordArt')) {
        additional.isReplacable = false;
        additional.originalType = 'wordArt';
        additional.text = [src.wordArt.renderedText];
    }
    else if (src.hasOwnProperty('sheetsChart')) {
        additional.isReplacable = true;
        additional.originalType = 'sheetsChart';
        additional.contentUrl = [src.sheetsChart.contentUrl];
        additional.mappedCntMax = 1;
        additional.mappedCntMin = 1;
    }
    pageElement['additional'] = additional;
    pageElement.objectId = random();
    return pageElement;
}

class Templates {
    constructor(title, pageSize) {
        this.pageSize = consumeSize(pageSize);
        this.title = title;
        this.__templates = [];
        this.__layouts = [];
        this.__customTemplateIds = [];
    }  

    copyInstance(templates) {
        Object.assign(this, templates);
    }

    __getLayout(page) {
        // in EMU
        let layout = {
            pageSize: this.pageSize,
            pageElements: [],
        };
    
        if (!page.hasOwnProperty('pageElements')) {
            page.pageElements = [];
        }
    
        for (let pageElement of page.pageElements) {
            let size = undefined;
            if (pageElement.hasOwnProperty('size')) {
                size = JSON.parse(JSON.stringify(pageElement.size));
            }
            let transform = { ...pageElement.transform };

            if (pageElement.hasOwnProperty('elementGroup')) {
                let result = this.__getCoveringRectangle(pageElement.elementGroup.children);
                size = result.size;
                transform = multiplyTransforms(transform, result.transform);
            }
            
            let rectangle = getRectangle(size, transform);

            layout.pageElements.push({
                ...rectangle,
                type: getPageElementType(pageElement),
            });
            pageElement.rectangle = { ...rectangle, unit: 'EMU' };
        }
        return layout;
    }

    __getCoveringRectangle(pageElements) {
        let layout = this.__getLayout({pageElements});

        // do transform
        
        let rectangle = {
            sx: Number.MAX_VALUE,
            sy: Number.MAX_VALUE,
            fx: -Number.MAX_VALUE,
            fy: -Number.MAX_VALUE,
        };
        for (let e of layout.pageElements) {
            rectangle.sx = Math.min(rectangle.sx, e.startX);
            rectangle.sy = Math.min(rectangle.sy, e.startY);
            rectangle.fx = Math.max(rectangle.fx, e.finishX);
            rectangle.fy = Math.max(rectangle.fy, e.finishY);
        }

        let transform = { ...DEFAULT_TRANSFORM };
        let size = JSON.parse(JSON.stringify(DEFAULT_SIZE));
        transform.translateX = rectangle.sx;
        transform.translateY = rectangle.sy;

        size.width.magnitude = rectangle.fx - rectangle.sx;
        size.height.magnitude = rectangle.fy - rectangle.sy;
        return {
            transform,
            size,
        };
    }

    __getComplexity(page) {
        return 0;
    }

    getByOriginalId(originalId) {
        for (let template of this.__templates) {
            if (template.originalId === originalId) {
                return this.copySingleTemplate(template);
            }
        }
        throw Error('There is no such pageId in presentationId', originalId);
    }

    randomDraw() {
        if (this.__customTemplateIds.length > 0) {
            let preId = Math.floor(Math.random() * this.__customTemplateIds.length);
            let id = this.__customTemplateIds[preId];
            return this.copySingleTemplate(this.__templates[id]);   
        }
        else if (this.__templates.length > 0) {
            let id = Math.floor(Math.random() * this.__templates.length);
            return this.copySingleTemplate(this.__templates[id]);   
        }
        throw Error('There is no templates');
    }

    refreshIdsPageElement(pageElement) {
        pageElement.objectId = random();
        if (pageElement.hasOwnProperty('elementGroup')) {
            if (!Array.isArray(pageElement.elementGroup.children))
                return;
            for (let child of pageElement.elementGroup.children) {
                this.refreshIdsPageElement(child);
            }
        }
    }

    copySingleTemplate(originalTemplate) {
        let template = JSON.parse(JSON.stringify(originalTemplate));
        template.pageId = random();
        template.informationBoxId = random();

        for (let pageElement of template.page.pageElements) {
            this.refreshIdsPageElement(pageElement);
        }
        
        return template;
    }
 
    __add(layout, pageId, originalId, pageNum, page, weight, isCustom) {

        page.pageElements = page.pageElements.concat(toLines(layout));

        let informationBoxId = random();

        if (isCustom) {
            this.__customTemplateIds.push(this.__templates.length);
        }
        this.__templates.push({
            pageId,
            page,
            pageNum,
            weight,
            originalId,
            isCustom,
            informationBoxId,
        });
        this.__layouts.push({
            layout,
        });
    }

    addCustom(pageId, originalId, pageNum, page) {
        if (Array.isArray(page.pageElements)) {
            page.pageElements = sanitizePageElements(page.pageElements);
        }
        else {
            console.log('no page elements', page);
        }
        page = this.sanitizePage(page);

        if (this.__getComplexity(page) <= 0.5) {
            let layout = this.__getLayout(page);
            this.__add(layout, pageId, originalId, pageNum, page, 2, true);
        }
    }

    addDefault(pageId, originalId, pageNum, page) {
        if (Array.isArray(page.pageElements)) {
            page.pageElements = sanitizePageElements(page.pageElements);
        }
        else {
            console.log('no page elements', page);
        }
        let layout = this.__getLayout(page);
        this.__add(layout, pageId, originalId, pageNum, page, 1, false);
    }

    getTemplates() {
        return this.__templates.slice(0);
    }

    getCustomTemplates() {
        let customTemplates = [];
        let templates = this.getTemplates();
        for (let id of this.__customTemplateIds) {
            customTemplates.push(templates[id]);
        }
        return customTemplates;
    }

    __transformElementGroups(pageElements, method = 'extract') {
        let newPageElements = [];
        for (let pageElement of pageElements) {
            if (!pageElement.hasOwnProperty('elementGroup')) {
                newPageElements.push(pageElement);
                continue;
            }
            if (!pageElement.elementGroup.hasOwnProperty('children')) {
                continue;
            }
            let children = this.__transformElementGroups(pageElement.elementGroup.children, method);
            if (children.length === 0) {
                continue;
            }
            if (method === 'extract') {
                for (let ch of children) {
                    if (pageElement.hasOwnProperty('transform')) {
                        let transform = { ...ch.transform };
                        transform = multiplyTransforms(pageElement.transform, transform);
                        ch.transform = { ...transform };
                    }
                    ch = calculateAdditional(ch, ch);
                    if (ch.hasOwnProperty('image')) {
                        newPageElements.push(ch);
                    }
                    else if (ch.hasOwnProperty('shape') 
                        && ch.shape.hasOwnProperty('shapeType') 
                        && ch.shape.shapeType === 'TEXT_BOX'
                    ) {
                        newPageElements.push(ch);
                    }
                }
            }
            else if (method === 'merge') {
                let result = this.__getCoveringRectangle(children);

                if (pageElement.hasOwnProperty('transform')) {
                    result.transform = multiplyTransforms(pageElement.transform, result.transform);
                }

                if (result.size.height.magnitude === 0 || result.size.width.magnitude === 0) {
                    continue;
                }
                if (result.size.height.magnitude < 0 || result.size.width.magnitude < 0) {
                    console.log(result, pageElements, this.__getLayout({pageElements: children}));
                }


                let newPageElement = {
                    size: result.size,
                    transform: result.transform,
                    shape: {
                        shapeType: 'RECTANGLE',
                        shapeProperties: {
                            outline: {
                                outlineFill: {
                                    solidFill: {
                                        color: {
                                            rgbColor: {
                                                red: 0,
                                                green: 1,
                                                blue: 0,
                                            },
                                        },
                                        alpha: 1,
                                    }
                                },
                                weight: {
                                    magnitude: PT,
                                    unit: 'EMU',
                                },
                                dashStyle: 'DOT',
                            }
                        },
                        placeholder: {
                            type: 'OBJECT',
                        }
                    }
                }
                newPageElement = calculateAdditional(newPageElement, newPageElement);
                newPageElements.push(newPageElement);
            }
        }
        return newPageElements;
    }
    
    __mergeIntersectingElements(page) {

        return page;
    }
    
    __deleteSmallElements(page) {
        let layout = this.__getLayout(page);
        let n = layout.pageElements.length;
        if (n !== page.pageElements.length) {
            throw Error("issue with layout and page");
        }
        let newPageElements = [];
        for (let i = 0; i < n; i++) {
            let rectangle = layout.pageElements[i];
            let pageElement = page.pageElements[i];
            if (isSmall(rectangle, layout.pageSize)) {
                continue;
            }
            newPageElements.push(pageElement);
        }
        page.pageElements = newPageElements;
        return page;
    }

    sanitizePage(page) {

        page.pageElements = this.__transformElementGroups(page.pageElements);
        page = this.__deleteSmallElements(page);
        page = this.__mergeIntersectingElements(page);
        return page;
    }
}

module.exports = {
    Templates,
    consumeSize,
    getRectangle,
    calculateAdditional,
};