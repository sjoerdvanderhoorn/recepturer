Vue.component('recipe', {
    template: `
        <div class="container">
            <div class="row" style="margin-bottom: 0;">
                <div class="col s12 offset-m1">
                    <h1 class="header">Recipe</h1>
                </div>
            </div>
            <div class="row" style="margin-bottom: 0;">
                <div class="col s12 offset-m1">
                    Title
                    Description
                    Picture
                    Add to menu
                </div>
            </div>
            <div class="row">
                <div class="col s12 offset-m1">
                    <div class="row">
                        <div class="col s8">
                            <h4>Bereidingswijze</h4>
                            <div contenteditable="true" @input="edit" v-html="formattedText"></div>
                        </div>
                        <div class="col s4">
                            <h4>Ingredienten</h4>
                            <table class="striped">
                                <tbody>
                                    <tr v-for="ingredient in ingredients">
                                        <td>
                                            {{ingredient.quantity}}
                                        <td>
                                            {{ingredient.unit}}
                                        </td>
                                        <td>
                                            {{ingredient.product}}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col s12 offset-m1">
                    <h4>Debug</h4>
                    <div>Caret: {{position}}</div>
                    <pre style="background-color: lightgray;">{{outputText}}</pre>
                </div>
            </div>
        </div>
    `,
    props: ["text"],
    data: function() {
        return {
            outputText: this.strip(this.text),
            position: null
        }
    },
    created: function() {
        // Declare private variables
        this.ingredientRegex = /\b([\d\,\.]+)\s(gram|paar|stuks|kilo|liter|tenen|teentjes|stengel|stengels|el|eetlepel|l|k|g)\s([\w\-\'\’\`]+)/gi;
        this.temperatureRegex = /\b(\d+|hoog|laag|normaal|klein|groot)\s(vuur|vermogen|fahrenheit|graden celsius|graden|celsius)\b/gi;
        this.timeRegex = /\b(([\d\,\.\-]| tot )+)\s(min|minuten|minuut|uren|uur|seconde|seconden|secondes)\b/gi;
    },
    mounted: function() {

    },
    computed: {
        formattedText: function() {
            return this.format(this.$props.text);
        },
        ingredients: function() {
            var ingredients = this.outputText.match(this.ingredientRegex);
            ingredients = (ingredients || []).map(ingredient => {
                // Parse quantity, unit, and product from ingredient
                var match = ingredient.match(new RegExp(this.ingredientRegex, "i"));
                return {
                    quantity: parseFloat(match[1].replace(",", ".")),
                    unit: match[2],
                    product: match[3]
                };
            }).reduce((all, ingredient) => {
                // Combine ingredients that have the same unit and product
                var existing = all.find(item => item.unit == ingredient.unit && item.product == ingredient.product);
                if (existing) {
                    existing.quantity += ingredient.quantity;
                } else {
                    all.push(ingredient);
                }
                return all;
            }, []).sort((a, b) => {
                // Order ingredients by product name and then quantity
                return a.product.localeCompare(b.product) || a.quantity - b.quantity;
            });
            return ingredients;
        }
    },
    methods: {
        edit: function(e) {
            // Get caret position
            this.position = Cursor.getCaret(e.target);
            // To avoid line jumping, process text only when no new line is added
            if (e.inputType != "insertParagraph") {
                // Format text
                e.target.innerHTML = this.format(e.target.innerHTML);
                // Restore caret position
                Cursor.setCaret(e.target, this.position);
                e.target.focus();
            }
            // Store output
            this.outputText = this.strip(this.formattedText);
        },
        format: function(html) {
            // Remove current formatting
            html = this.strip(html);
            // Mark using regular expressions
            html = html.replace(this.ingredientRegex, "<span class='recipe ingredient'>$&</span>");
            html = html.replace(this.temperatureRegex, "<span class='recipe temperature'>$&</span>");
            html = html.replace(this.timeRegex, "<span class='recipe time'>$&</span>");
            // Add formatting for lists and newlines
            html = html.replace(/\n\*\s(.*)/gi, "<ol><li>$1</li></ol>");
            html = html.replace(/<\/li><\/ol><ol><li>/gi, "</li><li>");
            html = html.replace(/\n/gi, "<br/>");
            //console.log(html)
            return html;
        },
        strip: function(html) {
            html = html.replace(/<(div|br)(.*?)>/gi, "\n");
            html = html.replace(/<li>/gi, "\n* ");
            html = html.replace(/<(.*?)>/gi, "");
            //html = html.replace(/&nbsp;/gi, " ");
            //html = html.replace(/" "+/g, " ");
            return html;
        }
    }
});


class Cursor {
    // Credits to Liam and RedDragonWebDesign (Stack Overflow)
    // https://stackoverflow.com/a/41034697/3480193
    static getCaret(parentElement) {
        var selection = window.getSelection(),
            charCount = -1,
            node;
        if (selection.focusNode) {
            if (Cursor._isChildOf(selection.focusNode, parentElement)) {
                node = selection.focusNode;
                charCount = selection.focusOffset;
                while (node) {
                    if (node === parentElement) {
                        break;
                    }
                    if (node.previousSibling) {
                        node = node.previousSibling;
                        charCount += node.textContent.length;
                    } else {
                        node = node.parentNode;
                        if (node === null) {
                            break;
                        }
                    }
                }
            }
        }
        return charCount;
    }
    static setCaret(element, chars) {
        if (chars >= 0) {
            var selection = window.getSelection();
            let range = Cursor._createRange(element, { count: chars });
            if (range) {
                range.collapse(false);
                selection.removeAllRanges();
                selection.addRange(range);
            }
        }
    }
    static _createRange(node, chars, range) {
        if (!range) {
            range = document.createRange()
            range.selectNode(node);
            range.setStart(node, 0);
        }
        if (chars.count === 0) {
            range.setEnd(node, chars.count);
        } else if (node && chars.count > 0) {
            if (node.nodeType === Node.TEXT_NODE) {
                if (node.textContent.length < chars.count) {
                    chars.count -= node.textContent.length;
                } else {
                    range.setEnd(node, chars.count);
                    chars.count = 0;
                }
            } else {
                for (var lp = 0; lp < node.childNodes.length; lp++) {
                    range = Cursor._createRange(node.childNodes[lp], chars, range);

                    if (chars.count === 0) {
                        break;
                    }
                }
            }
        }
        return range;
    }
    static _isChildOf(node, parentElement) {
        while (node !== null) {
            if (node === parentElement) {
                return true;
            }
            node = node.parentNode;
        }
        return false;
    }
}