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
                    <div class="row">
                        <div class="col s8">
                            <h4>Title</h4>
                            <input id="title" type="text" v-model="recipe.title" @change="updateId()" placeholder="The greatest dish on earth...!" class="validate">
                            <h4>Description</h4>
                            <textarea id="description" v-model="recipe.description" placeholder="Simply the best..." class="materialize-textarea"></textarea>
                        </div>
                        <div class="col s4">
                            <a class="dropdown-trigger btn" :href="'#/recipe/' + recipe.id" v-show="!$root.isOnMealplan(recipe)" :data-target="'people_' + recipe.id">Add to meal plan</a>
                            <ul :id="'people_' + recipe.id" class='dropdown-content'>
                                <li><a :href="'#/recipe/' + recipe.id" @click="$root.addToMealPlan(recipe, 1)">One person</a></li>
                                <li><a :href="'#/recipe/' + recipe.id" @click="$root.addToMealPlan(recipe, 2)">Two people</a></li>
                                <li><a :href="'#/recipe/' + recipe.id" @click="$root.addToMealPlan(recipe, 3)">Three people</a></li>
                                <li><a :href="'#/recipe/' + recipe.id" @click="$root.addToMealPlan(recipe, 4)">Four people</a></li>
                                <li><a :href="'#/recipe/' + recipe.id" @click="$root.addToMealPlan(recipe, 5)">Five people</a></li>
                            </ul>
                            <a :href="'#/recipe/' + recipe.id" v-show="$root.isOnMealplan(recipe)" @click="$root.removeFromMealPlan(recipe)" class="waves-effect waves-light btn">Remove from meal plan</a>
                            <a href="#/recipes/" @click="removeRecipe()" class="waves-effect waves-light btn red darken-2"><i class="material-icons left">remove</i>Delete</a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col s12 offset-m1">
                    <div class="row">
                        <div class="col s8">
                            <h4>Directions</h4>
                            <div contenteditable="true" @input="edit" v-html="formattedText"></div>
                        </div>
                        <div class="col s4">
                            <h4>Ingredients</h4>
                            <select  v-model="recipe.for">
                                <option value="" disabled selected>Select how many people this recipe is for</option>
                                <option value="1">One person</option>
                                <option value="2">Two people</option>
                                <option value="3">Three people</option>
                                <option value="4">Four people</option>
                                <option value="5">Five people</option>
                            </select>
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
        </div>
    `,
    props: {
        recipe: {
            type: Object,
            default: function() {
                return {
                    id: null,
                    title: null,
                    description: null,
                    people: 2,
                    directions: "* "
                }
            }
        }
    },
    data: function() {
        return {
            formattedText: null,
            position: null
        }
    },
    mounted() {
        this.formattedText = this.format(this.$props.recipe ? this.$props.recipe.directions : "");
    },
    watch: {
        recipe: function(val, valOld) {
            if (!valOld.id && val.id) {
                this.formattedText = this.format(this.$props.recipe ? this.$props.recipe.directions : "");
            }
        }
    },
    computed: {
        ingredients: function() {
            var ingredients = rcp.parse(this.recipe.directions);
            ingredients = rcp.aggregate(ingredients);
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
            // Store processed data
            this.recipe.directions = this.strip(e.target.innerHTML);
        },
        format: function(html) {
            return rcp.format(html);
        },
        strip: function(html) {
            return rcp.strip(html);
        },
        removeRecipe: function() {
            // Remove from meal plan
            if (this.$root.isOnMealplan(this.recipe)) {
                this.$root.removeFromMealPlan(this.recipe)
            }
            // Remove recipe
            var i = this.$root.recipes.findIndex(r => r.id == this.recipe.id);
            if (i > -1) {
                this.$delete(this.$root.recipes, i);
            }
        },
        updateId: function() {
            this.recipe.id = this.recipe.title.toLowerCase().replace(/[^(\w|\d)]/g, "-");
            history.replaceState(undefined, undefined, `#/recipe/${this.recipe.id}`)
        },
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