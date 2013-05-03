/*
Recursively merge properties and return new object
obj1 <- obj2 [ <- ... ]
*/
exports.merge = function() {
    var dst = {},src, p ,args = [].splice.call(arguments, 0);
    while (args.length > 0) {
        src = args.splice(0, 1)[0];
        if (toString.call(src) == '[object Object]') {
            for (p in src) {
                if (src.hasOwnProperty(p)) {
                    if (toString.call(src[p]) == '[object Object]') {
                        dst[p] = merge(dst[p] || {}, src[p]);
                    } else { dst[p] = src[p]; }
                }
            }
        }
    }
    return dst;
}