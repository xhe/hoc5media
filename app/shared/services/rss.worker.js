onmessage = function (msg) {
    var request = msg.data;
    var src = request.src;
    var mode = request.mode || 'noop';
    var options = request.options;
    console.log("received msg ehre ");
    console.log(msg);
    postMessage({ res: 'done', data: '12345' }, null);
};
function processImage(src, mode, options) {
    console.log(options); // will throw an exception if `globals` hasn't been imported before this call
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnNzLndvcmtlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInJzcy53b3JrZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsU0FBUyxHQUFHLFVBQVMsR0FBRztJQUNwQixJQUFJLE9BQU8sR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDO0lBQ3ZCLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUM7SUFDdEIsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksSUFBSSxNQUFNLENBQUE7SUFDakMsSUFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQztJQUM5QixPQUFPLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLENBQUM7SUFDbEMsT0FBTyxDQUFDLEdBQUcsQ0FBRSxHQUFHLENBQUUsQ0FBQztJQUNuQixXQUFXLENBQUMsRUFBRSxHQUFHLEVBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNyRCxDQUFDLENBQUE7QUFDRCxzQkFBc0IsR0FBRyxFQUFFLElBQUksRUFBRSxPQUFPO0lBQ3BDLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyw2RUFBNkU7QUFFdkcsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIm9ubWVzc2FnZSA9IGZ1bmN0aW9uKG1zZykge1xuICAgIHZhciByZXF1ZXN0ID0gbXNnLmRhdGE7XG4gICAgdmFyIHNyYyA9IHJlcXVlc3Quc3JjO1xuICAgIHZhciBtb2RlID0gcmVxdWVzdC5tb2RlIHx8ICdub29wJ1xuICAgIHZhciBvcHRpb25zID0gcmVxdWVzdC5vcHRpb25zO1xuICAgIGNvbnNvbGUubG9nKFwicmVjZWl2ZWQgbXNnIGVocmUgXCIpO1xuICAgIGNvbnNvbGUubG9nKCBtc2cgKTtcbiAgICBwb3N0TWVzc2FnZSh7IHJlczonZG9uZScsIGRhdGE6ICcxMjM0NScgfSwgbnVsbCk7XG59XG5mdW5jdGlvbiBwcm9jZXNzSW1hZ2Uoc3JjLCBtb2RlLCBvcHRpb25zKSB7XG4gICAgY29uc29sZS5sb2cob3B0aW9ucyk7IC8vIHdpbGwgdGhyb3cgYW4gZXhjZXB0aW9uIGlmIGBnbG9iYWxzYCBoYXNuJ3QgYmVlbiBpbXBvcnRlZCBiZWZvcmUgdGhpcyBjYWxsXG5cbn1cbiJdfQ==