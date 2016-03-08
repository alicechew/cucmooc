/////////////////////////////
//requireJS version:2.1.22 //
/////////////////////////////

requirejs.config({
    baseUrl: '../js',
    paths: {
        widgets: './widgets',
        lib: './lib',
        jquery: './lib/jquery-2.1.4.min',
        bootstrap: './lib/bootstrap'
    },
    shim: {
        bootstrap: ['jquery']
    }
});