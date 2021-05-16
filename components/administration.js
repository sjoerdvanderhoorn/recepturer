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
                    <h4>Unit of measure</h4>
                </div>
            </div>
            <div class="row">
                <div class="col s12 offset-m1">
                    <h4>Temperature</h4>
                </div>
            </div>
            <div class="row">
                <div class="col s12 offset-m1">
                    <h4>Time</h4>
                </div>
            </div>
            <div class="row">
                <div class="col s12 offset-m1">
                    <h4>Categories</h4>
                </div>
                <div class="col s12 offset-m1">
                    <ul>
                        <li v-for="category in $root.categories">
                            {{ category.title }}
                            <ul>
                                <li v-for="product in category.products">
                                    {{ product }}
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    `,
    props: [],
    data: function() {
        return {}
    },
    methods: {

    }
});