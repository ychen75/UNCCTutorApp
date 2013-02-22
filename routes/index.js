
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express', whatever: 'Andrew'});
};

exports.about = function(req, res) {
  res.render('about', { title: 'About UNCC Tutor App' });
};