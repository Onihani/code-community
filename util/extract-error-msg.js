extractErrMsg = (errArray, param) => {
  return (errArray.filter(errObj => errObj.param === param)[0]) ? errArray.filter(errObj => errObj.param === param)[0].msg : undefined;
}

module.exports = extractErrMsg