//图片验证码生成
var svgCaptcha = require("svg-captcha");

exports.getCode = (req,res)=>{
    var codeConfing = {
        size:4,
        ignoreChars:'0o1il',
        noise:2,
        height:44
    }

    var captcha = svgCaptcha.create(codeConfing);
    req.session.captcha = captcha.text.toLowerCase();

    return captcha.data;
}