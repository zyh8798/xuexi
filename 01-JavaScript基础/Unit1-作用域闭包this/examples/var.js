// var a = 1;
// function fn() {
//     var a = 2;
//     var a = 3;
//     console.log(a);
// }
// console.log(a);

// fn();
var a = 1;
function outer() {
    var b = 2;
    function inner() {
        var c = 3;
        console.log(a, b, c);
    }
    inner();
}
outer();