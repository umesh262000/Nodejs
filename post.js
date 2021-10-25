const e = require("express");
const logger=require("../helper/logger")
exports.lodash=(req,res)=>{
    const _ = require("lodash");
    let vals = [-2, 0, 3, 7, -5, 1, 2];
let number = _.filter(vals,(e)=>e>0);
logger.info(number);
let [num1,num2]=_.partition(vals,(e)=>e<0)
logger.info(num1)
logger.info(num2)
let nums2 = _.takeWhile(vals, (n) => { return n < 0 });
let nums3 = _.takeRightWhile(vals, (n) => { return n > 0 });
console.log(nums2);
console.log(nums3);


let p = {age: 24, name: "Rebecca", occupation: "teacher",
         age: 23, name: "nitesh", occupation: "developer"};

_.forIn(p, (value, key) => {
// console.log("value==>>",value);
// console.log("key==>>",key);
    console.log(`${key}: ${value}`);
})

}
