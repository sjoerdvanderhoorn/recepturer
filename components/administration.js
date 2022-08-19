Vue.component('administration', {
    template: `
        <div class="container">
            <div class="row" style="margin-bottom: 0;">
                <div class="col s12 offset-m1">
                    <h1 class="header">Administration</h1>
                </div>
            </div>
            <div class="row">
                <div class="col s12 offset-m1">
                    <h4>Categories</h4>
                </div>
                <div class="col s12 m6 offset-m1">
                    <table class="striped">
                        <thead>
                            <tr>
                                <th>Category</th>
                                <th>Product(s)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <template v-for="(category, index) in $root.categories">
                                <tr v-if="category.products.length==0">
                                    <td>
                                        <input type="text" v-model="category.name" />
                                    </td>
                                    <td class="right-align">
                                        <a href="#/administration/" @click="addRow(category.products, {name:null})" class="waves-effect waves-teal btn-flat"><i class="material-icons">add</i></a>
                                    </td>
                                    <td width="20">
                                        <a href="#/administration/" @click="removeRow($root.categories, index)" class="waves-effect waves-teal btn-flat"><i class="material-icons">clear</i></a>
                                    </td>
                                </tr>
                                <template v-for="(product, index2) in category.products">
                                    <tr>
                                        <td class="right-align" style="vertical-align: top;" v-if="index2==0" :rowspan="category.products.length">
                                            <input type="text" v-model="category.name" />
                                        </td>
                                        <td style="vertical-align: top;">
                                            <input type="text" v-model="product.name" />
                                        </td>
                                        <td width="20">
                                            <a href="#/administration/" @click="removeRow(category.products, index2)" class="waves-effect waves-teal btn-flat"><i class="material-icons">clear</i></a>
                                        </td>
                                    </tr>
                                </template>
                                <tr v-if="category.products.length>0">
                                    <td colspan="2">
                                    </td>
                                    <td width="20">
                                    <a href="#/administration/" @click="addRow(category.products, {name:null})" class="waves-effect waves-teal btn-flat"><i class="material-icons">add</i></a>
                                    </td>
                                </tr>
                            </template>
                        </tbody>
                    </table>
                    <a href="#/administration/" @click="addRow($root.categories, {name: null, products: []})" class="waves-effect waves-light btn"><i class="material-icons left">add</i> Add category</a>
                </div>
            </div>
            <div class="row">
                <div class="col s12 offset-m1">
                    <h4>Unit of measure</h4>
                </div>
                <div class="col s12 m6 offset-m1">
                    <table class="striped">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Unit</th>
                                <th>Conversion factor</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in $root.settings.unitofmeasure">
                                <td>
                                    <input type="text" v-model="item.name" />
                                </td>
                                <td>
                                    <input type="text" v-model="item.unit" />
                                </td>
                                <td>
                                    <input type="text" v-model="item.conversion" />
                                </td>
                                <td width="20">
                                    <a href="#/administration/" @click="removeRow($root.settings.unitofmeasure, index)" class="waves-effect waves-teal btn-flat"><i class="material-icons">clear</i></a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <a href="#/administration/" @click="addRow($root.settings.unitofmeasure, {name: null, unit: null, conversion: null})" class="waves-effect waves-light btn"><i class="material-icons left">add</i> Add unit of measure</a>
                </div>
            </div>
            <div class="row">
                <div class="col s12 offset-m1">
                    <h4>Temperature</h4>
                </div>
                <div class="col s12 m6 offset-m1">
                    <table class="striped">
                        <thead>
                            <tr>
                                <th>Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in $root.settings.temperature">
                                <td>
                                    <input type="text" v-model="item.name" />
                                </td>
                                <td width="20">
                                    <a href="#/administration/" @click="removeRow($root.settings.temperature, index)" class="waves-effect waves-teal btn-flat"><i class="material-icons">clear</i></a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <a href="#/administration/" @click="addRow($root.settings.temperature, {name: null})" class="waves-effect waves-light btn"><i class="material-icons left">add</i> Add temperature</a>
                </div>
            </div>
            <div class="row">
                <div class="col s12 offset-m1">
                    <h4>Time</h4>
                </div>
                <div class="col s12 m6 offset-m1">
                    <table class="striped">
                        <thead>
                            <tr>
                                <th>Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in $root.settings.time">
                                <td>
                                    <input type="text" v-model="item.name" />
                                </td>
                                <td width="20">
                                    <a href="#/administration/" @click="removeRow($root.settings.time, index)" class="waves-effect waves-teal btn-flat"><i class="material-icons">clear</i></a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <a href="#/administration/" @click="addRow($root.settings.time, {name: null})" class="waves-effect waves-light btn"><i class="material-icons left">add</i> Add time</a>
                </div>
            </div>
        </div>
    `,
    props: ["settings"],
    data: function() {
        return {}
    },
    updated: function() {
        rcp.settings(this.$root.settings);
    },
    methods: {
        addRow(table, template) {
            table.push(template);
        },
        removeRow: function(table, index) {
            table.splice(index, 1);
        }
    }
});