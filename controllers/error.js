const createError = require('http-errors');

exports.get404 = (req, res, next) => {
  // res.status(404).render('error/404', {
  //   pageTitle: 'Error!',
  //   path: '/500'
  // });

  res.send('OOps Page not Found');
}

exports.get500 = (req, res, next) => {
  // res.status(500).render('error/500', {
  //   pageTitle: 'Error!',
  //   path: '/500'
  // });

  res.send('OOps some Error error occured. We are working on fixing this sorry for the inconvinience');
}

exports.handle404 = (req, res, next) => {
  const error = new createError(404, 'Resource Not Found');
  next(error)
}

exports.handleError = (error, req, res, next) => {
  console.log('reached here')

  if (error.statusCode === 404) {
    console.log(error.statusCode)
    return res.redirect('/404')
  }

  if (error.statusCode === 500) {
    console.log(error)
    return redirect('/500');
  }
}
