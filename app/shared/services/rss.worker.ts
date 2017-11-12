onmessage = function(msg) {
    var request = msg.data;
    var src = request.src;
    var mode = request.mode || 'noop'
    var options = request.options;
    console.log("received msg ehre ");
    console.log( msg );
    postMessage({ res:'done', data: '12345' }, null);
}
function processImage(src, mode, options) {
    console.log(options); // will throw an exception if `globals` hasn't been imported before this call

}
