var app  = require('express')()
var fs = require('fs')
app.listen(3000, function(){
    console.log('listening on port 3000')
})
function buildBundle(){
    var webpack = require('webpack')
    var webpackDevMiddleware = require('webpack-dev-middleware')
    var config = require('./webpack.config')
    var compiler = webpack(config)
    app.use(webpackDevMiddleware(compiler, {noInfo: true, publicPath: config.output.publicPath}))
}
buildBundle()
app.get('/', function(req, res){
    var html = fs.readFileSync('./index.html', 'utf8')
    res.send(html)
})